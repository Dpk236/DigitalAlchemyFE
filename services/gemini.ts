
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, QuizQuestion, ConceptNote } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export async function explainConcept(concept: string, context: string, language: string = 'english'): Promise<string> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the following concept in simple terms for a JEE/NEET student. 
    Concept: ${concept}
    Context: ${context}
    Language: ${language}
    Focus on first principles and common pitfalls.`,
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text || "Failed to generate explanation.";
}

export async function generateFlashcards(topic: string): Promise<Flashcard[]> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 flashcards for the topic: ${topic}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING },
                subject: { type: Type.STRING }
              },
              required: ["front", "back", "subject"]
            }
          }
        },
        required: ["cards"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{"cards":[]}');
    return data.cards.map((c: any, i: number) => ({ ...c, id: `fc-${i}-${Date.now()}` }));
  } catch (e) {
    return [];
  }
}

export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 high-quality JEE/NEET style multiple choice questions for the topic: ${topic}. Include detailed reasoning for why the correct answer is right and others are wrong.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              },
              required: ["question", "options", "correctIndex", "reasoning"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{"questions":[]}');
    return data.questions.map((q: any, i: number) => ({ ...q, id: `q-${i}-${Date.now()}` }));
  } catch (e) {
    return [];
  }
}

export async function generateVisualExplanation(prompt: string): Promise<string> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [{ text: `A clear, educational scientific diagram for: ${prompt}. High quality, white background, labeled.` }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "";
}

export async function generateTTS(text: string, voice: string = 'Kore'): Promise<ArrayBuffer> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio returned");

  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
