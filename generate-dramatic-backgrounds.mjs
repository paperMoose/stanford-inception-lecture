import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: path.join(process.env.HOME, 'git/cali-supplements/.env.local') });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prompts = [
  {
    name: "Part 1: AI Native",
    filename: "bg-part1-ai-native.png",
    prompt: `Create a dramatic, cinematic full-bleed background image of an abstract neural network visualization.

    Style: Deep space feeling with glowing neural synapses spreading across the entire frame.
    Colors: Dark purple-blue background (#1a1a2e), bright blue glowing nodes (#42a5f5), subtle green accents (#66bb6a).
    Composition: Neurons and connections spreading from center outward, fading at edges. Depth and dimension.
    Mood: Futuristic, intelligent, vast, mysterious.

    CRITICAL: 16:9 aspect ratio. EDGE TO EDGE coverage. NO icons, NO text, NO logos. Pure abstract atmosphere.
    This will be used as a presentation slide background with text overlaid, so keep the center relatively clear but atmospheric.`
  },
  {
    name: "Part 2: Pipeline",
    filename: "bg-part2-pipeline.png",
    prompt: `Create a dramatic, cinematic full-bleed background image of flowing data streams.

    Style: Rivers of light and data particles flowing horizontally across a dark landscape, like digital aurora borealis.
    Colors: Dark purple-blue background (#1a1a2e), golden-yellow flowing streams (#ffca28), blue particle accents (#42a5f5).
    Composition: Streams flowing left to right, with depth - some in foreground, some distant. Glowing particles.
    Mood: Dynamic, automated, efficient, beautiful movement.

    CRITICAL: 16:9 aspect ratio. EDGE TO EDGE coverage. NO icons, NO text, NO logos. Pure abstract atmosphere.
    Center should be slightly clearer for text overlay but still atmospheric.`
  },
  {
    name: "Part 3: Evaluation",
    filename: "bg-part3-evaluation.png",
    prompt: `Create a dramatic, cinematic full-bleed background image of an abstract radar/analysis visualization.

    Style: Concentric circles like sonar or radar, with data points and scanning beams. Quality control aesthetic.
    Colors: Dark purple-blue background (#1a1a2e), green scanning beams and rings (#66bb6a), blue data points (#42a5f5).
    Composition: Centered radar pattern with rings emanating outward, subtle grid lines, floating data particles.
    Mood: Analytical, precise, thorough, scientific.

    CRITICAL: 16:9 aspect ratio. EDGE TO EDGE coverage. NO icons, NO text, NO logos. Pure abstract atmosphere.
    Keep center clear enough for text but maintain the scanning/analysis aesthetic.`
  },
  {
    name: "Title Slide",
    filename: "bg-title-hero.png",
    prompt: `Create a dramatic, cinematic full-bleed background image of a futuristic tech horizon.

    Style: Abstract cityscape or mountain range made entirely of glowing circuit patterns and data structures.
    Rising from bottom of frame toward a glowing horizon. Deep atmosphere and fog.
    Colors: Dark purple-blue sky (#1a1a2e), blue circuit glow (#42a5f5), green accent lights (#66bb6a).
    Composition: Horizon in lower third, structures rising up, atmospheric haze, sense of vast scale.
    Mood: Epic, inspiring, the dawn of a new era, technological sublime.

    CRITICAL: 16:9 aspect ratio. EDGE TO EDGE coverage. NO icons, NO text, NO logos.
    Upper portion should be clear for title text.`
  },
  {
    name: "Key Insight",
    filename: "bg-key-insight.png",
    prompt: `Create a dramatic, cinematic full-bleed background image of a moment of illumination.

    Style: Abstract light burst or revelation moment - soft explosion of light particles emanating from center.
    Not harsh, but profound and beautiful. Like understanding dawning.
    Colors: Dark purple-blue background (#1a1a2e), warm white/blue light burst at center, blue (#42a5f5) and subtle gold particles.
    Composition: Central soft glow with particles and light rays spreading outward, fading to dark edges.
    Mood: Eureka moment, clarity, breakthrough, profound understanding.

    CRITICAL: 16:9 aspect ratio. EDGE TO EDGE coverage. NO icons, NO text, NO logos.
    The glow should be soft enough that white text is readable over it.`
  },
  {
    name: "Failures Are Data",
    filename: "bg-failures-data.png",
    prompt: `Create a dramatic, cinematic full-bleed background image showing transformation from chaos to order.

    Style: Abstract visualization of shattered/broken red fragments on the left transforming into organized green/blue
    crystalline structures on the right. A beautiful metamorphosis.
    Colors: Dark purple-blue background (#1a1a2e), red fragments (#ef5350) on left, transitioning to green (#66bb6a)
    and blue (#42a5f5) organized patterns on right.
    Composition: Gradient of transformation left to right, floating particles, sense of reconstruction.
    Mood: Redemption, learning, beauty from mistakes, growth.

    CRITICAL: 16:9 aspect ratio. EDGE TO EDGE coverage. NO icons, NO text, NO logos.
    Keep center relatively clear for text overlay.`
  },
  {
    name: "Q&A Slide",
    filename: "bg-qa.png",
    prompt: `Create a dramatic, cinematic full-bleed background image with warm, inviting abstract waves.

    Style: Soft, flowing abstract waves or aurora-like patterns. Welcoming and open feeling.
    Gentle movement suggested, not static. Organic flowing forms.
    Colors: Dark purple-blue background (#1a1a2e), soft blue waves (#42a5f5), hints of warm purple and green (#66bb6a).
    Composition: Flowing horizontal bands or waves, creating depth and warmth. Softer than other slides.
    Mood: Welcoming, conversational, open, friendly but professional.

    CRITICAL: 16:9 aspect ratio. EDGE TO EDGE coverage. NO icons, NO text, NO logos.
    Center should be clear for contact information.`
  }
];

async function generateImage(item) {
  console.log(`\nGenerating: ${item.name}...`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: item.prompt,
      config: { responseModalities: ["image", "text"] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        const outputPath = path.join(__dirname, "slides", "images", item.filename);
        fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, "base64"));
        console.log(`  ✓ Saved: ${item.filename}`);
        return true;
      }
    }
    console.log(`  ✗ No image generated`);
    return false;
  } catch (error) {
    console.error(`  ✗ Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log("===========================================");
  console.log("Generating dramatic full-bleed backgrounds");
  console.log("===========================================");

  for (const item of prompts) {
    await generateImage(item);
    await new Promise(r => setTimeout(r, 3000)); // Longer delay between requests
  }

  console.log("\n✨ Done! Generated backgrounds:");
  const dir = path.join(__dirname, "slides", "images");
  fs.readdirSync(dir).filter(f => f.startsWith('bg-')).forEach(f => console.log(`  - ${f}`));
}

main();
