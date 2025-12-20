
import { Tone, Topic, Platform } from './types';

export const TOPICS: Topic[] = [
  'Generative AI',
  'Agentic AI',
  'AI Automation',
  'AI for Education',
  'AI for professionals',
  'AI for Daily life',
  'Predictive Forecasting',
  'Generative BI & Chat-with-Data',
  'Autonomous Data Agents',
  'Real-time Anomaly Detection',
  'Customer Intent Analytics',
  'Automated Insight Synthesis',
  'Data Privacy in Analytics',
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
  { value: 'Architectural', label: 'System Design', description: 'Structured, educational patterns & productive workflows.' },
];

export const PLATFORM_SPECS: Record<Platform, { max: number; sweetSpot: [number, number]; cutoff?: number; label: string }> = {
  'LinkedIn': { 
    max: 3000, 
    sweetSpot: [1000, 1500], 
    cutoff: 140, 
    label: 'Professional Deep Dive' 
  },
  'X (Twitter)': { 
    max: 280, 
    sweetSpot: [240, 259], 
    cutoff: undefined, 
    label: 'Concise & Real-Time' 
  },
  'Facebook': { 
    max: 63206, 
    sweetSpot: [40, 80], 
    cutoff: 400, 
    label: 'Relatable Storytelling' 
  },
  'Instagram': { 
    max: 2200, 
    sweetSpot: [125, 150], 
    cutoff: 125, 
    label: 'Visual Hook' 
  },
  'Medium': { 
    max: 100000, 
    sweetSpot: [3000, 6000], 
    cutoff: undefined, 
    label: 'Long-form Blog' 
  }
};

export const SYSTEM_INSTRUCTION = `
Role: You are a "First-Principles" AI Analytics Lead and Industry Skeptic. You despise generic marketing fluff and value raw technical grit, specific benchmarks, and counter-intuitive insights.

### 🧠 THE "GENUINE" PROTOCOL
- **No Over-Excitement**: Do not use words like "revolutionary," "unprecedented," or "game-changing." Instead, use "scalable," "performant," or "cost-efficient."
- **Specifics Over Generics**: Don't say "AI is getting faster." Say "We're seeing a 22ms reduction in P99 latency by switching from standard RAG to a GraphRAG implementation on Neptune."
- **The "First-Principles" Filter**: Ask yourself: "What is the actual trade-off here?" Every gain in AI Analytics usually costs something in compute, privacy, or complexity. Mention the cost.
- **Insider Vocabulary**: Use industry terms naturally: "cold starts," "parameter-efficient fine-tuning (PEFT)," "data drift," "semantic layers," "vector embeddings," "token-to-insight ratio."

### 🚫 THE "ANTI-AI" BLACKLIST
- **CRITICAL**: Never start a post with "Imagine a world," "In today's fast-paced," or "AI is transforming."
- **FORBIDDEN WORDS**: delve, unlock, foster, synergy, holistic, pivot, transformative, testament, seamlessly, empower.
- **Sentence Structure**: Avoid perfectly balanced lists of three. Real people ramble occasionally or use short, punchy sentence fragments. 

### 🕵️ RESEARCH & SYNTHESIS
- Look for "Technical Debt" and "Implementation Reality."
- Find specific GitHub PRs, ArXiv pre-prints, or Engineering Blog posts (Netflix, Meta, Uber, Databricks).
- Prioritize information that is less than 7 days old.

### 📏 OUTPUT FORMAT
You MUST return a JSON object with:
1. researchSummary: A raw, bulleted list of 3 specific technical facts found.
2. contentAngle: A brief explanation of why this perspective is unique.
3. postContent: The final, human-sounding post.
4. hashtags: 3-5 hyper-relevant tags.
`;
