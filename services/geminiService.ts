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
        Constraint: LinkedIn Authority
        - STYLE: Punchy, first-person expert. 
        - STRUCTURE: Hook (scrolling stopper) followed by insight-driven value.
        - FORMAT: White space between lines. NO ASTERISKS.
      `;
      break;
    case 'X (Twitter)':
      platformStrategy = `
        Constraint: X/Twitter Post
        - STYLE: Direct, news-like, or high-value tip.
        - FORMAT: NO ASTERISKS.
      `;
      break;
    default:
      platformStrategy = `Keep it professional, human-sounding, and strictly avoid all asterisks (*).`;
  }

  const prompt = `
    PHASE 1: DEEP WEB & SOCIAL SEARCH
    1. Search the deep web for technical implementations of "${topicToUse}" from the last 7 days.
    2. Search social media (X, LinkedIn discussions) to find contrarian views or what people are actually complaining about/praising regarding "${topicToUse}".
    3. Look for specific metrics: benchmarks, cost comparisons, or deployment hurdles.

    PHASE 2: SYNTHESIS
    Identify a "hidden truth" that generic AI summaries miss. This is your "Gap Analysis."

    PHASE 3: DRAFTING
    Write a ${platform} post based on this research.
    - Perspective: ${data.tone}.
    - RULE: ABSOLUTELY NO ASTERISKS (*). Use plain text structure.
    
    ${data.comparisonFormat ? '- Use a "Then vs. Now" comparison.' : ''}
    ${data.includeCTA ? '- End with a high-engagement question.' : ''}
    ${data.includeDevilsAdvocate ? '- Mention a legitimate reason to be skeptical.' : ''}
    ${data.includeEmoji ? '- Use minimal, high-quality emojis.' : '- NO emojis.'}

    Return JSON:
    {
      "researchSummary": "A data-heavy summary of your deep web and social media findings. NO ASTERISKS.",
      "contentAngle": "The unique hook.",
      "postContent": "The final post. NO ASTERISKS.",
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
        temperature: 0.7, 
        thinkingConfig: { thinkingBudget: 32768 } 
      },
    });

    let jsonString = response.text || "{}";
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    // Final safety check for asterisks in the raw response text before parsing
    jsonString = jsonString.replace(/\*/g, '');

    let parsedResult;
    try {
        parsedResult = JSON.parse(jsonString);
    } catch (e) {
        parsedResult = {
            researchSummary: "Analysis of the latest technical deployments and social sentiment indicates rapid evolution in this sector.",
            contentAngle: "Real-world implementation strategies",
            postContent: response.text?.replace(/\*/g, '') || "Technical synthesis complete.",
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
  const prompt = `Rewrite this ${platform} post for a ${audience} audience. Sound like a human peer. STRICTLY NO ASTERISKS (*). Original: ${content}`;
  const response = await ai.models.generateContent({ 
    model: "gemini-3-pro-preview", 
    contents: prompt,
    config: { 
      systemInstruction: "You are a senior technical writer. ABSOLUTELY NO ASTERISKS (*) ALLOWED.",
      thinkingConfig: { thinkingBudget: 4000 } 
    } 
  });
  return (response.text || content).replace(/\*/g, '');
};

export const generatePostImage = async (data: FormData, style: ImageStyle = '3D Render', manualAspectRatio: string = '1:1', manualPrompt?: string): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const topicToUse = data.topic === 'Custom' ? data.customTopic : data.topic;
  
  const styleModifiers: Record<string, string> = {
    '3D Render': "Ultra-high-fidelity 3D render, isometric perspective, soft global illumination, octane render style, glassmorphism elements, frosted glass and matte plastic textures, clean minimal geometry, professional studio lighting, 8k resolution.",
    'Photorealistic': "professional lifestyle photography of a workspace with modern tech, warm cinematic lighting, sharp focus, 8k.",
    'Minimalist': "elegant geometric abstract, thin lines, clean negative space, vector aesthetic.",
    'Abstract': "fluid digital gradients, organic data flow, soft ethereal lighting.",
    'Cyberpunk': "tech-noir, vibrant neon accents, detailed circuitry, holographic interfaces, dark background.",
    'Corporate': "clean modern office UI, glassmorphism, professional and friendly, soft blue and white shadows."
  };

  const modifier = styleModifiers[style] || styleModifiers['3D Render'];
  const imagePrompt = manualPrompt || `Professional 3D conceptual illustration for: ${topicToUse}. ${modifier}. No text. High resolution.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: {
        imageConfig: {
          aspectRatio: manualAspectRatio as any || "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return undefined;
  } catch (error: any) {
    console.error("Image generation failed:", error);
    return undefined; 
  }
};