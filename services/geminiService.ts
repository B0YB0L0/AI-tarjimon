
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const translateWord = async (word: string, targetLanguage: string): Promise<string> => {
  try {
    const prompt = `Translate the Uzbek word "${word}" into ${targetLanguage}. Provide a clear and concise definition or meaning of the word in ${targetLanguage}. If the word has multiple meanings, list the most common ones.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API Key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to get translation from AI. Please try again later.");
  }
};
