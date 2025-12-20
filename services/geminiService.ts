
import { GoogleGenAI } from "@google/genai";
import { FormData, GeneratedPost, GroundingSource, ImageStyle } from '../types';
import { SYSTEM_INSTRUCTION, PLATFORM_SPECS } from '../constants';

export const generateSocialPost = async (data: FormData): Promise<GeneratedPost> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const topicToUse = data.topic === 'Custom' ? data.customTopic : data.topic;
  const platform = data.platform || 'LinkedIn';
  const specs = PLATFORM_SPECS[platform];
  
  let platformStrategy = '';

  switch (platform) {
    case 'LinkedIn':
      platformStrategy = `
        Constraint: LinkedIn (Insider Perspective)
        - **VOICE**: Direct, opinionated, technical leader.
        - **Structure**: Start with a "Controversial Fact" or a "Hidden Bottleneck". No "Hello LinkedIn".
        - **Technical Limit**: 3,000 characters.
        - **Target Length**: 1,200–1,600 characters for maximum "dwell time".
      `;
      break;
    case 'X (Twitter)':
      platformStrategy = `
        Constraint: X / Twitter (The "Hot Take")
        - **VOICE**: Raw, immediate, code-centric.
        - **Target Length**: 240–280 characters.
      `;
      break;
    default:
      platformStrategy = `Target Length: ${specs.sweetSpot[0]}-${specs.sweetSpot[1]} characters.`;
  }

  let angleInstruction: string = data.tone;
  if (data.tone === 'Architectural') {
    angleInstruction = "System Design & Data Engineering. Focus on the 'Why' behind the infrastructure choice (e.g., why Ray vs Spark for this specific AI workload).";
  }

  const prompt = `
    TASK: Perform DEEP TECHNICAL RESEARCH on the AI Analytics topic: "${topicToUse}".

    INSTRUCTIONS FOR DEEP THINKING:
    1. **Identify the Hype vs. Reality**: Find a specific technical reason why people are struggling with this topic right now.
    2. **Find the "Hidden Gem"**: Find a specific benchmark result, a GitHub repo, or a niche engineering blog post from the last 72-96 hours.
    3. **Synthesize a "Hot Take"**: What is everyone getting wrong about "${topicToUse}"?
    
    STEP 1: 🕵️ SEARCH & VERIFY
    Find 3 hard data points from high-fidelity sources (Engineering blogs, ArXiv, Documentation). 
    Avoid news sites; go to the source.

    STEP 2: ✍️ WRITE THE POST
    ${platformStrategy}
    Angle: ${angleInstruction}. 
    
    **MANDATORY REALISM CHECKS:**
    - Use specific numbers (e.g., "$0.04 per 1k tokens" vs "it's expensive").
    - Mention a specific library or tool (e.g., "Polars," "DuckDB," "vLLM," "LangGraph").
    - Address a "Pain Point" (e.g., "The issue isn't the model; it's the context window retrieval latency").

    ${data.comparisonFormat ? '- Use a technical Before vs After table/list.' : ''}
    ${data.includeCTA ? '- Ask a high-level technical question to prompt discussion.' : ''}
    ${data.includeDevilsAdvocate ? '- Explicitly state why this specific AI approach might be technical debt in 6 months.' : ''}
    ${data.includeEmoji ? '- Max 2 emojis, used only for structural emphasis.' : '- NO emojis.'}

    Return JSON:
    {
      "researchSummary": "Technical breakdown of findings.",
      "contentAngle": "Unique perspective.",
      "postContent": "The post text.",
      "hashtags": ["#tag1", "#tag2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.75, // Slightly lower temperature for more "grounded" and precise facts
        thinkingConfig: { thinkingBudget: 32768 } // Max thinking budget for deepest possible synthesis
      },
    });

    let jsonString = response.text || "{}";
    const codeBlockMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
    } else {
      const firstOpen = jsonString.indexOf('{');
      const lastClose = jsonString.lastIndexOf('}');
      if (firstOpen !== -1 && lastClose !== -1) {
        jsonString = jsonString.substring(firstOpen, lastClose + 1);
      }
    }

    let parsedResult;
    try {
        parsedResult = JSON.parse(jsonString);
    } catch (e) {
        parsedResult = {
            researchSummary: "Analysis complete based on latest engineering benchmarks.",
            contentAngle: "Technical Deep Dive",
            postContent: response.text,
            hashtags: []
        };
    }
    
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    let finalContent = parsedResult.postContent;
    if (data.includeHashtags && parsedResult.hashtags?.length > 0) {
        const hashtags = parsedResult.hashtags.map((t: string) => t.startsWith('#') ? t : `#${t}`).join(' ');
        finalContent += `\n\n${hashtags}`;
    }

    return {
      researchSummary: parsedResult.researchSummary,
      contentAngle: parsedResult.contentAngle,
      content: finalContent,
      hashtags: parsedResult.hashtags || [],
      sources: sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i),
      timestamp: Date.now(),
    };
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("API_LIMIT_REACHED");
    }
    throw error;
  }
};

export const rewritePost = async (content: string, platform: string, audience: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a senior technical peer. Critically review and rewrite this ${platform} post for a ${audience} audience. Focus on clarity and removing any remaining 'marketing fluff'. Original: ${content}`;
  const response = await ai.models.generateContent({ 
    model: "gemini-3-pro-preview", 
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 4000 } } 
  });
  return response.text || content;
};

export const generatePostImage = async (data: FormData, style: ImageStyle = '3D Render', manualAspectRatio?: string, manualPrompt?: string): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const topicToUse = data.topic === 'Custom' ? data.customTopic : data.topic;
  
  const styleModifiers: Record<string, string> = {
    '3D Render': "hyper-realistic 3D isometric render, Blender style, soft global illumination, octane render, 4k, trending on ArtStation, glass and matte textures, data visualization structures.",
    'Photorealistic': "professional high-res photography, cinematic lighting, shallow depth of field, sharp focus, 8k.",
    'Minimalist': "clean Bauhaus aesthetic, simple geometric shapes, limited palette.",
    'Abstract': "flowing data streams, complex mathematical patterns, ethereal light.",
    'Cyberpunk': "vibrant neon, data-noir aesthetic, high contrast.",
    'Corporate': "clean modern UI/UX visualization, glassmorphism elements."
  };

  const modifier = styleModifiers[style] || styleModifiers['3D Render'];
  const imagePrompt = manualPrompt || `Conceptual technical visualization for AI Analytics infrastructure: ${topicToUse}. ${modifier}. No text.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return undefined;
  } catch (error: any) {
    return undefined; 
  }
};
