"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { AgentContribution, agentRoster } from "@/lib/physics";

type Status = "Thinking" | "Solving" | "Complete";

type AgentWorkflowProps = {
  agents: AgentContribution[];
  activeIndex: number;
  isSolving: boolean;
};

export function AgentWorkflow({ agents, activeIndex, isSolving }: AgentWorkflowProps) {
  const displayAgents =
    agents.length > 0
      ? agents
      : agentRoster.map((name, index) => ({
          name,
          task: placeholderTasks[index],
          result: "Waiting for the solver to assign this contribution.",
        }));

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {displayAgents.map((agent, index) => {
        const status = getStatus(index, activeIndex, isSolving, agents.length > 0);
        return (
          <motion.article
            key={agent.name}
            className="thin-panel p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{agent.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{agent.task}</p>
              </div>
              <StatusPill status={status} />
            </div>
            <p className="mt-4 min-h-20 text-sm leading-6 text-slate-300">{agent.result}</p>
          </motion.article>
        );
      })}
    </div>
  );
}

function getStatus(index: number, activeIndex: number, isSolving: boolean, hasResult: boolean): Status {
  if (hasResult) {
    return "Complete";
  }
  if (!isSolving) {
    return "Thinking";
  }
  if (index < activeIndex) {
    return "Complete";
  }
  if (index === activeIndex) {
    return "Solving";
  }
  return "Thinking";
}

function StatusPill({ status }: { status: Status }) {
  const icon =
    status === "Complete" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : status === "Solving" ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : (
      <CircleDashed className="h-3.5 w-3.5" />
    );

  const classes =
    status === "Complete"
      ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200"
      : status === "Solving"
        ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-100"
        : "border-slate-500/30 bg-slate-500/10 text-slate-300";

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border px-2 py-1 text-xs font-semibold ${classes}`}>
      {icon}
      {status}
    </span>
  );
}

const placeholderTasks = [
  "Concept model",
  "Knowns and unknowns",
  "Equation shortlist",
  "Symbolic rearrangement",
  "Numerical calculation",
  "Graph and diagram plan",
  "Teaching explanation",
];
