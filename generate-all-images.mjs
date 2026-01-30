import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: path.join(process.env.HOME, 'git/cali-supplements/.env.local') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY not found");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const imagePrompts = [
  // Part dividers
  {
    name: "Part 1 - AI Native",
    prompt: `Minimal abstract icon representing "AI Native" concept.
    Dark background (#1a1a2e).
    A glowing brain or neural network merged with circuit patterns.
    Blue (#42a5f5) and subtle purple accents.
    Very minimal, iconic, centered. No text. Professional tech style.
    Square format, simple, could be used as a slide accent.`,
    filename: "part1-ai-native.png"
  },
  {
    name: "Part 2 - Pipeline",
    prompt: `Minimal abstract icon representing an automated pipeline or workflow.
    Dark background (#1a1a2e).
    Connected nodes flowing left to right, like a data pipeline.
    Yellow (#ffca28) and blue (#42a5f5) glowing elements.
    Very minimal, iconic, centered. No text. Professional tech style.
    Square format, simple, could be used as a slide accent.`,
    filename: "part2-pipeline.png"
  },
  {
    name: "Part 3 - Evaluation",
    prompt: `Minimal abstract icon representing quality assurance or evaluation.
    Dark background (#1a1a2e).
    A checkmark or gauge with analytical elements, maybe a magnifying glass over data.
    Green (#66bb6a) and blue (#42a5f5) glowing elements.
    Very minimal, iconic, centered. No text. Professional tech style.
    Square format, simple, could be used as a slide accent.`,
    filename: "part3-evaluation.png"
  },
  // Concept slides
  {
    name: "Failures Are Data",
    prompt: `Abstract visualization of turning failures into insights.
    Dark background (#1a1a2e).
    Red error symbols or X marks transforming into green checkmarks or light bulbs.
    Show a transformation or metamorphosis from red (#ef5350) to green (#66bb6a).
    Minimal, modern, professional. No text. Clean geometric style.
    16:9 aspect ratio.`,
    filename: "failures-data.png"
  },
  {
    name: "Spec-Driven Development",
    prompt: `Abstract visualization of a specification document controlling code generation.
    Dark background (#1a1a2e).
    A glowing document or checklist on the left, with code/automation flowing from it.
    Blue (#42a5f5) document, green (#66bb6a) outputs.
    Minimal, modern, professional. No text. Clean geometric style.
    16:9 aspect ratio.`,
    filename: "spec-driven.png"
  },
  {
    name: "Key Takeaways",
    prompt: `Abstract visualization of key insights or lightbulb moments.
    Dark background (#1a1a2e).
    Four glowing elements arranged elegantly - could be abstract lightbulbs or stars.
    Use blue (#42a5f5), green (#66bb6a), yellow (#ffca28), and subtle red (#ef5350).
    Minimal, modern, professional. No text. Clean geometric style.
    16:9 aspect ratio.`,
    filename: "takeaways.png"
  }
];

async function generateImage(prompt) {
  console.log(`Generating: ${prompt.name}...`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt.prompt,
      config: {
        responseModalities: ["image", "text"],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
          const imageData = part.inlineData.data;
          const outputPath = path.join(__dirname, "slides", "images", prompt.filename);

          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, Buffer.from(imageData, "base64"));
          console.log(`  ✓ Saved: ${prompt.filename}`);
          return true;
        }
      }
    }

    console.log(`  ✗ No image in response`);
    return false;
  } catch (error) {
    console.error(`  ✗ Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log("Generating images for Stanford presentation...\n");

  for (const prompt of imagePrompts) {
    await generateImage(prompt);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\nDone! Generated images:");
  const imagesDir = path.join(__dirname, "slides", "images");
  const files = fs.readdirSync(imagesDir);
  files.forEach(f => console.log(`  - ${f}`));
}

main();
