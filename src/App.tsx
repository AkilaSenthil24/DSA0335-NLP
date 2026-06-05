/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Brain, FileText, Sparkles, AlertCircle, 
  Mic, Image as ImageIcon, MessageSquare, 
  RefreshCw, Upload, Terminal, BookOpen, ChevronRight, HelpCircle
} from "lucide-react";
import DashboardAnalytics from "./components/DashboardAnalytics";
import PresentationHub from "./components/PresentationHub";
import { AnalysisResult } from "./types";
import { STREAMLIT_APP_CODE, REQUIREMENTS_CODE } from "./codeConstants";

// Fully representative preloaded initial sample representing student academic & relationship stress
const defaultResult: AnalysisResult = {
  extractedText: "I am extremely stressed out about the final exams next week. My project deadlines are also on the same day and I don't have enough money to register for next semester. This is piling up and my boyfriend split up with me as well.",
  preprocessedText: "extremely stressed final exams next week project deadlines same day money register next semester piling boyfriend split",
  sentiment: {
    polarity: -0.65,
    label: "Negative",
    trend: [-0.1, -0.3, -0.5, -0.65, -0.6]
  },
  stressScore: 89,
  riskLevel: "High",
  healthScore: 23,
  dominantEmotion: "Sadness",
  emotions: {
    joy: 5,
    sadness: 50,
    anger: 20,
    fear: 20,
    surprise: 5
  },
  triggers: {
    exams: true,
    projectDeadlines: true,
    financialIssues: true,
    familyIssues: false,
    relationshipIssues: true,
    evidence: "final exams next week, project deadlines are on the same day, dont have enough money, boyfriend split up with me"
  },
  driftTimeline: [
    { segment: "Intro Phase", emotion: "Fear", stressScore: 40, sentimentScore: -15 },
    { segment: "Pressure Build", emotion: "Anger", stressScore: 68, sentimentScore: -40 },
    { segment: "Financial Block", emotion: "Fear", stressScore: 78, sentimentScore: -55 },
    { segment: "Climax Trigger", emotion: "Sadness", stressScore: 89, sentimentScore: -65 },
    { segment: "Cumulative Drift", emotion: "Sadness", stressScore: 85, sentimentScore: -60 }
  ],
  wordCloud: [
    { text: "stress", value: 10 },
    { text: "failed", value: 8 },
    { text: "deadline", value: 8 },
    { text: "exam", value: 7 },
    { text: "money", value: 6 },
    { text: "boyfriend", value: 5 },
    { text: "split", value: 5 },
    { text: "piling", value: 4 },
    { text: "sadness", value: 4 },
    { text: "semester", value: 3 },
    { text: "register", value: 2 }
  ],
  wellnessSuggestions: [
    "Practice study interval breaks (50-10 rule) to manage academic burnout and restore cognitive capacity before assessments.",
    "Set up a dedicated session with the university financial advice counsellor regarding emergency support grants or deferred payment programs.",
    "Formulate boundaries and prioritize emotional space to handle interpersonal transitions without overwhelming academic operations."
  ]
};

// Alternative samples representing different emotional balances
const SAMPLES = {
  academic: {
    text: "I haven't slept in three days. The midterms are tomorrow and I feel like I'm going to fail everything. The project deadlines are piling up and matching this capstone report feels impossible. My family has high expectations and I don't want to disappoint them.",
    fileType: "text" as const
  },
  relationship: {
    text: "It's hard to breathe when I check my student account balance. Tuition is due soon and I don't have the money. To make things worse, my girlfriend has been cold lately and I think we might break up this weekend. I just need some peace of mind.",
    fileType: "text" as const
  },
  healthy: {
    text: "Had a wonderful weekend hiking in the mountains. Finally submitted my major projects and clean code scripts. Looking forward to presenting the capstone and enjoying a nice break with friends.",
    fileType: "text" as const
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "portfolio">("dashboard");
  const [inputText, setInputText] = useState(defaultResult.extractedText);
  const [fileType, setFileType] = useState<"text" | "image" | "audio">("text");
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(defaultResult);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Audio recording states and refs
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start microphone speech capture
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setFileName("live_microphone_recording.wav");
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const base64String = base64data.split(",")[1];
          setFileBase64(base64String);
          setMimeType("audio/wav");
          setFileType("audio");
        };
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err: any) {
      console.error("Mic access denied:", err);
      setError("Microphone hardware access is required. Please check your browser's recording permissions.");
    }
  };

  // Stop microphone capture
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Convert uploaded files (OCR Images or Voice .WAV) to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    setMimeType(file.type);

    const isImage = file.type.startsWith("image/");
    const isAudio = file.type.startsWith("audio/");

    if (!isImage && !isAudio) {
      setError("Unsupported file format. Please upload a .wav audio clip or a chat screenshot (.png/.jpg).");
      return;
    }

    setFileType(isImage ? "image" : "audio");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setFileBase64(base64String);
    };
    reader.onerror = (err) => {
      console.error("File reading error:", err);
      setError("Failed to digest file vectors into memory.");
    };
  };

  // Run full-stack NLP Pipeline using Gemini AI API key proxy
  const runNlpPipeline = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    // Dynamic step animation intervals to showcase B.Tech pipeline execution
    const steps = [
      "Ingesting conversational stream vectors...",
      "Running optical character transcription models...",
      "Normalizing dialogue, lowercasing tokens...",
      "Extracting linguistic subjectiveness benchmarks...",
      "Isolating active triggers and computing emotional drift over time..."
    ];

    let currentStep = 0;
    setLoadingStep(steps[currentStep]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStep(steps[currentStep]);
      }
    }, 1200);

    try {
      const payload = {
        text: fileType === "text" ? inputText : undefined,
        fileBase64: fileType !== "text" ? fileBase64 : undefined,
        mimeType: fileType !== "text" ? mimeType : undefined,
        fileType: fileType,
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "NLP Engine experienced an execution failure.");
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error("Pipeline failure:", err);
      setError(err.message || "Unidentified analytical breakdown in full-stack pipeline.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setFileBase64(null);
    setFileName(null);
    setMimeType(null);
    setFileType("text");
    setAnalysisResult(null);
    setError(null);
  };

  // Instantly inject pre-loaded samples
  const loadSample = (sampleKey: keyof typeof SAMPLES) => {
    handleReset();
    const sample = SAMPLES[sampleKey];
    setInputText(sample.text);
    setFileType("text");
    setTimeout(() => {
      const inputElement = document.getElementById("dialogue-input");
      if (inputElement) inputElement.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      {/* Header Panel */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10 shrink-0">
              <Brain className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg md:text-xl text-slate-800 tracking-tight">
                  Text-Stress & Emotional Drift NLP Tracker
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                  B.Tech Capstone Project
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Linguistic and emotional diagnostics analyzer for conversational communication feeds
              </p>
            </div>
          </div>

          {/* Navigation Tab controllers */}
          <div id="nav-tabs" className="flex rounded-xl bg-slate-100 p-1 self-start md:self-auto text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "dashboard" ? "bg-white text-slate-800 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" /> Live Analyzer
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "portfolio" ? "bg-white text-slate-800 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" /> Code & Deliverables Hub
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" ? (
          <div className="space-y-8">
            {/* Project Quick Overview Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 p-6 md:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-display border border-indigo-400/10">
                  Natural Language Processing Module
                </span>
                <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight mt-3 mb-2 text-white">
                  Detecting Stress & Emotional Drift in Conversations
                </h2>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
                  Extracts raw dialogue bubbles from screenshot logs (OCR), speech waveforms (Speech-to-Text), or typed conversation strings. Measures emotional vectors and sub-dialogue fluctuation curves to trace mental health vulnerabilities, academic anxiety, and stress triggers.
                </p>
                
                {/* Pre-loaded sample shortcuts */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <span className="text-xs text-slate-400 font-medium">Quick Analyze Samples:</span>
                  <button 
                    onClick={() => loadSample("academic")}
                    className="text-xs bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 text-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    📚 Academic Exam Stress
                  </button>
                  <button 
                    onClick={() => loadSample("relationship")}
                    className="text-xs bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 text-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    💔 Financial & Breakup Strain
                  </button>
                  <button 
                    onClick={() => loadSample("healthy")}
                    className="text-xs bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 text-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    🌿 Healthy/Calmed Status
                  </button>
                </div>
              </div>

              {/* Decorative side badge */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none hidden lg:block" />
            </div>

            {/* Main Interactive Ingestior Panel */}
            <div id="dialogue-input" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Ingestion Console Column */}
              <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-800 mb-1">
                    Multi-Channel Ingestor
                  </h3>
                  <p className="text-xs text-slate-400">Configure dialogue ingestion files and trigger core modules</p>
                </div>

                {/* File/Channel Source switches */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => { handleReset(); setFileType("text"); }}
                    className={`nav-btn py-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      fileType === "text" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" /> Text Input
                  </button>
                  <button
                    onClick={() => { handleReset(); setFileType("image"); }}
                    className={`nav-btn py-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      fileType === "image" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Screenshot
                  </button>
                  <button
                    onClick={() => { handleReset(); setFileType("audio"); }}
                    className={`nav-btn py-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      fileType === "audio" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Mic className="w-4 h-4" /> WAV Audio
                  </button>
                </div>

                {/* Conditional Source Panels */}
                <div className="space-y-4">
                  {fileType === "text" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Conversation Thread Log</label>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste dialogue threads, message screenshots transcribes, or copy-pasted logs..."
                        className="w-full h-44 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all leading-relaxed"
                      />
                    </div>
                  )}

                  {fileType === "image" && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-500 block">Screenshot Upload (OCR Extraction)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-400 focus-within:border-indigo-400 transition-all bg-slate-50 relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                        <span className="text-xs font-semibold text-slate-700 block">Select Screenshot Log</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Supports JPG, JPEG, PNG logs. Extracts bubble content.</span>
                      </div>
                      {fileName && (
                        <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs">
                          <span className="font-medium text-indigo-700 truncate">{fileName}</span>
                          <button onClick={handleReset} className="text-indigo-400 hover:text-indigo-600">×</button>
                        </div>
                      )}
                    </div>
                  )}

                  {fileType === "audio" && (
                    <div className="space-y-4">
                      <label className="text-xs font-semibold text-slate-500 block">Voice File Upload / Live Mic Record</label>
                      
                      {/* Voice File Drag box */}
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-indigo-400 transition-all bg-slate-50 relative">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <span className="text-xs font-semibold text-slate-700 block text-center">Upload .WAV Waveform</span>
                        <span className="text-[9px] text-slate-400 mt-0.5 block">Direct Speech-to-Text decoding</span>
                      </div>

                      {/* Microphone module divider */}
                      <div className="flex items-center gap-3 text-slate-400 py-1 text-xs">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span>OR LIVE CAPTURE</span>
                        <div className="flex-1 h-px bg-slate-100" />
                      </div>

                      {/* Micro interaction microphone box */}
                      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden">
                        {recording && (
                          <div className="absolute inset-0 bg-rose-50/10 pointer-events-none animate-pulse" />
                        )}
                        
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <button
                            onClick={recording ? stopRecording : startRecording}
                            className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center text-white shadow-md transition-all scale-100 active:scale-95 ${
                              recording ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                            }`}
                          >
                            <Mic className={`w-5 h-5 ${recording ? "animate-bounce" : ""}`} />
                          </button>
                          
                          <span className="text-xs font-semibold text-slate-700">
                            {recording ? "Recording Acoustic Stream..." : "Capture Soundwave Input"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {recording ? "Speak now. Click again to stop & prepare payload" : "Uses browser standard MediaRecorder for WAV capture"}
                          </span>
                        </div>
                      </div>

                      {fileName && (
                        <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs">
                          <span className="font-medium text-indigo-700 truncate">{fileName}</span>
                          <button onClick={handleReset} className="text-indigo-400 hover:text-indigo-600 font-bold font-mono">×</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Large Run Pipeline CTA */}
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Reset
                  </button>
                  <button
                    onClick={runNlpPipeline}
                    disabled={loading || (fileType === "text" && !inputText) || (fileType !== "text" && !fileBase64)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-display text-xs font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-200 shrink-0" /> Run NLP Capstone Pipeline
                  </button>
                </div>
              </div>

              {/* Outputs Showcase Column */}
              <div className="lg:col-span-7 flex flex-col justify-stretch">
                {loading ? (
                  /* Modular Pipeline Progress Indicator */
                  <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    
                    <h4 className="font-display font-bold text-slate-800 text-lg mb-1">
                      Executing Pipeline Algorithms
                    </h4>
                    <p className="text-slate-400 text-xs font-mono mb-4 text-center max-w-sm">
                      {loadingStep || "Preprocessing string buffers..."}
                    </p>
                    
                    {/* Visual block steps tracking */}
                    <div className="w-full max-w-xs space-y-2 pt-4">
                      {["Ingest Multimodal Inputs", "Segment Sentences", "Linguistic Extraction & Score Calibration", "Format Analysis Result"].map((step, i) => (
                        <div key={step} className="flex items-center gap-2.5 text-[10px]">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[8px] ${
                            i < 3 ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-450"
                          }`}>
                            {i + 1}
                          </div>
                          <span className={`font-mono ${i < 3 ? "text-slate-600 font-semibold" : "text-slate-400"}`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  /* Interactive Pipeline Error Diagnostics Box */
                  <div className="flex-1 bg-white p-8 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 shadow">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h4 className="font-display font-medium text-slate-800 text-lg mb-2">
                      Pipeline Execution Interrupted
                    </h4>
                    <p className="text-slate-500 text-xs text-center max-w-md leading-relaxed mb-6">
                      {error}
                    </p>
                    <div className="space-y-4 w-full max-w-md pt-4 border-t border-slate-100">
                      <h5 className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Troubleshooting Options</h5>
                      <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                        <li>Ensure a valid model like <span className="font-mono bg-slate-50 text-slate-700 px-1 rounded font-semibold">gemini-3.5-flash</span> or server is accessible.</li>
                        <li>Reset parameters and inject one of the high- stress/exams preloaded samples in the top section to load instant diagrams.</li>
                        <li>Verify connection to developmental hosting port 3000.</li>
                      </ul>
                      <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
                      >
                        Reset and Try Again
                      </button>
                    </div>
                  </div>
                ) : analysisResult ? (
                  /* Actual Rendered Charts & KPIs Dashboard Component */
                  <DashboardAnalytics data={analysisResult} />
                ) : (
                  /* Placeholder when resetting */
                  <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 shadow-inner">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-slate-800 text-lg mb-1">
                      Ingestor Queue Awaiting Dialogue Payload
                    </h4>
                    <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed">
                      Linguistic preprocessing algorithms require string dialogue inputs or sound files to calculate stress indicators.
                    </p>
                    <button
                      onClick={() => {
                        handleReset();
                        setAnalysisResult(defaultResult);
                        setInputText(defaultResult.extractedText);
                      }}
                      className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      Load Standard Student Assessment Case
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Presentation / Review Hub */
          <PresentationHub 
            streamlitAppCode={STREAMLIT_APP_CODE} 
            requirementsCode={REQUIREMENTS_CODE} 
          />
        )}
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-100 mt-20 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>B.Tech Project Deliverable © 2026</span>
          <span className="flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5" /> NLP Processing Pipeline ver. 1.0.4 r1
          </span>
        </div>
      </footer>
    </div>
  );
}
