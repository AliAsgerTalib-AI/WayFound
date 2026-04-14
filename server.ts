import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Generation Endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, schema, model } = req.body;
      const rawKey = process.env.GEMINI_API_KEY || "";
      const viteKey = process.env.VITE_GEMINI_API_KEY || "";
      const appKey = process.env.APP_GEMINI_KEY || "";
      const apiKey = (appKey || rawKey || viteKey || "").trim();
      const source = appKey ? "APP_GEMINI_KEY" : (rawKey ? "GEMINI_API_KEY" : (viteKey ? "VITE_GEMINI_API_KEY" : "NONE"));
      
      console.log(`AI Request: Source=${source}, Model=${model || "default"}, KeyLength=${apiKey.length}, KeyPrefix=${apiKey.substring(0, 4)}`);

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
      
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
