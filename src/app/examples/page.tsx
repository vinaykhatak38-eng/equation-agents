import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { ParticleField } from "@/components/particle-field";
import { exampleProblems } from "@/lib/examples";

export default function ExamplesPage() {
  return (
    <main className="lab-shell">
      <ParticleField />
      <section className="section-band py-14">
        <div className="section-inner relative">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <BookOpen className="h-4 w-4" />
              Built-in examples
            </div>
            <h1 className="text-4xl font-black text-white sm:text-5xl">Physics launch deck</h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Start with common mechanics, circuits, photons, oscillations, and matter-wave prompts.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {exampleProblems.map((example) => (
              <article key={example.slug} className="glass-panel p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-[8px] border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    {example.badge}
                  </span>
                  <span className="text-xs text-slate-500">{example.topic}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{example.title}</h2>
                <p className="mt-3 min-h-28 text-sm leading-6 text-slate-400">{example.problem}</p>
                <Link
                  className="ghost-button mt-5 w-full"
                  href={`/solve?problem=${encodeURIComponent(example.problem)}`}
                >
                  Solve example
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
