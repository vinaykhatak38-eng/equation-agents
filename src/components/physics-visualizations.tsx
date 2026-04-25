"use client";

import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BatteryCharging, CircuitBoard, MoveRight, Waves } from "lucide-react";
import { SolverResponse, VisualizationPoint } from "@/lib/physics";

type PhysicsVisualizationsProps = {
  solution: SolverResponse;
};

export function PhysicsVisualizations({ solution }: PhysicsVisualizationsProps) {
  const data = withFallbackData(solution.visualizationPlan.data);
  const topic = solution.topic.toLowerCase();

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="glass-panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Interactive graph
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">{solution.visualizationPlan.graphType}</h3>
          </div>
          <Activity className="h-5 w-5 text-emerald-200" />
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 6, right: 18, top: 12, bottom: 12 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="4 4" />
              <XAxis
                dataKey="x"
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
                label={{
                  value: solution.visualizationPlan.xAxis,
                  fill: "#94a3b8",
                  fontSize: 12,
                  position: "insideBottom",
                  offset: -6,
                }}
              />
              <YAxis
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
                label={{
                  value: solution.visualizationPlan.yAxis,
                  fill: "#94a3b8",
                  fontSize: 12,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.92)",
                  border: "1px solid rgba(103, 232, 249, 0.3)",
                  borderRadius: 8,
                  color: "#e0f2fe",
                }}
                labelStyle={{ color: "#67e8f9" }}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#67e8f9"
                strokeWidth={3}
                dot={{ fill: "#34d399", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 7, fill: "#fbbf24" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {solution.visualizationPlan.notes ? (
          <p className="mt-4 text-sm leading-6 text-slate-400">{solution.visualizationPlan.notes}</p>
        ) : null}
      </section>

      <section className="grid gap-4">
        <VectorPanel topic={solution.topic} />
        {topic.includes("quantum") || topic.includes("photon") || topic.includes("wave") ? (
          <QuantumWave />
        ) : topic.includes("circuit") || topic.includes("resistance") ? (
          <CircuitPanel />
        ) : (
          <EnergyBars />
        )}
      </section>
    </div>
  );
}

function VectorPanel({ topic }: { topic: string }) {
  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Vector field</p>
        <MoveRight className="h-5 w-5 text-cyan-100" />
      </div>
      <div className="relative h-40 overflow-hidden rounded-[8px] border border-white/10 bg-slate-950/70">
        <motion.div
          className="absolute left-7 top-1/2 h-3 w-28 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.8)]"
          animate={{ x: [0, 42, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-[8.3rem] top-[4.35rem] h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-cyan-300" />
        <div className="absolute bottom-7 left-12 h-20 w-2 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.65)]" />
        <div className="absolute bottom-6 left-[2.15rem] h-0 w-0 border-x-[13px] border-t-[20px] border-x-transparent border-t-amber-300" />
        <div className="absolute bottom-4 right-4 text-right text-xs uppercase tracking-[0.18em] text-slate-400">
          {topic}
        </div>
      </div>
    </div>
  );
}

function QuantumWave() {
  const points = Array.from({ length: 120 }, (_, index) => {
    const x = index / 119;
    const y = 0.5 + Math.sin(index * 0.32) * 0.28 * Math.exp(-Math.pow(index - 60, 2) / 2600);
    return `${x * 100},${y * 100}`;
  }).join(" ");

  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Probability wave</p>
        <Waves className="h-5 w-5 text-violet-100" />
      </div>
      <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible rounded-[8px] border border-white/10 bg-slate-950/70">
        <polyline points={points} fill="none" stroke="#a78bfa" strokeWidth="1.8" />
        <polyline points={points} fill="none" stroke="#67e8f9" strokeWidth="0.55" opacity="0.75" transform="translate(0 4)" />
      </svg>
    </div>
  );
}

function CircuitPanel() {
  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Circuit diagram</p>
        <CircuitBoard className="h-5 w-5 text-emerald-100" />
      </div>
      <svg viewBox="0 0 320 160" className="h-40 w-full rounded-[8px] border border-white/10 bg-slate-950/70">
        <path d="M50 80 H105 M215 80 H270 M50 80 V35 H270 V80 M50 80 V125 H270 V80" stroke="#67e8f9" strokeWidth="4" fill="none" />
        <path d="M112 35 l8 -12 l14 24 l14 -24 l14 24 l14 -24 l14 24 l8 -12" stroke="#fbbf24" strokeWidth="4" fill="none" />
        <path d="M112 125 l8 -12 l14 24 l14 -24 l14 24 l14 -24 l14 24 l8 -12" stroke="#34d399" strokeWidth="4" fill="none" />
        <circle cx="50" cy="80" r="6" fill="#67e8f9" />
        <circle cx="270" cy="80" r="6" fill="#67e8f9" />
      </svg>
    </div>
  );
}

function EnergyBars() {
  const bars = [
    { label: "K", value: 72, color: "bg-cyan-300" },
    { label: "U", value: 42, color: "bg-violet-300" },
    { label: "E", value: 92, color: "bg-emerald-300" },
  ];

  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Energy bars</p>
        <BatteryCharging className="h-5 w-5 text-amber-100" />
      </div>
      <div className="flex h-40 items-end gap-4 rounded-[8px] border border-white/10 bg-slate-950/70 p-5">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              className={`w-full rounded-t-[8px] ${bar.color} shadow-[0_0_24px_rgba(103,232,249,0.35)]`}
              initial={{ height: 8 }}
              animate={{ height: bar.value }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <span className="font-mono text-sm text-slate-300">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function withFallbackData(data: VisualizationPoint[]) {
  if (data.length > 0) {
    return data;
  }

  return [
    { x: 0, y: 0.1, label: "start" },
    { x: 1, y: 0.5, label: "model" },
    { x: 2, y: 0.82, label: "solve" },
    { x: 3, y: 1, label: "answer" },
  ];
}
