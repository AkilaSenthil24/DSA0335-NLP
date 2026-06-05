/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Copy, CheckCircle2, Cpu, Code, HelpCircle, Terminal } from "lucide-react";

interface PresentationHubProps {
  streamlitAppCode: string;
  requirementsCode: string;
}

export default function PresentationHub({ streamlitAppCode, requirementsCode }: PresentationHubProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<"app" | "req">("app");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCodeText = activeCodeTab === "app" ? streamlitAppCode : requirementsCode;

  return (
    <div id="presentation-hub" className="space-y-8 animate-fade-in">
      {/* Abstract and Title */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-indigo-600 mb-4">
          <BookOpen className="w-6 h-6" />
          <span className="font-display font-semibold tracking-wider uppercase text-xs">Capstone Academic Portfolio</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-800 tracking-tight leading-tight mb-4">
          Project Abstract & Objectives
        </h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl text-sm md:text-base">
          This B.Tech Capstone Project introduces a real-time linguistic processing pipeline designed to identify indicators of mental health vulnerabilities, academic pressures, and interpersonal distresses within conversational threads. Leveraging structured <strong>Sentiment Analysis</strong>, modular <strong>Emotion Dispersal</strong>, and multi-point <strong>Emotional Drift Tracking</strong>, the system maps psychological changes chronologically through chat streams (texts), voice queries (.wav), and mobile messenger screenshots (OCR).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-display font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Linguistic OCR Engine
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Accepts conversation screenshots, runs optical character extraction to identify individual chat bubbles, clean stopwords, and tokenize strings into sequential messages.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-display font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Emotional Drift Modeling
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Traces sub-dialogue units as consecutive timeline segments to map how linguistic polarity and stress indexes covary organically, rather than evaluating text statically.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-display font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Trigger Isolation Rules
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Applies linguistic feature dictionary weights to identify active stress domains, including Exams, Deadlines, Financial pressures, Family stress, and Relationship drift.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology Block Diagram */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-cyan-600 mb-4">
          <Cpu className="w-6 h-6" />
          <span className="font-display font-semibold tracking-wider uppercase text-xs">Architectural Design Flow</span>
        </div>
        <h3 className="font-display text-2xl font-bold text-slate-800 tracking-tight mb-6">
          Pipeline Block Diagram
        </h3>

        {/* CSS-based responsive flowchart */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 py-4 overflow-x-auto">
          {/* Node 1 */}
          <div className="flex-1 min-w-[200px] flex flex-col justify-between p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-200/60 rounded-xl relative hover:border-indigo-200 transition-colors">
            <div className="text-xs font-semibold text-indigo-600 uppercase mb-2">01. Multimodal Ingestion</div>
            <h5 className="font-display font-bold text-slate-700 mb-1 text-sm">Ingestion Endpoints</h5>
            <p className="text-[11px] text-slate-505 text-slate-500 leading-tight">Accepts dialogue texts, acoustic .wav signals, or mobile screenshots from messaging apps.</p>
            <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-400 z-10 font-bold">→</div>
            <div className="block lg:hidden text-center text-slate-400 my-1 font-bold">↓</div>
          </div>

          {/* Node 2 */}
          <div className="flex-1 min-w-[200px] flex flex-col justify-between p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-200/60 rounded-xl relative hover:border-indigo-200 transition-colors">
            <div className="text-xs font-semibold text-cyan-600 uppercase mb-2">02. Unified Transcription</div>
            <h5 className="font-display font-bold text-slate-700 mb-1 text-sm">OCR & Speech-to-Text</h5>
            <p className="text-[11px] text-slate-500 leading-tight">Extracts text characters via Optical Character recognition or speech-to-text APIs into token string streams.</p>
            <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-400 z-10 font-bold">→</div>
            <div className="block lg:hidden text-center text-slate-400 my-1 font-bold">↓</div>
          </div>

          {/* Node 3 */}
          <div className="flex-1 min-w-[200px] flex flex-col justify-between p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-200/60 rounded-xl relative hover:border-indigo-200 transition-colors">
            <div className="text-xs font-semibold text-emerald-600 uppercase mb-2">03. NLP Extraction</div>
            <h5 className="font-display font-bold text-slate-700 mb-1 text-sm">NLP Core Rules</h5>
            <p className="text-[11px] text-slate-500 leading-tight">Tokenizes dialogue, maps TextBlob sentiment benchmarks, calculates localized parameters, and isolates active stresses.</p>
            <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-400 z-10 font-bold">→</div>
            <div className="block lg:hidden text-center text-slate-400 my-1 font-bold">↓</div>
          </div>

          {/* Node 4 */}
          <div className="flex-1 min-w-[200px] flex flex-col justify-between p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-200/60 rounded-xl relative hover:border-indigo-200 transition-colors">
            <div className="text-xs font-semibold text-rose-600 uppercase mb-2">04. Drifting Matrix</div>
            <h5 className="font-display font-bold text-slate-700 mb-1 text-sm">Temporal Analytics</h5>
            <p className="text-[11px] text-slate-500 leading-tight">Maps emotional curves dynamically over conversation timelines to show psychological changes and stress fluctuations.</p>
            <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-400 z-10 font-bold">→</div>
            <div className="block lg:hidden text-center text-slate-400 my-1 font-bold">↓</div>
          </div>

          {/* Node 5 */}
          <div className="flex-1 min-w-[200px] flex flex-col justify-between p-5 bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-600 rounded-xl hover:shadow-md transition-all text-white">
            <div className="text-xs font-semibold text-emerald-100 uppercase mb-2">05. Output Deck</div>
            <h5 className="font-display font-bold mb-1 text-sm">Dashboard & Reports</h5>
            <p className="text-[11px] text-emerald-50 leading-tight">Displays KPI risk metrics, outputs charts, aggregates wellness recommendations, and lets you download complete txt reports.</p>
          </div>
        </div>
      </div>

      {/* Streamlit Implementation & Code Sharing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Setup guide */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-slate-700 mb-4">
              <Terminal className="w-5 h-5 text-indigo-500" />
              <span className="font-display font-semibold tracking-wider uppercase text-xs">Academic Deliverables</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-800 tracking-tight mb-4">
              Streamlit Local Execution
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
               professeurs and project reviewers require standard Python installations to assess B.Tech software files locally. The compiled python scripts have been structured comprehensively to mimic this web dashboard using Python's native Streamlit, TextBlob, Plotly, and Tesseract capabilities.
            </p>

            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold text-slate-600">1</span>
                  Install Python Dependencies
                </h5>
                <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner select-all">
                  pip install -r requirements.txt
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold text-slate-600">2</span>
                  Boot Up Dashboard
                </h5>
                <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner select-all">
                  streamlit run app.py
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold text-slate-600">3</span>
                  OCR Engine Requirement
                </h5>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Ensure <strong>Tesseract OCR</strong> binary is installed in your local system path (Windows/macOS/Linux) to support the image character translation feature.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              Both high-fidelity Python deliverable files (<span className="font-mono text-orange-500 font-semibold">app.py</span> and <span className="font-mono text-indigo-500 font-semibold">requirements.txt</span>) have been built inside the workspace root.
            </div>
          </div>
        </div>

        {/* Right Side: Code Viewer */}
        <div id="code-viewer" className="lg:col-span-2 bg-slate-900 text-slate-200 rounded-2xl overflow-hidden border border-slate-850 shadow-lg flex flex-col h-[560px]">
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs font-display font-medium">
                <Code className="w-4 h-4 text-orange-400" /> Source File Explorer
              </span>
              <div className="flex rounded-md p-0.5 bg-slate-900 text-xs">
                <button
                  onClick={() => setActiveCodeTab("app")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeCodeTab === "app" ? "bg-slate-850 text-white font-medium" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  app.py (Streamlit App)
                </button>
                <button
                  onClick={() => setActiveCodeTab("req")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeCodeTab === "req" ? "bg-slate-850 text-white font-medium" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  requirements.txt
                </button>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(activeCodeText)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-750 transition-all text-xs text-white px-3 py-1.5 rounded-lg border border-slate-700/50"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy File Code
                </>
              )}
            </button>
          </div>

          {/* Files display code scrollbox */}
          <pre className="p-6 overflow-y-auto text-xs font-mono leading-relaxed flex-1 whitespace-pre bg-slate-900 text-indigo-200 select-all">
            {activeCodeText}
          </pre>
        </div>
      </div>
    </div>
  );
}
