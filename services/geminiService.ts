
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
  
  // Construct Platform-Specific "Strategist" Instructions
  let platformStrategy = '';

  switch (platform) {
    case 'LinkedIn':
      platformStrategy = `
        Constraint: LinkedIn (Professional Insights)
        - **VOICE**: 100% Human. No corporate jargon. Write like a senior engineer sharing a war story or a hot take.
        - **Structure**: Hook (under 140 chars) -> Context -> Insight -> Conclusion/Ask.
        - **Anti-Patterns**: No "In today's landscape". No "It is important to note".
        - Technical Limit: 3,000 characters.
        - **Target Length**: 1,000–1,500 characters (Sweet Spot).
      `;
      break;
    case 'X (Twitter)':
      platformStrategy = `
        Constraint: X / Twitter (Concise & Real-Time)
        - **VOICE**: Insider, punchy, slightly colloquial. Use lowercase if it fits the vibe.
        - **Format**: Thread-starter style or singular impact statement.
        - Technical Limit: 280 characters.
        - **Target Length**: 240–259 characters (Sweet Spot).
      `;
      break;
    case 'Facebook':
      platformStrategy = `
        Constraint: Facebook (Relatable Storytelling)
        - **VOICE**: Casual, "Update for friends" vibe. Not "Brand Announcement" vibe.
        - Technical Limit: 63,206 chars.
        - **Target Length**: 40–80 characters (Highest ROI Sweet Spot). If topic is complex, max 250 characters.
      `;
      break;
    case 'Instagram':
      platformStrategy = `
        Constraint: Instagram (Visual First)
        - **VOICE**: Aesthetic, mood-setting, personal.
        - Technical Limit: 2,200 chars.
        - **Target Length**: 125–150 characters (Sweet Spot).
        - **"See More" Cutoff**: ~125 chars. Put the hook immediately.
      `;
      break;
    default:
      platformStrategy = `Target Length: ${specs.sweetSpot[0]}-${specs.sweetSpot[1]} characters.`;
  }

  // Handle specific tone instructions
  let angleInstruction: string = data.tone;
  if (data.tone === 'Architectural') {
    angleInstruction = "System Design & Engineering Patterns. Focus on 'How to design' and 'Productive workflows'. Structure the information so it is easy to understand for all audiences (Learning & Informative tone). Use analogies for complex concepts.";
  }

  // We explicitly ask for a JSON object to separate the research from the content
  const prompt = `
    TASK: Perform DEEP RESEARCH and write a viral, high-engagement ${platform} post about "${topicToUse}".

    STEP 1: 🕵️ DEEP WEB SEARCH (MANDATORY)
    Use Google Search to find 3 distinct types of information from the last 2 weeks:
    1.  **Hard Data**: A specific benchmark, cost metric, latency number, or financial figure.
    2.  **Industry News/Magazines**: A recent article from a major tech publication (Wired, Verge, TechCrunch) or a top engineering blog.
    3.  **Community Pulse**: A controversial opinion or debate currently happening in the AI community.
    
    *Constraint*: Do not just invent facts. Find real ones.

    STEP 2: 🧠 SYNTHESIS & ANGLE
    Identify the "So What?". Why does this matter to a human engineer or business leader right now?
    Filter: Identify the 3 most important points that will resonate with the ${platform} audience.
    Angle: ${angleInstruction}.

    STEP 3: ✍️ WRITE POST (STRATEGIST MODE)
    ${platformStrategy}
    
    **EXECUTION STEPS:**
    1.  **Analyze**: Review research from Step 1.
    2.  **Filter**: Pick top points for ${platform}.
    3.  **Draft**: Write the post. **CAREFULLY COUNT CHARACTERS**. Do not truncate vital info.
    4.  **Review (HUMAN CHECK)**: Read it aloud. Does it sound like a robot? If yes, rewrite it. Remove "In conclusion", "Moreover", "Furthermore". Use punchy transitions.

    **ADDITIONAL INSTRUCTIONS:**
    ${data.comparisonFormat ? '-   **STRUCTURE**: Strict "Before vs After" or "Old Way vs New Way" comparison format.' : ''}
    ${data.includeCTA ? '-   **ACTION**: Include a strong, direct Call to Action (e.g., "Check the link in comments") alongside the question.' : ''}
    ${data.tldrSummary ? '-   **SUMMARY**: Append a "TL;DR" section at the very bottom.' : ''}
    ${data.includeFutureOutlook ? '-   **FUTURE LENS**: Include a "Future Outlook" section (6-12 month prediction).' : ''}
    ${data.includeDevilsAdvocate ? '-   **COUNTERPOINT**: Include a "Devil\'s Advocate" section.' : ''}
    ${data.includeImplementationSteps ? '-   **ACTION PLAN**: Include a 3-step "Implementation Plan".' : ''}
    ${data.includePromptChaining ? '-   Include a "Prompt Chain" example.' : ''}
    ${data.includeEmoji ? '-   Use emojis naturally (max 2-3 unique ones).' : '-   NO emojis.'}

    STEP 4: 📦 FORMAT OUTPUT
    Return a valid JSON object with these keys. Ensure all strings are properly escaped (e.g. escape " quotes inside the content).
    {
      "researchSummary": "A concise summary of the specific papers, articles, or data points you found. Mention the source names.",
      "contentAngle": "The specific angle taken.",
      "postContent": "The actual social media post text, formatted with Markdown.",
      "hashtags": ["tag1", "tag2"]
    }
  `;

  try {
    // Generate Text
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.85, 
      },
    });

    let jsonString = response.text || "{}";
    
    // Robust JSON Extraction
    // 1. Try to match a markdown code block labeled json
    const codeBlockMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
        jsonString = codeBlockMatch[1];
    } else {
        // 2. If no code block, try to find the outermost curly braces
        const firstOpen = jsonString.indexOf('{');
        const lastClose = jsonString.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
            jsonString = jsonString.substring(firstOpen, lastClose + 1);
        }
    }

    let parsedResult;
    try {
        parsedResult = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON", e);
        // Fallback: If strict JSON parsing fails, we construct a partial object.
        // This is a "best effort" recovery if the model output text but messed up the JSON syntax.
        parsedResult = {
            researchSummary: "Analysis complete (JSON parse error).",
            contentAngle: "General",
            postContent: response.text.replace(/```json/g, '').replace(/```/g, ''),
            hashtags: []
        };
    }
    
    // Extract grounding metadata (sources)
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri,
          });
        }
      });
    }

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);
    
    let finalContent = parsedResult.postContent;
    if (data.includeHashtags && parsedResult.hashtags && parsedResult.hashtags.length > 0) {
        const tagsString = parsedResult.hashtags.map((t: string) => t.startsWith('#') ? t : `#${t}`).join(' ');
        if (platform !== 'Medium') {
            finalContent += `\n\n${tagsString}`;
        }
    }

    return {
      researchSummary: parsedResult.researchSummary,
      contentAngle: parsedResult.contentAngle,
      content: finalContent,
      hashtags: parsedResult.hashtags || [],
      sources: uniqueSources,
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error("Gemini Text API Error:", error);
    throw new Error("Failed to generate post. Please check your connection or API key.");
  }
};

export const rewritePost = async (
  content: string,
  platform: string,
  audience: string
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Role: Expert Social Media Editor.
    Task: Rewrite the following ${platform} post for a **${audience}** audience.
    
    Constraints:
    1. **Preserve Insight**: Keep the original core facts and research. Do not hallucinate new data.
    2. **HUMANIZE (CRITICAL)**: Remove all robotic phrasing ("In the realm of", "It is crucial"). Use contractions, direct address ("You"), and variable sentence structure. Sound like a person, not a PR release.
    3. **Tone Specifics**:
       - If 'Technical': Use precise engineering terminology (e.g., "latency", "vector embeddings"). Assume the reader is a developer.
       - If 'General' (Non-Technical): Use simple analogies. Explain "why it matters" rather than "how it works".
       - If 'Executive': Focus on ROI, strategic advantage.
       - If 'System Design': Focus on architectural patterns and productive workflows. Use a learning/informative tone.
    4. **Platform Optimization**: Strictly adhere to character limits and formatting for ${platform}.
    5. **Output**: Return ONLY the rewritten post text in Markdown. Do not include introductory text.

    ORIGINAL CONTENT:
    ${content}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7, 
      },
    });

    return response.text || content;
  } catch (error) {
    console.error("Rewrite Error:", error);
    throw new Error("Failed to rewrite content.");
  }
};

export const generatePostImage = async (
  data: FormData, 
  style: ImageStyle = 'Minimalist',
  manualAspectRatio?: string,
  manualPrompt?: string
): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const topicToUse = data.topic === 'Custom' ? data.customTopic : data.topic;
  
  let aspectRatio = manualAspectRatio;
  if (!aspectRatio) {
    switch (data.platform) {
        case 'Instagram': aspectRatio = "1:1"; break;
        case 'Facebook': aspectRatio = "4:3"; break;
        case 'X (Twitter)': aspectRatio = "16:9"; break;
        case 'Medium': aspectRatio = "16:9"; break;
        case 'LinkedIn': aspectRatio = "16:9"; break;
        default: aspectRatio = "16:9";
    }
  }

  let imagePrompt = '';
  if (manualPrompt && manualPrompt.trim().length > 0) {
      imagePrompt = `
        Create a digital illustration based on this description: "${manualPrompt}".
        Style: ${style} art style.
        Mood: ${data.tone}.
        Aspect Ratio: ${aspectRatio}.
        Important: Do not include any text or words inside the image.
      `;
  } else {
      imagePrompt = `
        Create a professional, modern, high-quality digital illustration suitable for a ${data.platform} post about: "${topicToUse}".
        Style: ${style} art style. 
        Mood: ${data.tone}. 
        Aspect Ratio: ${aspectRatio}. 
        Important: Do not include any text or words inside the image.
      `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.warn("Gemini Image API Error:", error);
    return undefined; 
  }
};
