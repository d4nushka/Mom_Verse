import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOMVERSE_SYSTEM_INSTRUCTION = `
You are MomVerse, an AI-powered companion for new mothers.
Your tone is empathetic, warm, supportive, and non-judgmental.
Core Responsibilities:
1. Baby Cry Analysis: Identify patterns (hunger, sleep, gas).
2. Symptom Check: Suggest home care, identify red flags, NEVER diagnose.
3. Feeding/Sleep/Wellness Support.
Safety Rules:
- NEVER give diagnoses or medical claims.
- ALWAYS include a safety disclaimer.
- If unsure or if symptoms are severe, suggest a pediatrician.
`;

export const analyzeCryAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Listen to this baby cry.
    1. Identify potential causes (hunger, fatigue, pain, gas, etc.).
    2. Explain why in simple terms.
    3. Provide soothing suggestions.
    4. Include the mandatory safety line: "I'm not a medical professional, but here’s what this cry may suggest."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Audio } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: MOMVERSE_SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "I couldn't analyze the audio clearly. Please try again.";
  } catch (error) {
    console.error("Cry analysis failed", error);
    throw new Error("Unable to analyze cry audio at this time.");
  }
};

export const analyzeSymptom = async (description: string, age: string, base64Image?: string, mimeType?: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Analyze these symptoms: "${description}".
    ${age ? `Baby's Age: ${age}.` : ''}
    ${base64Image ? 'Also analyze the attached image.' : ''}
    1. Identify possible causes considering the age.
    2. Suggest gentle home-care steps.
    3. List red flags.
    4. REQUIRED SAFETY: "This is not medical advice. If symptoms worsen, consult a pediatrician."
  `;

  const parts: any[] = [{ text: prompt }];
  if (base64Image && mimeType) {
    parts.unshift({ inlineData: { mimeType, data: base64Image } });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: MOMVERSE_SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "I couldn't process the symptom check. Please try again.";
  } catch (error) {
    console.error("Symptom analysis failed", error);
    throw new Error("Unable to analyze symptoms at this time.");
  }
};

export const chatWithMomVerse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string): Promise<string> => {
  const ai = getAI();
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: MOMVERSE_SYSTEM_INSTRUCTION,
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm here for you, but I couldn't generate a response right now.";
  } catch (error) {
    console.error("Chat failed", error);
    throw new Error("Connection issue. Please try again.");
  }
};

export const generateMealPlan = async (dietType: string, cuisine: string): Promise<string> => {
    const ai = getAI();
    try {
        const prompt = `
          Generate a simple, nutritious one-day meal plan for a breastfeeding mom.
          Cuisine/Region: ${cuisine || 'International'}.
          Diet Preference: ${dietType}.
          IMPORTANT: STRICTLY NO BEEF.
          Include breakfast, lunch, dinner, and 2 snacks.
          Focus on iron-rich, galactogogues (milk-boosting), and energy-boosting foods appropriate for postpartum recovery.
          Keep it formatted nicely.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction: MOMVERSE_SYSTEM_INSTRUCTION }
        });
        return response.text || "Could not generate meal plan.";
    } catch (e) {
        throw e;
    }
}