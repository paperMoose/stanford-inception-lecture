import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: path.join(process.env.HOME, 'git/cali-supplements/.env.local') });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  console.log("Generating clean, simple title slide background...");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: `Create a simple, elegant abstract background for a professional presentation.

    STYLE: Clean, minimal, modern. Think Apple keynote or high-end corporate presentation.

    DESIGN: Soft gradient with subtle geometric shapes or gentle flowing curves.
    Nothing busy or complex. Elegant simplicity.

    COLORS: Dark navy/purple base (#1a1a2e) with soft blue (#42a5f5) and
    subtle teal accents. Maybe some gentle bokeh or soft light effects.

    MOOD: Professional, sophisticated, calm, trustworthy.

    REQUIREMENTS:
    - 16:9 aspect ratio
    - Very subtle and understated - NOT busy
    - NO text, NO logos, NO icons
    - Should work as a background with text overlaid
    - Clean and professional, like a premium tech company presentation`,
    config: { responseModalities: ["image", "text"] },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData?.data) {
      const outputPath = path.join(__dirname, "slides", "images", "bg-title-hero.png");
      fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, "base64"));
      console.log("✓ Saved new bg-title-hero.png");
      return;
    }
  }
  console.log("✗ No image generated");
}

generate();
