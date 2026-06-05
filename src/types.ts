/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SentimentAnalysis {
  polarity: number; // -1.0 to 1.0
  label: 'Positive' | 'Neutral' | 'Negative';
  trend: number[]; // 5-point data for sentiment trend chart
}

export interface EmotionData {
  joy: number; // 0-100
  sadness: number; // 0-100
  anger: number; // 0-100
  fear: number; // 0-100
  surprise: number; // 0-100
}

export interface StressTriggers {
  exams: boolean;
  projectDeadlines: boolean;
  financialIssues: boolean;
  familyIssues: boolean;
  relationshipIssues: boolean;
  evidence: string; // Text fragment justifying the detected triggers
}

export interface DriftTimelinePoint {
  segment: string; // e.g. "Trigger Point", "Mid-Conv", "Latest Beat"
  emotion: string; // Dominant emotion in this segment
  stressScore: number; // 0-100
  sentimentScore: number; // -100 to 100
}

export interface WordCloudItem {
  text: string;
  value: number; // relative frequency or weight
}

export interface AnalysisResult {
  extractedText: string;
  preprocessedText: string;
  sentiment: SentimentAnalysis;
  stressScore: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High';
  healthScore: number; // 0-100
  dominantEmotion: string;
  emotions: EmotionData;
  triggers: StressTriggers;
  driftTimeline: DriftTimelinePoint[];
  wordCloud: WordCloudItem[];
  wellnessSuggestions: string[];
}
