
import { GoogleGenAI, Type } from "@google/genai";

export const getCampaignSuggestions = async (businessCategory: string, cardType: string) => {
  try {
    // Si no hay API_KEY en el entorno, devolvemos fallbacks de inmediato
    if (!process.env.API_KEY) {
      console.warn("API_KEY no detectada. Usando frases de respaldo.");
      return [
        { suggestion: "¡Te extrañamos! Visítanos hoy y suma un sello extra." },
        { suggestion: "¡Felicidades! Estás muy cerca de tu próximo premio." },
        { suggestion: "Solo por hoy: Doble puntaje en tu consumo habitual." }
      ];
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un experto en marketing BTL y fidelización digital. Sugiere 3 frases persuasivas, creativas y cortas para una campaña de notificaciones push de un negocio de tipo ${businessCategory}. La tarjeta es de tipo ${cardType}. Usa un tono cercano y emocionante. Máximo 10 palabras por frase.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              suggestion: { type: Type.STRING }
            },
            required: ["suggestion"]
          }
        }
      },
    });
    
    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Empty response");

    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { suggestion: "¡Te extrañamos! Visítanos hoy y suma un sello extra." },
      { suggestion: "¡Felicidades! Estás muy cerca de tu próximo premio." },
      { suggestion: "Solo por hoy: Doble puntaje en tu consumo habitual." }
    ];
  }
};
