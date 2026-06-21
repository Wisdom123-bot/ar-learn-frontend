"use client";

import { motion } from 'framer-motion';

export function CashFlowScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-emerald-950 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(16,185,129,0.1)] border border-emerald-900/50 relative overflow-hidden text-white">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Financial Health
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight"
          >
            Real-Time <br />Cash Flow.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-emerald-200/60 text-sm md:text-lg leading-relaxed"
          >
            Instant visibility into collected fees vs projected revenue. Help school boards make data-driven financial decisions.
          </motion.p>
        </div>

        <div className="flex-1 w-full space-y-6">
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Target", val: "M 42.5", color: "text-white" },
                { label: "Collected", val: "M 34.2", color: "text-emerald-400" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/30"
                >
                   <div className="text-[8px] font-black uppercase text-emerald-500 tracking-widest mb-1">{stat.label}</div>
                   <div className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.val}</div>
                </motion.div>
              ))}
           </div>

           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500/60">
                 <span>Revenue Progress</span>
                 <span>80.4%</span>
              </div>
              <div className="h-4 w-full bg-emerald-900/50 rounded-full overflow-hidden border border-emerald-800/30">
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: "80.4%" }}
                   transition={{ duration: 1.5, delay: 1 }}
                   className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                 />
              </div>
           </div>

           <div className="flex gap-1 h-20 items-end">
              {[30, 45, 35, 60, 50, 75, 90].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.2 + (i * 0.1), duration: 0.8 }}
                  className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md"
                />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
