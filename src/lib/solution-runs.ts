import { randomUUID } from "node:crypto";

import { SolverResponse } from "@/lib/physics";

type PersistResult =
  | {
      status: "saved";
      runId: string;
      message: string;
    }
  | {
      status: "not_configured";
      message: string;
    }
  | {
      status: "failed";
      message: string;
    };

export async function persistSolutionRun(problem: string, solution: SolverResponse): Promise<PersistResult> {
  const supabaseUrl = getSupabaseUrl();
  const apiKey = getSupabaseApiKey();

  if (!supabaseUrl || !apiKey) {
    return {
      status: "not_configured",
      message: "Supabase saving is not configured on the server.",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  const runId = randomUUID();

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/solution_runs`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(toSolutionRunPayload(runId, problem, solution)),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        status: "failed",
        message: `Supabase save failed with status ${response.status}.`,
      };
    }

    return {
      status: "saved",
      runId,
      message: "Solution saved to Supabase.",
    };
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError" ? "Supabase save timed out." : "Supabase save failed.";
    return {
      status: "failed",
      message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function withPersistence(problem: string, solution: SolverResponse): Promise<SolverResponse> {
  const result = await persistSolutionRun(problem, solution);

  if (result.status === "saved") {
    return {
      ...solution,
      savedRunId: result.runId,
      persistenceStatus: result.status,
      persistenceMessage: result.message,
    };
  }

  return {
    ...solution,
    persistenceStatus: result.status,
    persistenceMessage: result.message,
  };
}

function getSupabaseUrl() {
  const value = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  return value?.trim().replace(/\/+$/, "");
}

function getSupabaseApiKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();
}

function toSolutionRunPayload(id: string, problem: string, solution: SolverResponse) {
  return {
    id,
    problem,
    topic: solution.topic,
    difficulty: solution.difficulty,
    known_variables: solution.knownVariables,
    unknown_variables: solution.unknownVariables,
    agents: solution.agents,
    equations: solution.equations,
    step_by_step_solution: solution.stepByStepSolution,
    final_answer: solution.finalAnswer,
    common_mistakes: solution.commonMistakes,
    visualization_plan: solution.visualizationPlan,
    image_prompt: solution.imagePrompt,
    model_used: solution.modelUsed || null,
    source: solution.source || "openai",
  };
}
