/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from "recharts";
import { 
  Smile, AlertTriangle, Activity, Heart, 
  Book, Calendar, DollarSign, Users, HeartCrack, 
  Sparkles, Download, ArrowRight, CornerDownRight, CheckCircle2 
} from "lucide-react";
import { AnalysisResult } from "../types";

interface DashboardAnalyticsProps {
  data: AnalysisResult;
}

export default function DashboardAnalytics({ data }: DashboardAnalyticsProps) {
  // Color palette for professional clinical feel
  const EMOTION_COLORS = {
    joy: "#10b981",       // emerald-500
    sadness: "#3b82f6",   // blue-500
    anger: "#f43f5e",     // rose-500
    fear: "#8b5cf6",      // purple-500
    surprise: "#f59e0b"   // amber-500
  };

  const pieData = [
    { name: "Joy Indicator", value: data.emotions.joy, color: EMOTION_COLORS.joy },
    { name: "Sadness Indicator", value: data.emotions.sadness, color: EMOTION_COLORS.sadness },
    { name: "Anger Indicator", value: data.emotions.anger, color: EMOTION_COLORS.anger },
    { name: "Fear Indicator", value: data.emotions.fear, color: EMOTION_COLORS.fear },
    { name: "Surprise Indicator", value: data.emotions.surprise, color: EMOTION_COLORS.surprise }
  ].filter(item => item.value > 0);

  // Parse sentiment trend for Recharts
  const sentimentTrendData = data.sentiment.trend.map((val, i) => ({
    name: `Point ${i + 1}`,
    polarity: Number((val * 100).toFixed(1))
  }));

  // Download Report locally
  const exportReport = () => {
    const reportText = `======================================================
MENTAL STRESS AND EMOTIONAL DRIFT NLP EXPORT REPORT
======================================================
Capstone Title: Detecting Mental Stress & Emotional Drift in Conversations
Status: Analysis Processed Successfully

1. CONVERSATION DIALOGUE INPUT:
"${data.extractedText}"

2. PREPROCESSED TOKEN HIGHLIGHTS (NLP STEMS):
"${data.preprocessedText}"

3. CORE ADVISORY METRICS:
- Primary Emotion Identified: ${data.dominantEmotion}
- Calculated Stress Index: ${data.stressScore}%
- Risk Classification: ${data.riskLevel}
- Conversation Quality Index: ${data.healthScore}%
- Polarity Metric: ${data.sentiment.polarity} (${data.sentiment.label})

4. KEY TRIGGER VECTORS CHECKLIST:
- Academic Exams: ${data.triggers.exams ? "DETECTED" : "CLEAR"}
- Project Deadlines: ${data.triggers.projectDeadlines ? "DETECTED" : "CLEAR"}
- Financial Troubles: ${data.triggers.financialIssues ? "DETECTED" : "CLEAR"}
- Family Pressure: ${data.triggers.familyIssues ? "DETECTED" : "CLEAR"}
- Relationship Conflicts: ${data.triggers.relationshipIssues ? "DETECTED" : "CLEAR"}
- Dialogue Justification Quotes: "${data.triggers.evidence}"

5. ACTIONABLE MENTAL BLUEPRINT RECOMMENDATIONS:
${data.wellnessSuggestions.map((tip, i) => `- [Tip ${i + 1}]: ${tip}`).join("\n")}

======================================================
B.TECH NLP CAPSTONE BLUEPRINT 2026 - EXPORT COMPLETE
======================================================`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nlp_capstone_stress_report.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="analytics-grid" className="space-y-8 animate-fade-in">
      {/* Metrics Row (KPI metrics st.metric mimicking) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div id="metric-emotion" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Primary Emotion</span>
            <span className="font-display font-bold text-2xl text-slate-800">{data.dominantEmotion}</span>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1.5">
              <Smile className="w-3.5 h-3.5 shrink-0" /> Evaluated Category
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
            <Smile className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div id="metric-stress" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Stress Score</span>
            <span className="font-display font-bold text-2xl text-slate-800">{data.stressScore}%</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-2 ${
              data.riskLevel === "High" ? "bg-rose-100 text-rose-700" :
              data.riskLevel === "Moderate" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            }`}>
              Risk: {data.riskLevel}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
            data.riskLevel === "High" ? "bg-rose-50 text-rose-500" :
            data.riskLevel === "Moderate" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div id="metric-health" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Conversation Health</span>
            <span className="font-display font-bold text-2xl text-slate-800">{data.healthScore}%</span>
            <span className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1.5">
              <Activity className="w-3.5 h-3.5 shrink-0" /> Structural Bond
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div id="metric-tone" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Linguistic Tone</span>
            <span className="font-display font-bold text-2xl text-slate-800">{data.sentiment.label}</span>
            <span className="text-xs text-indigo-500 font-medium flex items-center gap-1 mt-1.5">
              <Heart className="w-3.5 h-3.5 shrink-0" /> Polarity: {data.sentiment.polarity.toFixed(2)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Emotion pie chart distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-display font-semibold text-slate-800 text-lg mb-1">
            Emotion Vector Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-6">Categorical parsing weights representing text mood dispersal</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Intensity Weight"]}
                  contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "8px", border: "none" }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconSize={10} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-600 font-sans">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Emotional Drift Chronology */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-display font-semibold text-slate-800 text-lg mb-1">
            Chronological Emotional Drift over Time
          </h3>
          <p className="text-xs text-slate-400 mb-6">Trace sub-dialogue blocks mapped chronologically as emotional waves</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.driftTimeline}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="segment" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[-100, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "12px", border: "none" }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Line 
                  type="monotone" 
                  dataKey="stressScore" 
                  name="Stress Level Intensity" 
                  stroke="#f43f5e" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sentimentScore" 
                  name="Sentiment Balance" 
                  stroke="#06b6d4" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Word cloud Tag visualization wrapper */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-lg mb-1">
              Natural Language Tag Cloud
            </h3>
            <p className="text-xs text-slate-400 mb-6">Weight-token sizes representing text emphasis and core triggers</p>
            
            <div className="flex flex-wrap gap-2.5 items-center justify-center py-6 min-h-[160px] max-h-[220px] overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
              {data.wordCloud.map((item, index) => {
                const sizes = ["text-[10px]", "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
                const colors = [
                  "text-slate-500 font-medium",
                  "text-indigo-500 font-medium",
                  "text-rose-500 font-bold",
                  "text-amber-500 font-bold", 
                  "text-cyan-600 font-bold",
                  "text-purple-600 font-black",
                  "text-emerald-600 font-black"
                ];
                const sizeClass = sizes[Math.min(item.value - 1, 6)];
                const colorClass = colors[Math.min(index % colors.length, colors.length - 1)];
                return (
                  <span 
                    key={`${item.text}-${index}`} 
                    className={`${sizeClass} ${colorClass} tracking-wide cursor-default hover:underline transition-all`}
                  >
                    {item.text}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">
            <span>Tokens mapped: {data.wordCloud.length} stems</span>
            <span>Weight scale max: 10</span>
          </div>
        </div>

        {/* Sentiment Trends chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="font-display font-semibold text-slate-800 text-lg mb-1">
            Sub-Sentential Polarity Curve
          </h3>
          <p className="text-xs text-slate-400 mb-6">Sub-message tracking trend line showcasing polarity balance stability</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sentimentTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPolarity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[-100, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Tone Polarity"]}
                  contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "10px", border: "none" }}
                />
                <Area type="monotone" dataKey="polarity" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPolarity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stress triggers checklist and evidence row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Checklist */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-lg mb-1">
              Stress Domain Trigger Checklist
            </h3>
            <p className="text-xs text-slate-400 mb-6">Classifying text against conversational stress domains</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Trigger 1 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                data.triggers.exams ? "bg-rose-50/70 border-rose-100 text-rose-800" : "bg-slate-50/50 border-slate-100 text-slate-500"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.triggers.exams ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Book className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Exams & Academic Stress</span>
                </div>
                {data.triggers.exams ? (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">Triggered</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Clear</span>
                )}
              </div>

              {/* Trigger 2 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                data.triggers.projectDeadlines ? "bg-rose-50/70 border-rose-100 text-rose-800" : "bg-slate-50/50 border-slate-100 text-slate-500"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.triggers.projectDeadlines ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Project Deadlines</span>
                </div>
                {data.triggers.projectDeadlines ? (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">Triggered</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Clear</span>
                )}
              </div>

              {/* Trigger 3 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                data.triggers.financialIssues ? "bg-rose-50/70 border-rose-100 text-rose-800" : "bg-slate-50/50 border-slate-100 text-slate-500"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.triggers.financialIssues ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Financial Issues</span>
                </div>
                {data.triggers.financialIssues ? (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">Triggered</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Clear</span>
                )}
              </div>

              {/* Trigger 4 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                data.triggers.familyIssues ? "bg-rose-50/70 border-rose-100 text-rose-800" : "bg-slate-50/50 border-slate-100 text-slate-500"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.triggers.familyIssues ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Family Issues</span>
                </div>
                {data.triggers.familyIssues ? (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">Triggered</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Clear</span>
                )}
              </div>

              {/* Trigger 5 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                data.triggers.relationshipIssues ? "bg-rose-50/70 border-rose-100 text-rose-800" : "bg-slate-50/50 border-slate-100 text-slate-500"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.triggers.relationshipIssues ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <HeartCrack className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Relationship Issues</span>
                </div>
                {data.triggers.relationshipIssues ? (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">Triggered</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Clear</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-1 text-slate-500">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 font-display">
              <CornerDownRight className="w-3.5 h-3.5" /> Dialogue Evidence Proof Case:
            </span>
            <blockquote className="text-xs font-mono bg-slate-900 border-l-2 border-indigo-500 text-indigo-300 p-3 rounded-r-lg mt-1 whitespace-pre-wrap italic">
              &ldquo;{data.triggers.evidence || "No triggers validated with direct textual tokens."}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* AI Suggestions column */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-950 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-300 shrink-0" />
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-200 font-display">AI Wellness Blueprint</span>
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-white">
              Symptomatic Remedies
            </h3>
            <p className="text-slate-300 text-xs mb-6 leading-relaxed">
              Based on the detected stress index ({data.stressScore}%), the AI therapist model aggregates clinical mental suggestions:
            </p>

            <div className="space-y-4">
              {data.wellnessSuggestions.map((suggestion, index) => (
                <div key={`${suggestion}-${index}`} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5 font-mono">
                    {index + 1}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger button downloads report */}
          <button
            onClick={exportReport}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-all font-display text-xs font-bold text-white py-3 rounded-xl mt-8 shadow shadow-emerald-500/10 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Complete Report
          </button>
        </div>
      </div>
    </div>
  );
}
