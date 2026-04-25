"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Atom,
  Brain,
  Calculator,
  Image as ImageIcon,
  Loader2,
  Sigma,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AgentWorkflow } from "@/components/agent-workflow";
import { EquationReveal } from "@/components/equation-reveal";
import { PhysicsVisualizations } from "@/components/physics-visualizations";
import { exampleProblems } from "@/lib/examples";
import { SolverResponse } from "@/lib/physics";

type SolveWorkbenchProps = {
  initialProblem?: string;
};

export function SolveWorkbench({ initialProblem = "" }: SolveWorkbenchProps) {
  const [problem, setProblem] = useState(initialProblem);
  const [submittedProblem, setSubmittedProblem] = useState(initialProblem);
  const [solution, setSolution] = useState<SolverResponse | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);
  const [error, setError] = useState("");
  const [visualUrl, setVisualUrl] = useState("");
  const [visualStatus, setVisualStatus] = useState("");
  const initialRun = useRef(false);

  useEffect(() => {
    if (initialProblem.trim() && !initialRun.current) {
      initialRun.current = true;
      void solve(initialProblem);
    }
  }, [initialProblem]);

  useEffect(() => {
    if (!isSolving) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveAgent((current) => Math.min(current + 1, 6));
    }, 780);
    return () => window.clearInterval(timer);
  }, [isSolving]);

  async function solve(nextProblem: string) {
    const trimmed = nextProblem.trim();
    if (!trimmed) {
      return;
    }

    setError("");
    setVisualUrl("");
    setVisualStatus("");
    setSolution(null);
    setSubmittedProblem(trimmed);
    setIsSolving(true);
    setActiveAgent(0);

    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: trimmed }),
      });
      const payload = (await response.json()) as SolverResponse | { error?: string };
      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : "Solver request failed.");
      }
      setSolution(payload as SolverResponse);
      setActiveAgent(7);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Solver request failed.");
    } finally {
      setIsSolving(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await solve(problem);
  }

  async function generateVisual() {
    if (!solution) {
      return;
    }
    setVisualStatus("Generating educational image...");
    try {
      const response = await fetch("/api/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagePrompt: solution.imagePrompt,
          topic: solution.topic,
        }),
      });
      const payload = (await response.json()) as { image?: string; warning?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Image generation failed.");
      }
      setVisualUrl(payload.image || "");
      setVisualStatus(payload.warning || "Visual generated.");
    } catch (caught) {
      setVisualStatus(caught instanceof Error ? caught.message : "Image generation failed.");
    }
  }

  return (
    <div className="section-inner relative grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
      <aside className="glass-panel h-fit p-5 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <Atom className="h-4 w-4" />
          Solver console
        </div>
        <form onSubmit={submit}>
          <textarea
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            className="min-h-56 w-full resize-y rounded-[8px] border border-white/12 bg-slate-950/80 p-4 text-sm leading-6 text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20"
            placeholder="Paste a physics problem..."
          />
          <button type="submit" disabled={isSolving} className="primary-button mt-4 w-full">
            {isSolving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {isSolving ? "Solving" : "Start Solving"}
            {!isSolving ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>
        <div className="mt-5 grid gap-2">
          {exampleProblems.map((example) => (
            <button
              key={example.slug}
              type="button"
              className="ghost-button justify-start text-left text-xs"
              onClick={() => setProblem(example.problem)}
            >
              {example.badge}
            </button>
          ))}
        </div>
        <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">
          AI-generated physics solutions may contain mistakes. Always verify important academic work.
        </p>
      </aside>

      <section className="space-y-6">
        <motion.div
          className="glass-panel p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Original problem
              </p>
              <h1 className="mt-3 text-3xl font-black text-white">Agent workflow lab</h1>
            </div>
            {solution ? (
              <span className="inline-flex rounded-[8px] border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100">
                {solution.topic} - {solution.difficulty}
              </span>
            ) : null}
          </div>
          <p className="mt-5 text-base leading-7 text-slate-300">
            {submittedProblem || "Submit a physics problem to begin."}
          </p>
          {error ? (
            <div className="mt-4 flex gap-3 rounded-[8px] border border-amber-300/30 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          ) : null}
          {solution?.warning ? (
            <div className="mt-4 flex gap-3 rounded-[8px] border border-cyan-300/25 bg-cyan-300/10 p-3 text-sm leading-6 text-cyan-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {solution.warning}
            </div>
          ) : null}
        </motion.div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
            <Brain className="h-4 w-4" />
            Agent team
          </div>
          <AgentWorkflow agents={solution?.agents ?? []} activeIndex={activeAgent} isSolving={isSolving} />
        </div>

        {solution ? (
          <>
            <ResultSummary solution={solution} />
            <PhysicsVisualizations solution={solution} />
            <section className="glass-panel p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    Generated educational image
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{solution.imagePrompt}</p>
                </div>
                <button type="button" onClick={generateVisual} className="ghost-button">
                  <ImageIcon className="h-4 w-4" />
                  Generate visual
                </button>
              </div>
              {visualUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={visualUrl}
                  alt={`Generated visual for ${solution.topic}`}
                  className="mt-4 aspect-video w-full rounded-[8px] border border-white/10 object-cover"
                />
              ) : null}
              {visualStatus ? <p className="mt-3 text-sm text-slate-400">{visualStatus}</p> : null}
            </section>
            <EinsteinMascot />
          </>
        ) : null}
      </section>
    </div>
  );
}

function ResultSummary({ solution }: { solution: SolverResponse }) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <VariablePanel title="Known variables" variables={solution.knownVariables} />
        <VariablePanel title="Unknown targets" variables={solution.unknownVariables} />
      </div>

      <div className="glass-panel p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <Sigma className="h-4 w-4" />
          Required equations
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {solution.equations.map((equation, index) => (
            <div key={`${equation.name}-${index}`}>
              <EquationReveal expression={equation.expression} label={equation.name} index={index} />
              <p className="mt-2 text-sm leading-6 text-slate-400">{equation.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <Calculator className="h-4 w-4" />
          Step-by-step solution
        </div>
        <div className="space-y-3">
          {solution.stepByStepSolution.map((step, index) => (
            <article key={`${step.title}-${index}`} className="thin-panel p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-cyan-300/15 font-mono text-sm font-bold text-cyan-100">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{step.explanation}</p>
                  {step.equation ? (
                    <div className="mt-3">
                      <EquationReveal expression={step.equation} />
                    </div>
                  ) : null}
                  {step.result ? <p className="mt-3 text-sm font-semibold text-emerald-200">{step.result}</p> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Final answer</p>
          <p className="mt-3 text-2xl font-black leading-snug text-white">{solution.finalAnswer}</p>
          <p className="mt-4 text-sm leading-6 text-slate-400">{solution.dimensionalCheck}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Common mistakes</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {solution.commonMistakes.map((mistake) => (
              <li key={mistake} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function VariablePanel({
  title,
  variables,
}: {
  title: string;
  variables: SolverResponse["knownVariables"];
}) {
  return (
    <div className="glass-panel p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{title}</p>
      <div className="space-y-3">
        {variables.map((variable, index) => (
          <div key={`${variable.symbol}-${index}`} className="thin-panel p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-sm font-bold text-cyan-100">{variable.symbol}</span>
              <span className="rounded-[8px] bg-slate-950/80 px-2 py-1 font-mono text-xs text-slate-300">
                {variable.value} {variable.unit}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{variable.name}</p>
            {variable.notes ? <p className="mt-1 text-xs leading-5 text-slate-500">{variable.notes}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function EinsteinMascot() {
  return (
    <section className="glass-panel overflow-hidden p-5">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-center">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full" aria-label="Cartoon mentor face saying great">
            <defs>
              <filter id="mentorGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="80" cy="82" r="54" fill="#f8dcc2" stroke="#67e8f9" strokeWidth="3" filter="url(#mentorGlow)" />
            <path
              d="M30 68 C8 46, 34 24, 48 42 C48 16, 82 12, 76 39 C95 14, 128 25, 108 48 C136 42, 143 73, 116 74"
              fill="#f8fafc"
              stroke="#dbeafe"
              strokeWidth="3"
            />
            <path d="M42 82 Q54 74 66 82" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <path d="M94 82 Q106 74 118 82" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="58" cy="88" r="4" fill="#0f172a" />
            <circle cx="102" cy="88" r="4" fill="#0f172a" />
            <path d="M76 90 Q68 108 84 108" fill="none" stroke="#c08457" strokeWidth="3" strokeLinecap="round" />
            <path d="M56 118 C68 108, 77 116, 80 121 C84 116, 94 108, 106 118" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            <path d="M58 128 Q80 139 102 128" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <path d="M39 104 Q28 110 33 122" fill="none" stroke="#f8dcc2" strokeWidth="8" strokeLinecap="round" />
            <path d="M121 104 Q132 110 127 122" fill="none" stroke="#f8dcc2" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="relative max-w-sm rounded-[8px] border border-cyan-300/30 bg-slate-950/80 p-4 text-center shadow-[0_0_34px_rgba(103,232,249,0.18)] sm:text-left">
          <div className="absolute -left-3 bottom-8 hidden h-6 w-6 rotate-45 border-b border-l border-cyan-300/30 bg-slate-950/80 sm:block" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Cartoon lab mentor</p>
          <p className="mt-2 text-3xl font-black text-white">Great!</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            The solution is complete. Check the units once more, then take the win.
          </p>
        </div>
      </div>
    </section>
  );
}
