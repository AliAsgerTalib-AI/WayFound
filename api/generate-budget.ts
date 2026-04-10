import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, schema } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured on the server. Please add it to your Vercel Environment Variables." 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    // Parse and return the JSON response from Gemini
    const result = JSON.parse(response.text);
    res.status(200).json(result);
  } catch (error) {
    console.error("Vercel API Error:", error);
    res.status(500).json({ 
      error: "Failed to generate budget from Gemini.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
