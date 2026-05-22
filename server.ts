import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily, safely handling missing keys
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-Memory CMS database of Streto Culture
const initialCmsData = {
  hero: {
    heading: "SUMMER DROP '26",
    subheading: "VOL. IV: DISTORTED NOSTALGIA",
    bannerImage: "/src/assets/images/streto_hero_campaign_1779468076976.png",
    ctaText: "DISCOVER ANOMALY",
    overlayOpacity: 45,
    fullscreen: true,
    accentColor: "#DF2D2D", // Metallic crimson deep red
  },
  dropDate: "2026-07-10T18:00:00.000Z",
  marqueeTexts: [
    "FREE YOUR MIND",
    "STRETO CULTURE",
    "VOL. IV RELEASES 10.07.26",
    "DXSTRA SHIFT",
    "LIMITED SILHOUETTES ONLY",
    "DETACHED STATE"
  ],
  brandStory: {
    quote: "Don’t tell me how to dress, tell them not to judge.",
    description: "Streto Culture was established to challenge the commercialized grid of modern attire. We compose archival fashion elements, brutalist shapes, and highly tactical silhouettes designed for individual resistance. Every garment is a numbered edition, manufactured in limited micro-batches of 100 with zero repetition.",
    timeline: [
      { year: "2024", event: "Streto Core founded, establishing brutalist apparel directives." },
      { year: "2025", event: "Sold out Volume II Launch 'Detached State' in 45 seconds worldwide." },
      { year: "2026", event: "Transitioning to fully headless CMS-driven seasonal activations." }
    ]
  },
  products: [
    {
      id: "prod-1",
      name: "ARCHIVAL BOXY FLEECE HOODIE",
      price: 180,
      salePrice: 155,
      primaryImage: "/src/assets/images/streto_lookbook_1_1779468097328.png",
      hoverImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
      category: "hoodies",
      sizes: ["S", "M", "L", "XL"],
      badge: "LTD RE-RUN",
      materials: "450GSM Organic Heavy French Terry, Double-lined Hood, Distressed cuffs",
      fit: "Extreme Oversized Crop silhouette, size-down for standard wear",
      limitedRunCount: 100,
      stockCount: 12,
    },
    {
      id: "prod-2",
      name: "TACTICAL SLATE INDUSTRIAL CARGO",
      price: 240,
      salePrice: null,
      primaryImage: "/src/assets/images/streto_lookbook_2_1779468118793.png",
      hoverImage: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&q=80&w=600",
      category: "denim",
      sizes: ["30", "32", "34", "36"],
      badge: "LIMITED DROP",
      materials: "Heavy Ripstop Cotton, Matte Steel Buckles, Adjustable hem cords",
      fit: "Relaxed Articulated Knee fitting, structured drape",
      limitedRunCount: 75,
      stockCount: 8,
    },
    {
      id: "prod-3",
      name: "METAL EMBOSSED CREWNECK",
      price: 130,
      salePrice: null,
      primaryImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600",
      hoverImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=600",
      category: "tees",
      sizes: ["S", "M", "L", "XL"],
      badge: "NEW COUTURÉ",
      materials: "100% Peruvian Cotton, Distressed brushed graphics, Embossed elements",
      fit: "Drop shoulder silhouette",
      limitedRunCount: 150,
      stockCount: 77,
    },
    {
      id: "prod-4",
      name: "TENSION MATTE SILVER BALACLAVA",
      price: 75,
      salePrice: 60,
      primaryImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600", // shoes proxy
      hoverImage: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600",
      category: "accessories",
      sizes: ["O/S"],
      badge: "SOLD OUT SEASONS",
      materials: "Fine-knit breathable elastic threads, micro-fleece interior layer",
      fit: "Adaptive compression alignment",
      limitedRunCount: 50,
      stockCount: 0,
    }
  ],
  lookbooks: [
    {
      title: "BRUTALIST SOLITUDE",
      credits: "Photography by Soren Vance | Creative Direction by DXSTRA",
      overview: "Shot entirely on location in London Barbican Estate. Capturing deep dark shadows against high modernist concrete ribs.",
      notes: "The raw geometry of the architectures mirrors the heavy layered structure of the French-terry fleece drops, evoking protective luxury and emotional shelter."
    }
  ]
};

let currentCmsData = JSON.parse(JSON.stringify(initialCmsData));

// CMS Data access endpoints
app.get("/api/cms-data", (req, res) => {
  res.json({ status: "success", data: currentCmsData });
});

app.post("/api/cms-data", (req, res) => {
  try {
    currentCmsData = { ...currentCmsData, ...req.body };
    res.json({ status: "success", data: currentCmsData, message: "CMS Settings published successfully." });
  } catch (error: any) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

app.post("/api/cms-data/reset", (req, res) => {
  currentCmsData = JSON.parse(JSON.stringify(initialCmsData));
  res.json({ status: "success", data: currentCmsData, message: "CMS Schema standard defaults restored." });
});

// Server-side Gemini AI Couture Stylist API
app.post("/api/gemini/style", async (req, res) => {
  try {
    const { items, vibe, customQuery } = req.body;
    
    // Lazy initialized safely
    const ai = getGeminiClient();

    let itemsStr = "";
    if (items && Array.isArray(items) && items.length > 0) {
      itemsStr = items.map((it: any) => `- ${it.name} (${it.category}, size: ${it.size || "M"})`).join("\n");
    } else {
      itemsStr = "No specific garments selected. Suggest a statement winter capsule look.";
    }

    const systemInstruction = `You are a high-end streetwear editorial director and styling consultant for Streto Culture.
Your tone is deeply confident, minimal, intellectual, avant-garde and poetic.
Avoid commercial jargon, bubbly sales speech, and cheesy punctuation like exclamation marks.
Focus on dark luxury styling: layering proportions, balancing heavy structured shapes (French terry hoodies, heavy canvas) with fluid technical pieces, and styling accessories like silver tension chains.
Refer to modern icons like Fear of God, Rick Owens, ALD, and brutalist streetwear.
Respond with a elegant, visually custom JSON response containing editorial capsule styling suggestions.`;

    const prompt = `Styling Directive request:
    Garments to Style:
    ${itemsStr}
    
    Selected Vibe Profile: ${vibe || "Distorted Solitude (Heavy, Layered, Monochromatic)"}
    Custom styling inquiry/parameters: ${customQuery || "How should I structure this look for high-fashion lookbook aesthetic?"}
    
    Generate styling guidelines.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            conceptName: { type: "STRING", description: "Name of the styled concept, e.g., Brutalist Architectural Layering" },
            editorialVibeDescription: { type: "STRING", description: "Minimal, vivid description of the editorial feeling. Keep it raw and poetic." },
            layeringDirectives: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "3 structured steps showing exactly how to wear the pieces together for premium proportion and styling silhouette."
            },
            accessoriesMatching: { type: "STRING", description: "Lookbook matching items or accessories needed to finish the expression (e.g. brutalist metallic jewelry, black tactical boots)." },
            designerQuote: { type: "STRING", description: "An underground streetwear quote or styling insight for this specific capsule look." }
          },
          required: ["conceptName", "editorialVibeDescription", "layeringDirectives", "accessoriesMatching", "designerQuote"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini stylist API error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "The server-side Streto Stylist engine is asleep. Verify your GEMINI_API_KEY settings."
    });
  }
});

// Vite server integration or Production static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use Vite middlewares for rendering frontend React assets
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware");
  } else {
    // Serve production static assets from /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Streto Culture backend listening on http://localhost:${PORT}`);
  });
}

startServer();
