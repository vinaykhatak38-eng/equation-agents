"use client";

import { motion } from "framer-motion";
import katex from "katex";
import { useMemo } from "react";

type EquationRevealProps = {
  expression: string;
  label?: string;
  index?: number;
};

export function EquationReveal({ expression, label, index = 0 }: EquationRevealProps) {
  const html = useMemo(() => {
    return katex.renderToString(expression || "\\text{No equation supplied}", {
      displayMode: true,
      throwOnError: false,
      strict: false,
    });
  }, [expression]);

  return (
    <motion.div
      className="thin-panel scanline relative overflow-hidden p-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay: index * 0.06, duration: 0.36 }}
    >
      {label ? (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          {label}
        </div>
      ) : null}
      <div className="text-cyan-50" dangerouslySetInnerHTML={{ __html: html }} />
    </motion.div>
  );
}
