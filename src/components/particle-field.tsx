"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 34 }, (_, index) => {
  const left = (index * 37) % 100;
  const top = (index * 53) % 100;
  const size = 2 + (index % 4);
  const delay = (index % 9) * 0.35;
  return { left, top, size, delay };
});

export function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="grid-field" />
      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${particle.top}-${index}`}
          className="absolute rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(103,232,249,0.75)]"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            height: particle.size,
            width: particle.size,
          }}
          animate={{
            opacity: [0.18, 0.92, 0.18],
            x: [0, (index % 2 === 0 ? 1 : -1) * (18 + index)],
            y: [0, -18 - (index % 5) * 8, 0],
          }}
          transition={{
            delay: particle.delay,
            duration: 5 + (index % 6),
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 46, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
}
