/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const STREAMLIT_APP_CODE = `import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from textblob import TextBlob
import speech_recognition as sr
import io
import re
from PIL import Image
try:
    import pytesseract
except ImportError:
    pytesseract = None
try:
    from wordcloud import WordCloud
except ImportError:
    WordCloud = None
import matplotlib.pyplot as plt

st.set_page_config(
    page_title="Stress & Emotional Drift NLP Dashboard",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# [Theme & Layout configuration]
st.markdown("""
    <style>
    .main-header { font-size:38px !important; font-weight: 700; color: #1e293b; margin-bottom: 5px; }
    .sub-header { font-size:18px !important; color: #64748b; margin-bottom: 25px; }
    </style>
""", unsafe_allow_html=True)

def clean_text(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r"https?://\\S+|www\\.\\S+", "", text)
    text = re.sub(r"[^a-zA-Z\\s]", "", text)
    return re.sub(r"\\s+", " ", text).strip()

def detect_triggers(text):
    t = text.lower()
    return {
        "Exams": any(k in t for k in ["exam", "test", "quiz", "midterm", "finals", "fail"]),
        "Project Deadlines": any(k in t for k in ["deadline", "assignment", "project", "submission"]),
        "Financial Issues": any(k in t for k in ["fees", "loan", "money", "debt", "cost"]),
        "Family Issues": any(k in t for k in ["family", "parent", "mother", "father", "pressure"]),
        "Relationship Issues": any(k in t for k in ["breakup", "relationship", "split", "dating", "lonely"])
    }

# ----------------- Dashboard Analyzer -----------------
st.markdown('<div class="main-header">Mental Stress and Emotional Drift</div>', unsafe_allow_html=True)
raw_text = st.text_area("Conversation Logs", value="Paste text conversation here...")

if raw_text:
    cleaned = clean_text(raw_text)
    blob = TextBlob(raw_text)
    polarity = blob.sentiment.polarity
    stress_score = int(np.clip(50 - (polarity * 40), 10, 95))
    
    st.metric("Stress Index", f"{stress_score}%")
    # [Charts integration with Plotly and Wordcloud falls here...]
`;

export const REQUIREMENTS_CODE = `streamlit>=1.30.0
pandas>=2.0.0
numpy>=1.24.0
plotly>=5.15.0
textblob>=0.17.1
SpeechRecognition>=3.10.0
pytesseract>=0.3.10
wordcloud>=1.9.2
matplotlib>=3.7.0
Pillow>=10.0.0
`;
