import Link from "next/link";
import { ArrowUpRight, BrainCircuit, ChartSpline, FlaskConical, Waves } from "lucide-react";
import { LandingSolver } from "@/components/landing-solver";
import { ParticleField } from "@/components/particle-field";

const capabilityTiles = [
  {
    icon: BrainCircuit,
    title: "Agent decomposition",
    copy: "Concepts, variables, equations, algebra, numbers, visuals, and final teaching notes work as a coordinated solving team.",
  },
  {
    icon: ChartSpline,
    title: "Animated graphs",
    copy: "Trajectory curves, probability waves, force vectors, circuit placeholders, and energy bars render from structured solution data.",
  },
  {
    icon: FlaskConical,
    title: "Physics correctness checks",
    copy: "Assumptions, units, dimensional consistency, common mistakes, and step-by-step reasoning stay visible beside the answer.",
  },
];

export default function Home() {
  return (
    <main className="lab-shell">
      <ParticleField />
      <section className="section-band pb-16 pt-16 sm:pt-24 lg:pb-24">
        <div className="section-inner relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <Waves className="h-4 w-4" />
              Futuristic physics lab
            </div>
            <h1 className="max-w-5xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Solve Physics Problems with AI Agent Teams
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Quantum Agent Physics Lab turns a student problem into a structured solution with specialized agents, equations, graphs, and visual explanations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-button" href="/solve">
                Open solver
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link className="ghost-button" href="/examples">
                View examples
              </Link>
            </div>
          </div>
          <LandingSolver />
        </div>
      </section>

      <section className="section-band pb-16">
        <div className="section-inner grid gap-4 md:grid-cols-3">
          {capabilityTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <article key={tile.title} className="glass-panel p-5">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-white">{tile.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{tile.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
