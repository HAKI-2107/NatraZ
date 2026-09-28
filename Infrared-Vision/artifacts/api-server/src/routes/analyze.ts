import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { config } from "../lib/config";

const router: IRouter = Router();
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const confidenceSchema = z.enum(["high", "medium", "low"]);
const analysisSchema = z.object({
  summary: z.string(),
  confidence: confidenceSchema,
  terrainClassification: z.object({
    type: z.string(),
    confidence: z.number().min(0).max(1),
  }),
  urbanDensity: z.object({
    classification: z.enum(["low", "medium", "high"]),
    confidence: z.number().min(0).max(1),
  }),
  infrastructure: z.array(z.object({
    type: z.enum(["road", "building", "bridge", "industrial", "other"]),
    description: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  waterBodies: z.array(z.object({
    type: z.enum(["river", "lake", "reservoir", "pond", "other"]),
    description: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  vegetation: z.object({
    classification: z.string(),
    confidence: z.number().min(0).max(1),
  }),
  thermalAnomalies: z.array(z.object({
    description: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    confidence: z.number().min(0).max(1),
  })),
  detectedTags: z.array(z.string()),
  limitations: z.array(z.string()),
});

const sceneRequestSchema = z.object({
  image: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/).optional(),
  center: z.object({
    lat: z.number().finite().min(-90).max(90),
    lng: z.number().finite().min(-180).max(180),
  }).optional(),
  lat: z.number().finite().min(-90).max(90).optional(),
  lng: z.number().finite().min(-180).max(180).optional(),
  zoom: z.number().finite().min(1).max(22).default(14),
  band: z.string().trim().max(80).default("ai_color"),
  bandMode: z.string().trim().max(80).optional(),
  composite: z.string().trim().max(120).default("default"),
  filterDescription: z.string().trim().max(240).optional(),
  mapProvider: z.string().trim().max(80).default("esri"),
  viewport: z.object({
    width: z.number().int().positive().max(4000).optional(),
    height: z.number().int().positive().max(4000).optional(),
  }).optional(),
});

type RecordLike = Record<string, unknown>;

const asRecord = (value: unknown): RecordLike =>
  value && typeof value === "object" && !Array.isArray(value) ? value as RecordLike : {};

const asString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const asConfidence = (value: unknown): "high" | "medium" | "low" => {
  if (value === "high" || value === "medium" || value === "low") return value;
  if (typeof value === "number") return value >= 0.75 ? "high" : value >= 0.45 ? "medium" : "low";
  return "low";
};

const asScore = (value: unknown) => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : 0;
};

const asArray = (value: unknown) => Array.isArray(value) ? value : [];

function safeErrorDetails(error: unknown) {
  const value = asRecord(error);
  return {
    type: typeof value.name === "string" ? value.name : typeof value.type === "string" ? value.type : "Error",
    status: typeof value.status === "number" ? value.status : undefined,
    code: typeof value.code === "string" ? value.code : undefined,
  };
}

function normalizeAnalysis(raw: unknown) {
  const input = asRecord(raw);
  const terrain = asRecord(input.terrainClassification);
  const urban = asRecord(input.urbanDensity);
  const vegetation = asRecord(input.vegetation);

  const normalized = {
    summary: asString(input.summary, "The scene could not be confidently characterized."),
    confidence: asConfidence(input.confidence),
    terrainClassification: {
      type: asString(terrain.type, "Unclassified terrain"),
      confidence: asScore(terrain.confidence),
    },
    urbanDensity: {
      classification: input.urbanDensity && ["low", "medium", "high"].includes(String(urban.classification))
        ? urban.classification as "low" | "medium" | "high"
        : "low" as const,
      confidence: asScore(urban.confidence),
    },
    infrastructure: asArray(input.infrastructure).map((item) => {
      const record = asRecord(item);
      const type = ["road", "building", "bridge", "industrial", "other"].includes(String(record.type))
        ? record.type as "road" | "building" | "bridge" | "industrial" | "other"
        : "other" as const;
      return {
        type,
        description: asString(record.description, "Visible infrastructure feature."),
        confidence: asScore(record.confidence),
      };
    }),
    waterBodies: asArray(input.waterBodies).map((item) => {
      const record = asRecord(item);
      const type = ["river", "lake", "reservoir", "pond", "other"].includes(String(record.type))
        ? record.type as "river" | "lake" | "reservoir" | "pond" | "other"
        : "other" as const;
      return {
        type,
        description: asString(record.description, "Visible water feature."),
        confidence: asScore(record.confidence),
      };
    }),
    vegetation: {
      classification: asString(vegetation.classification, "Vegetation not confidently classified"),
      confidence: asScore(vegetation.confidence),
    },
    thermalAnomalies: asArray(input.thermalAnomalies).map((item) => {
      const record = asRecord(item);
      const severity = ["low", "medium", "high"].includes(String(record.severity))
        ? record.severity as "low" | "medium" | "high"
        : "low" as const;
      return {
        description: asString(record.description, "Potential thermal variation."),
        severity,
        confidence: asScore(record.confidence),
      };
    }),
    detectedTags: asArray(input.detectedTags).filter((tag): tag is string => typeof tag === "string").slice(0, 20),
    limitations: asArray(input.limitations).filter((item): item is string => typeof item === "string").slice(0, 12),
  };

  return analysisSchema.parse(normalized);
}

function toLegacyShape(analysis: z.infer<typeof analysisSchema>) {
  const objects = [
    ...analysis.infrastructure.map((item) => ({
      label: item.type,
      category: item.type === "other" ? "infrastructure" : item.type,
      count: null,
      confidence: asConfidence(item.confidence),
      notes: item.description,
    })),
    ...analysis.waterBodies.map((item) => ({
      label: item.type,
      category: "water",
      count: null,
      confidence: asConfidence(item.confidence),
      notes: item.description,
    })),
    ...(analysis.vegetation.classification ? [{
      label: analysis.vegetation.classification,
      category: "vegetation",
      count: null,
      confidence: asConfidence(analysis.vegetation.confidence),
      notes: "Vegetation indicator identified by the model.",
    }] : []),
  ];

  return {
    ...analysis,
    objects,
    landCover: [{
      type: analysis.vegetation.classification,
      estimatedPercent: Math.round(analysis.vegetation.confidence * 100),
      notes: "Estimated from visual indicators; not a ground-truth measurement.",
    }],
    spectralNotes: analysis.thermalAnomalies.length > 0
      ? analysis.thermalAnomalies.map((item) => item.description).join(" ")
      : "No thermal anomaly assessment was returned for this scene.",
    recommendations: analysis.limitations[0] ?? "Use additional bands or higher-resolution imagery for confirmation.",
  };
}

function parseDataUrl(value: string): { mimeType: string; base64: string } | null {
  const match = value.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  return { mimeType: match[1], base64: match[2].replace(/\s/g, "") };
}

async function getFallbackTile(lat: number, lng: number, zoom: number) {
  const z = Math.min(Math.max(Math.round(zoom), 1), 17);
  const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, z));
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, z));
  const tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${tileY}/${tileX}`;
  const tileRes = await fetch(tileUrl);
  if (!tileRes.ok) throw new Error(`tile_fetch_${tileRes.status}`);
  const buffer = await tileRes.arrayBuffer();
  return {
    mimeType: tileRes.headers.get("content-type")?.startsWith("image/")
      ? tileRes.headers.get("content-type")!
      : "image/jpeg",
    base64: Buffer.from(buffer).toString("base64"),
    tileUrl,
    tile: { z, tileX, tileY },
  };
}

router.post("/analyze-scene", async (req, res) => {
  const parsedRequest = sceneRequestSchema.safeParse(req.body);
  if (!parsedRequest.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: parsedRequest.error.issues[0]?.message ?? "Invalid scene request",
      },
    });
    return;
  }

  if (!config.openaiApiKey) {
    res.status(503).json({
      success: false,
      error: {
        code: "AI_NOT_CONFIGURED",
        message: "AI analysis unavailable. Check OpenAI configuration.",
      },
    });
    return;
  }

  const request = parsedRequest.data;
  const center = request.center ?? (
    request.lat !== undefined && request.lng !== undefined
      ? { lat: request.lat, lng: request.lng }
      : undefined
  );
  if (!center) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_REQUEST", message: "center or lat/lng is required" },
    });
    return;
  }

  let image: { mimeType: string; base64: string; tileUrl?: string; tile?: { z: number; tileX: number; tileY: number } };
  const providedImage = request.image ?? (request.imageBase64 ? `data:${request.mimeType ?? "image/jpeg"};base64,${request.imageBase64}` : undefined);
  const parsedImage = providedImage ? parseDataUrl(providedImage) : null;

  if (providedImage && !parsedImage) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_IMAGE", message: "image must be a supported base64 data URL" },
    });
    return;
  }

  if (parsedImage && Buffer.byteLength(parsedImage.base64, "base64") > MAX_IMAGE_BYTES) {
    res.status(413).json({
      success: false,
      error: { code: "IMAGE_TOO_LARGE", message: "Scene image must be 8 MB or smaller." },
    });
    return;
  }

  try {
    image = parsedImage
      ? parsedImage
      : await getFallbackTile(center.lat, center.lng, request.zoom);
  } catch (err) {
    req.log.error({ error: safeErrorDetails(err), provider: request.mapProvider }, "Failed to prepare scene image");
    res.status(502).json({
      success: false,
      error: { code: "IMAGE_UNAVAILABLE", message: "Could not prepare the scene image." },
    });
    return;
  }

  req.log.info({
    provider: request.mapProvider,
    band: request.bandMode ?? request.band,
    composite: request.composite,
    hasViewportImage: Boolean(parsedImage),
  }, "Starting scene analysis");

  const systemPrompt = `You are a careful remote-sensing analyst. The image may be satellite or aerial imagery, and its selected band/composite affects interpretation. Visual conclusions are estimates, not ground-truth measurements. Do not invent objects that cannot reasonably be inferred. Analyze terrain, urban density, visible infrastructure, water bodies, vegetation indicators, thermal anomalies when relevant, unusual regions, confidence, detected tags, and limitations. Return only valid JSON.`;
  const userPrompt = `Analyze this scene near ${center.lat.toFixed(5)}, ${center.lng.toFixed(5)} at zoom ${Math.round(request.zoom)}.
Selected band: ${request.bandMode ?? request.band}
Composite: ${request.composite}
Map provider: ${request.mapProvider}
${request.filterDescription ? `Display processing: ${request.filterDescription}` : ""}

Return exactly this JSON shape:
{
  "summary": "string",
  "confidence": "high | medium | low",
  "terrainClassification": { "type": "string", "confidence": 0.0 },
  "urbanDensity": { "classification": "low | medium | high", "confidence": 0.0 },
  "infrastructure": [{ "type": "road | building | bridge | industrial | other", "description": "string", "confidence": 0.0 }],
  "waterBodies": [{ "type": "river | lake | reservoir | pond | other", "description": "string", "confidence": 0.0 }],
  "vegetation": { "classification": "string", "confidence": 0.0 },
  "thermalAnomalies": [{ "description": "string", "severity": "low | medium | high", "confidence": 0.0 }],
  "detectedTags": ["string"],
  "limitations": ["string"]
}
Use confidence numbers from 0 to 1. Keep arrays concise and be explicit when image quality limits confidence.`;

  try {
    const openai = new OpenAI({ apiKey: config.openaiApiKey });
    const response = await openai.chat.completions.create({
      model: config.openaiModel,
      max_tokens: 1600,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${image.mimeType};base64,${image.base64}`,
                detail: "high",
              },
            },
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    const decoded = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim());
    const analysis = normalizeAnalysis(decoded);
    req.log.info({ provider: request.mapProvider, model: config.openaiModel }, "Scene analysis completed");
    res.json({
      success: true,
      result: {
        ...toLegacyShape(analysis),
        metadata: {
          center,
          zoom: request.zoom,
          band: request.bandMode ?? request.band,
          composite: request.composite,
          mapProvider: request.mapProvider,
          viewport: request.viewport ?? null,
          analyzedAt: new Date().toISOString(),
          source: parsedImage ? "viewport" : "provider_tile_fallback",
        },
      },
    });
  } catch (err) {
    req.log.error({ error: safeErrorDetails(err), provider: request.mapProvider }, "Scene analysis failed");
    res.status(502).json({
      success: false,
      error: {
        code: "AI_ANALYSIS_FAILED",
        message: "AI analysis failed. Try again or use another scene.",
      },
    });
  }
});

router.post("/identify-objects", async (req, res) => {
  const bodySchema = z.object({
    imageBase64: z.string().min(1),
    mimeType: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/).default("image/jpeg"),
  });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "imageBase64 and a supported mimeType are required" });
    return;
  }
  if (!config.openaiApiKey) {
    res.status(503).json({ error: "AI analysis unavailable. Check OpenAI configuration." });
    return;
  }

  const userPrompt = `Analyze this satellite/aerial image carefully. Return ONLY valid JSON with:
{"sceneDescription":"string","objects":[{"label":"string","category":"water|vegetation|vehicle|building|road|terrain|infrastructure|unknown","bbox":[x,y,width,height],"confidence":"high|medium|low","notes":"string"}]}
Use normalized bounding boxes from 0 to 1. Include 6-14 prominent identifiable features when possible.`;

  try {
    const openai = new OpenAI({ apiKey: config.openaiApiKey });
    const response = await openai.chat.completions.create({
      model: config.openaiModel,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${parsed.data.mimeType};base64,${parsed.data.imageBase64}`, detail: "high" } },
          { type: "text", text: userPrompt },
        ],
      }],
    });
    const data = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    res.json(data);
  } catch (err) {
    req.log.error({ error: safeErrorDetails(err) }, "Object identification failed");
    res.status(502).json({ error: "Object identification failed" });
  }
});

export default router;