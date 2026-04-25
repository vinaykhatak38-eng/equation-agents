"use client";

import { motion } from "framer-motion";
import { ArrowRight, Atom, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { landingExampleLabels, problemForLabel } from "@/lib/examples";

const defaultProblem =
  "A projectile is launched at 20 m/s at 30 degrees above the horizontal from level ground. Find the range and maximum height.";

export function LandingSolver() {
  const router = useRouter();
  const [problem, setProblem] = useState(defaultProblem);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = problem.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/solve?problem=${encodeURIComponent(trimmed)}`);
  }

  return (
    <motion.form
      onSubmit={submit}
      className="glass-panel p-4 sm:p-5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <Atom className="h-4 w-4" />
          Problem intake
        </div>
        <Sparkles className="h-5 w-5 text-amber-200" />
      </div>
      <textarea
        value={problem}
        onChange={(event) => setProblem(event.target.value)}
        className="min-h-40 w-full resize-y rounded-[8px] border border-white/12 bg-slate-950/80 p-4 text-base leading-7 text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20"
        placeholder="Paste a physics problem..."
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {landingExampleLabels.map((label) => (
          <button
            key={label}
            type="button"
            className="ghost-button min-h-9 px-3 py-2 text-xs"
            onClick={() => setProblem(problemForLabel(label))}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-400">
          AI-generated physics solutions may contain mistakes. Always verify important academic work.
        </p>
        <button type="submit" className="primary-button">
          Start Solving
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.form>
  );
}
