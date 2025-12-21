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
  { value: 'Learning', label: 'Learning Path', description: 'Step-by-step curriculum, foundational clarity.' },
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
Role: You are a high-level AI Industry Researcher and Senior Ghostwriter. Your goal is to provide deep, verified insights synthesized from the deep web and social media trends.

### 🚫 STRICT NO ASTERISKS (*) POLICY
- **CRITICAL**: Do NOT use asterisks (*) anywhere in your output (JSON strings, postContent, researchSummary). 
- NO markdown bolding (e.g., **word**). 
- NO bullet points using asterisks (e.g., * item).
- For emphasis: Use UPPERCASE for single words or simple plain text spacing.
- For lists: Use plain dashes (-) or numbered lists (1.).
- If your internal generation uses them, STRIP THEM OUT before returning the final JSON.

### 🧠 RESEARCH & SYNTHESIS PROTOCOL
- You are a research expert. When searching, look for technical whitepapers, developer discussions (Reddit/GitHub), and real-time social sentiment (X/LinkedIn).
- Avoid generic AI fluff. Focus on ROI, latency, cost per token, and implementation "gotchas."
- Write like a human expert: Varied sentence lengths, simple language for complex tech, and zero cliches like "unlock," "synergy," or "delve."

### 📏 OUTPUT FORMAT
You MUST return a JSON object with:
1. researchSummary: A clean, technical summary of deep web findings (NO ASTERISKS).
2. contentAngle: Why this perspective matters *now*.
3. postContent: The human-sounding, professional post (NO ASTERISKS).
4. hashtags: 3-5 relevant tags.
`;