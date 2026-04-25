import OpenAI from "openai";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const visualRequestSchema = z.object({
  imagePrompt: z.string().trim().min(8).max(2400),
  topic: z.string().trim().min(2).max(120),
});

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export async function POST(request: Request) {
  const parsed = visualRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Send an image prompt and topic." }, { status: 400 });
  }

  const client = getOpenAIClient();
  if (!client) {
    return Response.json({
      image: createSvgDataUrl(parsed.data.topic),
      source: "demo",
      warning: "OPENAI_API_KEY is not configured, so a local SVG visual was generated.",
    });
  }

  const preferred = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1.5";
  const models = Array.from(new Set([preferred, "gpt-image-1"].filter(Boolean)));
  const failures: string[] = [];

  for (const model of models) {
    try {
      const result = await client.images.generate({
        model,
        prompt: parsed.data.imagePrompt,
        size: "1024x1024",
        quality: "medium",
        output_format: "png",
        n: 1,
      });

      const generated = result.data?.[0];
      if (generated?.b64_json) {
        return Response.json({
          image: `data:image/png;base64,${generated.b64_json}`,
          modelUsed: model,
          source: "openai",
        });
      }
      if (generated?.url) {
        return Response.json({
          image: generated.url,
          modelUsed: model,
          source: "openai",
        });
      }
      throw new Error("Image API returned no image payload.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown image error";
      failures.push(`${model}: ${message}`);
      if (!isModelFallbackError(message)) {
        break;
      }
    }
  }

  return Response.json({
    image: createSvgDataUrl(parsed.data.topic),
    source: "demo",
    warning: `Image model failed, so a local SVG visual was generated. ${publicFailureSummary(failures)}`,
  });
}

function isModelFallbackError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("model") &&
    (normalized.includes("not found") ||
      normalized.includes("does not exist") ||
      normalized.includes("unsupported") ||
      normalized.includes("invalid"))
  );
}

function publicFailureSummary(failures: string[]) {
  const joined = failures.join(" ").toLowerCase();
  if (joined.includes("401") || joined.includes("api key")) {
    return "OPENAI_API_KEY was rejected or is still a placeholder.";
  }
  if (joined.includes("model")) {
    return "The configured image model was not available for this account.";
  }
  if (joined.includes("rate") || joined.includes("quota")) {
    return "The OpenAI account hit a rate or quota limit.";
  }
  return "Check the server environment and image model access.";
}

function createSvgDataUrl(topic: string) {
  const safeTopic = escapeHtml(topic);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#020617"/>
      <stop offset="0.55" stop-color="#082f49"/>
      <stop offset="1" stop-color="#1e1b4b"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <path d="M80 780 C 250 360, 400 260, 560 430 S 785 590, 944 210" fill="none" stroke="#67e8f9" stroke-width="12" filter="url(#glow)"/>
  <g stroke="#34d399" stroke-width="4" opacity="0.55">
    <path d="M128 128 H896 M128 256 H896 M128 384 H896 M128 512 H896 M128 640 H896 M128 768 H896"/>
    <path d="M128 128 V896 M256 128 V896 M384 128 V896 M512 128 V896 M640 128 V896 M768 128 V896 M896 128 V896"/>
  </g>
  <circle cx="220" cy="650" r="42" fill="#fbbf24" filter="url(#glow)"/>
  <path d="M220 650 L360 540" stroke="#fbbf24" stroke-width="10" marker-end="url(#arrow)"/>
  <text x="80" y="104" fill="#e0f2fe" font-family="Arial, sans-serif" font-size="42" font-weight="700">Quantum Agent Physics Lab</text>
  <text x="80" y="168" fill="#a7f3d0" font-family="Arial, sans-serif" font-size="30">${safeTopic}</text>
  <text x="80" y="914" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28">Generated fallback educational visual</text>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
