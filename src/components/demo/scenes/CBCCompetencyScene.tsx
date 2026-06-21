"use client";

import { motion } from 'framer-motion';

export function CBCCompetencyScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-indigo-950 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(99,102,241,0.1)] border border-indigo-900/50 relative overflow-hidden text-white">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Holistic Growth
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight"
          >
            Beyond Grades. <br />CBC Mapping.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-indigo-200/60 text-sm md:text-lg leading-relaxed"
          >
            Track core competencies and behavioral growth. Build a visual map of every child's unique talents and skills.
          </motion.p>
        </div>

        <div className="flex-1 w-full flex items-center justify-center relative h-64 md:h-80">
           {/* Simple Spider/Radar Web Mockup */}
           <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="0.5" />
           </svg>

           <motion.svg
             viewBox="0 0 100 100"
             className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
           >
              <motion.path
                initial={{ pathLength: 0, fill: "rgba(99,102,241,0)" }}
                animate={{ pathLength: 1, fill: "rgba(99,102,241,0.3)" }}
                transition={{ duration: 2, delay: 0.6 }}
                d="M50 20 L80 40 L70 80 L30 80 L20 40 Z"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Nodes */}
              {[
                { x: 50, y: 20, label: "Creative" },
                { x: 80, y: 40, label: "Critical Thinking" },
                { x: 70, y: 80, label: "Self-Efficacy" },
                { x: 30, y: 80, label: "Digital" },
                { x: 20, y: 40, label: "Social" }
              ].map((node, i) => (
                <motion.circle
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + (i * 0.2) }}
                  cx={node.x} cy={node.y} r="2.5"
                  fill="#fff"
                />
              ))}
           </motion.svg>
        </div>
      </div>
    </div>
  );
}
