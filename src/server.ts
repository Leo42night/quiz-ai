import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const app = express();

app.use(cors());
app.use(express.json());

// 1. API route
app.post("/api/evaluate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required" });
    }

    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct",
      {
        input: {
          prompt,
          max_tokens: 256,
          temperature: 0.3,
        },
      }
    );

    const aiText = Array.isArray(output)
      ? output.join("")
      : String(output ?? "");

    return res.json({ aiText });
  } catch (err) {
    console.error("ERROR /api/evaluate:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Serve file statis hasil Vite build (dist/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "../dist");

// ini nyediain semua asset: index.css, main.js, dll
app.use(express.static(distPath));

// 3. Fallback untuk semua rute lain -> index.html
// Express 4 BISA pakai '*' lagi 🙌
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// 4. Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
