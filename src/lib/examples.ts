export type ExampleProblem = {
  slug: string;
  topic: string;
  title: string;
  problem: string;
  badge: string;
};

export const exampleProblems: ExampleProblem[] = [
  {
    slug: "projectile-motion",
    topic: "Mechanics",
    title: "Projectile range and peak",
    badge: "Projectile motion",
    problem: "A projectile is launched at 20 m/s at 30 degrees above the horizontal from level ground. Find the range and maximum height.",
  },
  {
    slug: "parallel-resistance",
    topic: "Electricity",
    title: "Parallel resistor network",
    badge: "Circuits",
    problem: "Find the equivalent resistance of 10 ohm and 20 ohm resistors connected in parallel.",
  },
  {
    slug: "photon-energy",
    topic: "Modern physics",
    title: "Photon energy from wavelength",
    badge: "Quantum states",
    problem: "Calculate the energy of a photon with wavelength 500 nm. Give the answer in joules and electron volts.",
  },
  {
    slug: "simple-harmonic-motion",
    topic: "Oscillations",
    title: "Mass-spring oscillator",
    badge: "Waves",
    problem: "Solve a simple harmonic motion mass-spring system with mass m and spring constant k. Find angular frequency, period, and displacement model.",
  },
  {
    slug: "de-broglie-electron",
    topic: "Quantum mechanics",
    title: "Electron de Broglie wavelength",
    badge: "Quantum states",
    problem: "Find the de Broglie wavelength of an electron. Explain what additional information is needed for a numeric answer.",
  },
];

export const landingExampleLabels = [
  "Projectile motion",
  "Quantum states",
  "Circuits",
  "Waves",
  "Thermodynamics",
  "Relativity",
] as const;

export function problemForLabel(label: string): string {
  const normalized = label.toLowerCase();
  const match = exampleProblems.find((example) => example.badge.toLowerCase() === normalized);
  if (match) {
    return match.problem;
  }

  if (normalized.includes("thermo")) {
    return "An ideal gas expands from 2.0 L to 5.0 L at a constant pressure of 120 kPa. Find the work done by the gas and explain the sign convention.";
  }

  if (normalized.includes("relativity")) {
    return "A spacecraft moves at 0.80c relative to Earth. If 10 seconds pass on the spacecraft clock, how much time passes on Earth according to special relativity?";
  }

  return exampleProblems[0].problem;
}
