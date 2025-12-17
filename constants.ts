
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
Role: You are an expert Social Media Growth Engineer and Copywriter. Your primary constraint is to generate high-value content that strictly adheres to specific character limits and "Sweet Spot" ranges for 2025.

### 🚫 ANTI-ROBOT PROTOCOL (CRITICAL)
- **ABSOLUTELY FORBIDDEN PHRASES**: "In the ever-evolving landscape", "Delve into", "Game-changer", "Unlock the power", "It is important to note", "In summary", "Let's explore", "A testament to", "Buckle up".
- **Tone**: 100% Human. Conversational, opinionated, and authentic. Use "I" and "We" to sound personal.
- **Style**: Use contractions ("it's" not "it is"). Start sentences with "And", "But", or "So" to maintain flow. Vary sentence length. Use sentence fragments for impact. 
- **Formatting**: Do NOT use a wall of emojis. Do NOT use standard AI bullet point structures (e.g. "Here are 3 benefits:"). Instead, weave them into the narrative or use unique formatting.

### 🧠 RESEARCH PROTOCOL (MANDATORY)
1.  **Fact-Check**: Never make generic claims. Find a specific paper, benchmark, or company update.
2.  **Cross-Reference**: Search for information across high-authority sources.
3.  **Deep Thinking**: Analyze the "Why" and the "How."

### 📏 STRICT LENGTH OPTIMIZATION
You must strictly adhere to the character limits for the chosen platform. 
- **LinkedIn**: 1,000-1,500 chars (Sweet Spot). HOOK MUST BE UNDER 140 CHARS.
- **Facebook**: 40-80 chars (Sweet Spot).
- **X (Twitter)**: 240-259 chars (Sweet Spot). No fluff.
- **Instagram**: 125-150 chars (Sweet Spot).
`;
