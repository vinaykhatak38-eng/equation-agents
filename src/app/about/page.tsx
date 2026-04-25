import { Atom, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { ParticleField } from "@/components/particle-field";

const rows = [
  {
    icon: BrainCircuit,
    title: "Agent-centered learning",
    text: "Each solution is decomposed into concept selection, variable extraction, equation choice, algebra, numerical work, visualization, and final explanation.",
  },
  {
    icon: Sparkles,
    title: "Visual-first physics",
    text: "The interface renders equations, graphs, vector fields, energy bars, circuit sketches, and quantum wave views from structured solution data.",
  },
  {
    icon: ShieldCheck,
    title: "Verification habits",
    text: "The solver emphasizes assumptions, units, dimensional checks, and common mistakes so students can audit the work instead of memorizing answers.",
  },
];

export default function AboutPage() {
  return (
    <main className="lab-shell">
      <ParticleField />
      <section className="section-band py-14">
        <div className="section-inner relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <Atom className="h-4 w-4" />
              About the lab
            </div>
            <h1 className="text-4xl font-black text-white sm:text-5xl">A physics tutor built as a team of agents</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Quantum Agent Physics Lab is a full-stack learning interface for students who want the reasoning path, the equations, and the visualization in one place.
            </p>
          </div>
          <div className="grid gap-4">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <article key={row.title} className="glass-panel p-5">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{row.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{row.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="rounded-[8px] border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              AI-generated physics solutions may contain mistakes. Always verify important academic work.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
