import { ParticleField } from "@/components/particle-field";
import { SolveWorkbench } from "@/components/solve-workbench";

type SolvePageProps = {
  searchParams: Promise<{ problem?: string }>;
};

export default async function SolvePage({ searchParams }: SolvePageProps) {
  const params = await searchParams;
  const initialProblem = params.problem ?? "";

  return (
    <main className="lab-shell">
      <ParticleField />
      <section className="section-band py-10 sm:py-14">
        <SolveWorkbench initialProblem={initialProblem} />
      </section>
    </main>
  );
}
