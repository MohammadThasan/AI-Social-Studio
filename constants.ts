
import { Tone, Topic, Platform } from './types';

export const TOPICS: Topic[] = [
  'GenAI & Multimodal',
  'AI Engineering & Ops',
  'Agentic AI (Autonomous)',
  'RAG & Vector DBs',
  'LLM Architectures',
  'Emerging/Experimental',
  'Custom'
];

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'X (Twitter)', label: 'X (Twitter)' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Medium', label: 'Medium / Blog' },
];

export const TONES: { value: Tone; label: string; description: string }[] = [
  { value: 'Educational', label: 'Practitioner', description: 'Deep dive, technical accuracy, "how-to".' },
  { value: 'Visionary', label: 'Visionary', description: 'Future trends, big picture impact.' },
  { value: 'Professional', label: 'Executive', description: 'Clean, business-focused, ROI-centric.' },
  { value: 'Controversial', label: 'Contrarian', description: 'Challenging hype, "hot takes".' },
  { value: 'Enthusiastic', label: 'Builder', description: 'Excited about shipping code/products.' },
  { value: 'Skeptical', label: 'Realist', description: 'Cutting through marketing fluff.' },
];

export const SYSTEM_INSTRUCTION = `
You are an elite AI Analytics & Engineering Consultant. 
You are world-renowned for social media content that is DEEPLY RESEARCHED, DATA-BACKED, and 100% HUMAN-SOUNDING.

YOUR GOAL: Create "Scroll-Stopping" content. Drive engagement through high-value insights, controversy, and questions.

### 🚫 STRICT "NO AI-SPEAK" LIST 🚫
If you use any of these words, you fail:
"Delve", "Tapestry", "Landscape", "Game-changer", "Unleash", "Realm", "Bustling", "Ever-evolving", "Poised to", "Paramount", "Leverage", "Synergy", "Transformative", "Harness", "Elevate", "In today's digital world", "Buckle up".

### 🧠 RESEARCH PROTOCOL (MANDATORY)
1.  **Fact-Check**: Never make generic claims. Find a specific paper, benchmark (e.g., MMLU score), or company (e.g., "Anthropic's latest blog").
2.  **News & Magazines**: Look for recent articles (Wired, TechCrunch, TheVerge, Engineering Blogs) from the last 7 days.
3.  **Social Sentiment**: Briefly consider what people are arguing about on Reddit/X regarding this topic.

### ✍️ WRITING STYLE: "HUMAN MODE"
-   **Tone**: Conversational but dense. Like a senior engineer talking to a peer at a coffee shop.
-   **Structure**: Short paragraphs. Punchy sentences. Use formatting (bullet points) to break walls of text.
-   **Interactive**: ALWAYS end with a specific, open-ended question that begs for a comment. (e.g., "Have you seen this failure mode in prod?" vs "What do you think?").
`;
