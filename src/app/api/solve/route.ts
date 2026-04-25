import OpenAI from "openai";
import { z } from "zod";
import {
  createFallbackSolution,
  ensureVisualizationData,
  solverJsonSchema,
  SolverResponse,
} from "@/lib/physics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const solveRequestSchema = z.object({
  problem: z.string().trim().min(8).max(4000),
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
  const parsed = solveRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Send a physics problem between 8 and 4000 characters." }, { status: 400 });
  }

  const client = getOpenAIClient();
  if (!client) {
    return Response.json(ensureVisualizationData(createFallbackSolution(parsed.data.problem)));
  }

  const models = getModelChain();
  const failures: string[] = [];

  for (const model of models) {
    try {
      const response = await client.responses.create({
        model,
        input: [
          {
            role: "system",
            content: solverSystemPrompt,
          },
          {
            role: "user",
            content: parsed.data.problem,
          },
        ],
        reasoning: { effort: "high" },
        text: {
          format: {
            type: "json_schema",
            name: "physics_agent_solution",
            strict: true,
            schema: solverJsonSchema,
          },
        },
      });

      const outputText = response.output_text;
      if (!outputText) {
        throw new Error("The model returned an empty structured response.");
      }

      const solution = ensureVisualizationData(JSON.parse(outputText) as SolverResponse);
      return Response.json({
        ...solution,
        modelUsed: model,
        source: "openai",
      } satisfies SolverResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown OpenAI error";
      failures.push(`${model}: ${message}`);
      if (!isModelFallbackError(message)) {
        break;
      }
    }
  }

  const fallback = ensureVisualizationData(createFallbackSolution(parsed.data.problem));
  return Response.json({
    ...fallback,
    warning: `Live AI call failed, so a demo fallback was used. ${publicFailureSummary(failures)}`,
  });
}

function getModelChain() {
  const configured = process.env.OPENAI_SOLVER_MODEL?.trim();
  return Array.from(new Set([configured || "gpt-5.5", "gpt-5.4", "gpt-5.2", "gpt-5.1", "gpt-5"].filter(Boolean)));
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
    return "The configured model was not available for this account.";
  }
  if (joined.includes("rate") || joined.includes("quota")) {
    return "The OpenAI account hit a rate or quota limit.";
  }
  return "Check the server environment and model access.";
}

const solverSystemPrompt = `
You are Quantum Agent Physics Lab, a careful physics tutoring system.

Return only structured JSON that matches the provided schema. Do not include Markdown outside the JSON.

Solve the student problem by internally coordinating these specialized agents:
- Concept Agent
- Variable Extraction Agent
- Equation Selection Agent
- Algebra Agent
- Numerical Calculation Agent
- Visualization Agent
- Final Explanation Agent

Requirements:
- Explain assumptions clearly.
- Show units and conversions.
- Check dimensional consistency.
- Teach conceptually and avoid giving only the final answer.
- Use concise, student-safe reasoning steps; do not reveal hidden chain-of-thought.
- Equations must be valid KaTeX strings where possible.
- If information is missing for a numeric result, say what is missing and still provide the symbolic path.
- visualizationPlan.data should contain useful numeric x/y points whenever possible.
- imagePrompt should describe a high-quality educational visual in a futuristic dark physics lab style.
`;
