import { GoogleGenAI, Type } from "@google/genai";

// Ensure API key is present; application relies on environment variable.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export interface LabelAnalysis {
  brand: string;
  origin: string;
  material: string;
}

export const analyzeLabelImage = async (base64Image: string): Promise<LabelAnalysis> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  // Schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      brand: { type: Type.STRING, description: "The brand name found on the label. If unknown, use 'Unknown Brand'." },
      origin: { type: Type.STRING, description: "Country of origin, e.g., 'Made in China'." },
      material: { type: Type.STRING, description: "Primary material composition, e.g., '100% Cotton'." },
    },
    required: ["brand", "origin", "material"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: "Analyze this clothing label. Extract the Brand Name, Country of Origin, and Primary Material.",
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from AI.");
    }

    const data = JSON.parse(text) as LabelAnalysis;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const calculateEthicalScore = (brand: string, material: string, origin: string): number => {
  let baseRisk = 0;

  // Material Risk
  const matLower = material.toLowerCase();
  if (matLower.includes("polyester") || matLower.includes("nylon") || matLower.includes("acrylic")) {
    baseRisk += 30;
  } else if (matLower.includes("organic") || matLower.includes("recycled")) {
    baseRisk += 5;
  } else {
    baseRisk += 20;
  }

  // Origin Risk
  const originLower = origin.toLowerCase();
  const highRiskOrigins = ["china", "bangladesh", "vietnam", "india", "cambodia"];
  
  if (highRiskOrigins.some(country => originLower.includes(country))) {
    baseRisk += 40;
  } else if (originLower.includes("portugal") || originLower.includes("uk") || originLower.includes("italy")) {
    baseRisk += 10;
  } else {
    baseRisk += 25;
  }

  return Math.max(1, Math.min(99, baseRisk));
};