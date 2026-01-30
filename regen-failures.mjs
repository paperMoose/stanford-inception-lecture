import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: path.join(process.env.HOME, 'git/cali-supplements/.env.local') });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  console.log("Regenerating failures-data with dark background...");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: `Create an abstract visualization showing transformation from failures to insights.
    IMPORTANT: Use a DARK background color (#1a1a2e or similar dark navy/purple).
    On the left side, show abstract red (#ef5350) error symbols or broken shapes.
    In the middle, show a transformation effect with glowing particles.
    On the right side, show green (#66bb6a) success symbols or lightbulbs emerging.
    The overall flow should go from chaotic red to organized green.
    Minimal, modern, professional. NO TEXT whatsoever. Clean geometric shapes only.
    16:9 aspect ratio. Dark tech presentation style.`,
    config: { responseModalities: ["image", "text"] },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData?.data) {
      const outputPath = path.join(__dirname, "slides", "images", "failures-data.png");
      fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, "base64"));
      console.log("✓ Saved failures-data.png");
      return;
    }
  }
  console.log("✗ No image generated");
}

generate();
