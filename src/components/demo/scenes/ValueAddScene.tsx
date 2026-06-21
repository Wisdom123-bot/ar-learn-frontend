"use client";

import { motion } from 'framer-motion';

export function ValueAddScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-blue-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-blue-800 relative overflow-hidden text-white">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-blue-200 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Impact Metrics
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight"
          >
            Teacher <br />Value-Add.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-100/60 text-sm md:text-lg leading-relaxed"
          >
            Measure what matters. Identify teaching impact by comparing student entry behavior with actual academic growth.
          </motion.p>
        </div>

        <div className="flex-1 w-full space-y-8 relative">
           <div className="flex justify-between items-end h-40 gap-4">
              {[
                { label: "Entry", h: 40, color: "bg-blue-400/30" },
                { label: "Growth", h: 85, color: "bg-blue-400" },
                { label: "Entry", h: 50, color: "bg-indigo-400/30" },
                { label: "Growth", h: 70, color: "bg-indigo-400" }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                   <motion.div
                     initial={{ height: 0 }}
                     animate={{ height: `${bar.h}%` }}
                     transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                     className={`w-full rounded-t-lg ${bar.color}`}
                   />
                   <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">{bar.label}</span>
                </div>
              ))}
           </div>

           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.5 }}
             className="absolute top-0 right-0 bg-white text-blue-900 p-3 rounded-xl shadow-xl flex items-center gap-2"
           >
              <div className="text-xl font-black">+14.2%</div>
              <div className="text-[8px] font-black uppercase leading-tight">Average <br />Value-Add</div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
