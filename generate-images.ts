import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY not found");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ImagePrompt {
  name: string;
  prompt: string;
  filename: string;
}

const imagePrompts: ImagePrompt[] = [
  {
    name: "Title Slide Hero",
    prompt: `Create a sleek, modern abstract visualization representing AI-native software architecture.
    Dark purple/blue gradient background (#1a1a2e to #2a2a4e).
    Show interconnected glowing nodes and flowing data streams in blue (#42a5f5) and green (#66bb6a) colors.
    Minimal, professional, suitable for a tech presentation at Stanford.
    No text. Clean geometric shapes. Subtle glow effects. 16:9 aspect ratio.`,
    filename: "hero-abstract.png"
  },
  {
    name: "Human in the Loop",
    prompt: `Create a minimal, elegant illustration showing the concept of "human-in-the-loop" AI workflow.
    Dark background (#1a1a2e).
    Show a simple human figure icon in the center, surrounded by a circular flow of AI/automation symbols.
    Use blue (#42a5f5) for AI elements and green (#66bb6a) for human touchpoints.
    Clean, geometric, professional style. No text. Suitable for tech presentation.`,
    filename: "human-in-loop.png"
  },
  {
    name: "Context Compounding",
    prompt: `Create an abstract visualization of "context as an appreciating asset" - knowledge compounding over time.
    Dark purple background (#1a1a2e).
    Show layers or stacks building up, glowing brighter towards the top.
    Use gradient from blue (#42a5f5) at bottom to bright green (#66bb6a) at top.
    Minimal, modern, professional. No text. Clean lines and subtle glow effects.`,
    filename: "context-compounding.png"
  }
];

async function generateImage(prompt: ImagePrompt) {
  console.log(`Generating: ${prompt.name}...`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt.prompt,
      config: {
        responseModalities: ["image", "text"],
      },
    });

    // Extract image from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
          const imageData = part.inlineData.data;
          const outputPath = path.join(__dirname, "slides", "images", prompt.filename);

          // Ensure directory exists
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });

          // Write image
          fs.writeFileSync(outputPath, Buffer.from(imageData, "base64"));
          console.log(`  ✓ Saved: ${outputPath}`);
          return true;
        }
      }
    }

    console.log(`  ✗ No image in response for ${prompt.name}`);
    return false;
  } catch (error) {
    console.error(`  ✗ Error generating ${prompt.name}:`, error);
    return false;
  }
}

async function main() {
  console.log("Generating images for Stanford presentation...\n");

  for (const prompt of imagePrompts) {
    await generateImage(prompt);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\nDone!");
}

main();
