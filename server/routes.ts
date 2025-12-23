import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEmergencyLogSchema } from "@shared/schema";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register integration routes
  registerChatRoutes(app);
  registerImageRoutes(app);

  // User Profile
  app.get("/api/user/profile", async (req, res) => {
    const user = await storage.getUser();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.post("/api/user/profile", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.updateUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Emergency
  app.post("/api/emergency/trigger", async (req, res) => {
    try {
      const { locationLat, locationLng } = insertEmergencyLogSchema.parse(req.body);
      await storage.createEmergencyLog(locationLat || undefined, locationLng || undefined);
      // In a real app, we would trigger SMS/Call here via Twilio or similar
      res.json({ success: true, message: "Emergency triggered. Location logged." });
    } catch (error) {
      res.status(500).json({ message: "Failed to trigger emergency" });
    }
  });

  // Scan History
  app.get("/api/scan-history", async (req, res) => {
    const logs = await storage.getScanLogs();
    res.json(logs);
  });

  // AI Routes
  
  // Helper for Vision API
  async function analyzeImage(base64Image: string, prompt: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: base64Image.startsWith("data:") ? base64Image : `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });
    return response.choices[0].message.content || "";
  }

  app.post("/api/detect-object", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ message: "Image required" });

      const prompt = `Identify the main objects in this image. Return ONLY a JSON object with a key 'objects' containing an array of objects, where each object has 'name' and 'confidence' (0-100). Example: { "objects": [{ "name": "chair", "confidence": 95 }] }. Do not include markdown formatting.`;
      
      const resultText = await analyzeImage(image, prompt);
      const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (e) {
        parsed = { objects: [{ name: resultText, confidence: 0 }] };
      }

      // Log it
      if (parsed.objects && parsed.objects.length > 0) {
        const topObj = parsed.objects[0];
        await storage.createScanLog("object", topObj.name, topObj.confidence);
      }

      res.json(parsed);
    } catch (error) {
      console.error("Object detection error:", error);
      res.status(500).json({ message: "Failed to detect objects" });
    }
  });

  app.post("/api/read-text", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ message: "Image required" });

      const prompt = `Read all the visible text in this image. Return ONLY a JSON object with a key 'text' containing the extracted string. Example: { "text": "Hello World" }. Do not include markdown formatting.`;
      
      const resultText = await analyzeImage(image, prompt);
      const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (e) {
        parsed = { text: resultText };
      }

      if (parsed.text) {
        await storage.createScanLog("text", parsed.text.substring(0, 100) + "...");
      }

      res.json(parsed);
    } catch (error) {
      console.error("OCR error:", error);
      res.status(500).json({ message: "Failed to read text" });
    }
  });

  app.post("/api/detect-currency", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ message: "Image required" });

      const prompt = `Identify the Indian currency note in this image. Return ONLY a JSON object with keys 'value' (number) and 'currency' (string, e.g. "INR"). If no currency is found, return value 0. Example: { "value": 500, "currency": "INR" }. Do not include markdown formatting.`;
      
      const resultText = await analyzeImage(image, prompt);
      const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (e) {
        parsed = { value: 0, currency: "Unknown" };
      }

      if (parsed.value > 0) {
        await storage.createScanLog("currency", `${parsed.value} ${parsed.currency}`);
      }

      res.json(parsed);
    } catch (error) {
      console.error("Currency detection error:", error);
      res.status(500).json({ message: "Failed to detect currency" });
    }
  });

  // Seed initial user
  const existingUser = await storage.getUser();
  if (!existingUser) {
    await storage.updateUser({
      name: "User",
      address: "",
      emergencyContact: "",
      language: "en",
    });
  }

  return httpServer;
}
