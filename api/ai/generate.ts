import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, schema, model } = req.body;
    const rawKey = process.env.GEMINI_API_KEY || "";
    const viteKey = process.env.VITE_GEMINI_API_KEY || "";
    const appKey = process.env.APP_GEMINI_KEY || "";
    const apiKey = (appKey || rawKey || viteKey || "").trim();
    const source = appKey ? "APP_GEMINI_KEY" : (rawKey ? "GEMINI_API_KEY" : (viteKey ? "VITE_GEMINI_API_KEY" : "NONE"));
    
    console.log(`AI Request (Vercel): Source=${source}, Model=${model || "default"}, KeyLength=${apiKey.length}, KeyPrefix=${apiKey.substring(0, 4)}`);

    if (!apiKey || apiKey === "undefined" || apiKey === "null") {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server. Please check your environment variables." });
    }

    if (!apiKey.startsWith("AIza")) {
      const isPlaceholder = apiKey.includes("MY_") || apiKey.includes("YOUR_") || apiKey.includes("KEY");
      const helpText = isPlaceholder 
        ? "It looks like you're using a placeholder value (like 'MY_GEMINI_API_KEY')." 
        : "Please ensure you have copied the full key correctly.";
      
      return res.status(400).json({ 
        error: `Invalid API Key format in ${source}. Gemini keys must start with 'AIza'. ${helpText} Your key starts with: "${apiKey.substring(0, 4)}"` 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = model || "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI returned empty response");
    }
    
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error("AI Generation Error (Vercel):", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate content" });
  }
}
