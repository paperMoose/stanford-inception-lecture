import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: path.join(process.env.HOME, 'git/cali-supplements/.env.local') });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  console.log("Generating epic title slide background...");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: `Create a breathtaking, cinematic wide-angle photograph-style image for a tech presentation title slide.

    SCENE: A vast, dark cosmos transitioning into a luminous digital frontier. Imagine standing at the edge of space
    looking down at an abstract representation of Earth's digital transformation.

    FOREGROUND: Streams of glowing data particles and light trails converging toward a bright focal point,
    like rivers of intelligence flowing toward a central singularity.

    MIDGROUND: Abstract geometric structures - crystalline formations or elegant wireframe architecture
    that suggests advanced AI infrastructure, floating in space.

    BACKGROUND: Deep space gradient from rich purple-black (#0a0a1a) to deep blue (#1a1a3e), with subtle
    nebula-like clouds and distant stars.

    LIGHTING: A dramatic central light source creating god rays and lens flare effects.
    Primary glow in bright blue (#42a5f5), secondary accents in electric green (#66bb6a).

    MOOD: Awe-inspiring, like witnessing the birth of a new technological era.
    Epic scale. Cinematic quality. The feeling of standing at the threshold of something transformative.

    STYLE: Ultra-high quality, photorealistic rendering meets abstract digital art.
    Think: Interstellar meets Blade Runner 2049 meets abstract data visualization.

    CRITICAL REQUIREMENTS:
    - 16:9 aspect ratio, landscape orientation
    - EDGE TO EDGE coverage, no borders
    - NO text, NO logos, NO icons, NO UI elements
    - Upper 40% should be darker/clearer for title text overlay
    - Rich detail throughout but not cluttered
    - Professional presentation quality`,
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
