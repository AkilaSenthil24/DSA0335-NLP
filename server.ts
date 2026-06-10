/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

let manualKey = "";
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const firstEqual = trimmed.indexOf("=");
      const keyStr = trimmed.substring(0, firstEqual).trim();
      const valStr = trimmed.substring(firstEqual + 1).trim();
      if (keyStr === "GEMINI_API_KEY") {
        manualKey = valStr.replace(/^["']|["']$/g, "").trim();
      }
    }
  }
} catch (e) {
  console.error("Manual .env parse failed:", e);
}

const app = express();
const PORT = 3000;

// Set high upload limit for base64 sound & image processing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

function getApiKey(): string {
  let key = "";
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const firstEqual = trimmed.indexOf("=");
        const keyStr = trimmed.substring(0, firstEqual).trim();
        const valStr = trimmed.substring(firstEqual + 1).trim();
        if (keyStr === "GEMINI_API_KEY") {
          key = valStr.replace(/^["']|["']$/g, "").trim();
          break;
        }
      }
    }
  } catch (e) {
    console.error("Dynamic .env read failed:", e);
  }

  if (!key) {
    key = process.env.GEMINI_API_KEY || "";
  }

  const finalKey = key || manualKey;
  if (!finalKey) {
    throw new Error("GEMINI_API_KEY is empty. Please set it in Settings > Secrets or the .env file.");
  }
  return finalKey.replace(/^["']|["']$/g, "").trim();
}

// NLP Analysis API Endpoint
app.get("/api/debug-env", (req, res) => {
  try {
    const envKey = process.env.GEMINI_API_KEY;
    const envPath = path.resolve(process.cwd(), ".env");
    const dotEnvFileExists = fs.existsSync(envPath);
    let dotEnvFileLines: string[] = [];
    if (dotEnvFileExists) {
      const content = fs.readFileSync(envPath, "utf-8");
      dotEnvFileLines = content.split("\n").map(l => l.split("=")[0].trim());
    }
    res.json({
      envKeyLength: envKey ? envKey.length : 0,
      envKeyExists: !!envKey,
      manualKeyLength: manualKey ? manualKey.length : 0,
      dotEnvFileExists,
      dotEnvFileLines,
      nodeEnv: process.env.NODE_ENV,
      cwd: process.cwd()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { text, fileBase64, mimeType, fileType } = req.body;

    const apiKey = getApiKey();

    let parts: any[] = [];
    let promptText = "";

    if (fileType === "image" && fileBase64 && mimeType) {
      // Direct Multimodal OCR and Chat analysis
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: fileBase64,
        },
      });
      promptText = `
        You are an advanced OCR & NLP model. Extract any dialogue, messages, or text in this screenshot (which represents a chat thread or text conversation).
        Then, perform mental stress and emotional drift analysis on the extracted dialogue.
      `;
    } else if (fileType === "audio" && fileBase64 && mimeType) {
      // Direct Multimodal Speech-to-text Transcription and analysis
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: fileBase64,
        },
      });
      promptText = `
        You are an advanced Speech-to-Text & NLP model. Listen carefully, transcribe the speech, and analyze the spoken conversation.
        If there is no clear speech, detect the ambient acoustic mood, transcribe what is recognizable, and proceed with the mental stress and emotional drift analysis.
      `;
    } else {
      // Plain text analysis
      promptText = `Analyze the stress and drift in the following text: "${text || ""}"`;
    }

    // Comprehensive instruction guiding the JSON construction
    const systemInstruction = `
      You are an expert NLP Capstone Project Analysis Engine specialized in Conversational Psychology and Linguistic Feature Extraction.
      Your goal is to process the input text/screenshot/audio and provide a comprehensive and attractive NLP capstone analytics payload in JSON format.
      
      Determine the following indicators:
      1. Extract the text (OCR text from screenshot, transcript from audio, or clean input text).
      2. Provide a preprocessedText (lowercase tokens, removing stopwords and redundant punctuation, keeping key root terms).
      3. Perform sentiment analysis: polarity score (-1.0 to 1.0) and label (Positive, Neutral, Negative). Provide simulated historical 5-point data showing sentiment fluctuation inside the text sequence.
      4. Compute a reliable stressScore (0 to 100).
      5. Estimate riskLevel (Low, Moderate, High) based on stress score.
      6. Calculate a conversation healthScore (0 to 100) combining emotional balance, toxicity absence, and positivity.
      7. Detect dominantEmotion and percent weight for 5 emotions (joy, sadness, anger, fear, surprise). The sum must equal or closely approach 100.
      8. Detect any specific Stress Triggers: Exams, Project Deadlines, Financial Issues, Family Issues, Relationship Issues, and provide text evidence quoting lines from the content.
      9. Output a driftTimeline array representing 3 to 5 beats/phases of the content, mapping the emotion shift, stress, and sentiment score to showcase the project's 'Emotional Drift over Time' feature.
      10. Provide a list of 10 to 15 key words with relative sizes (1 to 10) for a visual Word Cloud.
      11. Provide 3 highly personalized, therapeutic, concrete AI Wellness Suggestions.
    `;

    parts.push({ text: promptText });

    const responseSchema = {
      type: "OBJECT",
      properties: {
        extractedText: {
          type: "STRING",
          description: "Full dialogue transcribed from speech, OCR-extracted from image, or original text input.",
        },
        preprocessedText: {
          type: "STRING",
          description: "Linguistic preprocessed text format, lowcase, essential tokens only, representing key emotional highlights.",
        },
        sentiment: {
          type: "OBJECT",
          properties: {
            polarity: { type: "NUMBER", description: "Calculated sentiment polarity from -1.0 to 1.0." },
            label: { type: "STRING", description: "One of 'Positive', 'Neutral', or 'Negative'." },
            trend: {
              type: "ARRAY",
              items: { type: "NUMBER" },
              description: "Exactly 5 numbers representing sentiment scores along the timeline from -1.0 to +1.0.",
            },
          },
          required: ["polarity", "label", "trend"],
        },
        stressScore: { type: "INTEGER", description: "Calculated stress score from 0 to 100." },
        riskLevel: { type: "STRING", description: "Must be 'Low', 'Moderate', or 'High'." },
        healthScore: { type: "INTEGER", description: "Calculated dialogue health score from 0 to 100." },
        dominantEmotion: { type: "STRING", description: "The single primary dominant emotion word." },
        emotions: {
          type: "OBJECT",
          properties: {
            joy: { type: "INTEGER", description: "Joy value 0-100." },
            sadness: { type: "INTEGER", description: "Sadness value 0-100." },
            anger: { type: "INTEGER", description: "Anger value 0-100." },
            fear: { type: "INTEGER", description: "Fear value 0-100." },
            surprise: { type: "INTEGER", description: "Surprise value 0-100." },
          },
          required: ["joy", "sadness", "anger", "fear", "surprise"],
        },
        triggers: {
          type: "OBJECT",
          properties: {
            exams: { type: "BOOLEAN", description: "Academic exams mentioned as trigger." },
            projectDeadlines: { type: "BOOLEAN", description: "Academic deadlines or assignments mentioned as trigger." },
            financialIssues: { type: "BOOLEAN", description: "Financial troubles, costs, loans or tuition issues." },
            familyIssues: { type: "BOOLEAN", description: "Family issues, pressure, household arguments." },
            relationshipIssues: { type: "BOOLEAN", description: "Breakups, relationship strain, friendships conflict." },
            evidence: { type: "STRING", description: "Direct visual text matching the identified triggers." },
          },
          required: ["exams", "projectDeadlines", "financialIssues", "familyIssues", "relationshipIssues", "evidence"],
        },
        driftTimeline: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              segment: { type: "STRING", description: "Dialogue section stage name (e.g. 'Segment 1')" },
              emotion: { type: "STRING", description: "Dominant emotion in this segment." },
              stressScore: { type: "INTEGER", description: "Stress score 0-100 in this segment." },
              sentimentScore: { type: "INTEGER", description: "Sentiment score -100 to +100 in this segment." },
            },
            required: ["segment", "emotion", "stressScore", "sentimentScore"],
          },
        },
        wordCloud: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              text: { type: "STRING" },
              value: { type: "INTEGER" },
            },
            required: ["text", "value"],
          },
          description: "10 to 15 key visual tags and emotion tokens showing NLP word frequency weights.",
        },
        wellnessSuggestions: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Exactly 3 customized mental wellness tips and stress management advice.",
        },
      },
      required: [
        "extractedText",
        "preprocessedText",
        "sentiment",
        "stressScore",
        "riskLevel",
        "healthScore",
        "dominantEmotion",
        "emotions",
        "triggers",
        "driftTimeline",
        "wordCloud",
        "wellnessSuggestions",
      ],
    };

    const requestBody = {
      contents: [
        {
          parts: parts
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: systemInstruction
          }
        ]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Gemini remote API error (${apiResponse.status}): ${errorText}`);
    }

    const resJson = await apiResponse.json();
    const candidateText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("No output generated from Gemini model.");
    }

    const outputJson = JSON.parse(candidateText.trim());
    res.json(outputJson);
  } catch (err: any) {
    console.error("API Error during analysis:", err);
    res.status(500).json({ error: err.message || "Internal server error during NLP analysis." });
  }
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`B.Tech Capstone Server running on http://localhost:${PORT}`);
  });
}

startServer();
