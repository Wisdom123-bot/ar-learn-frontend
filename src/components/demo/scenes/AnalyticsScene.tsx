"use client";

import { motion } from 'framer-motion';

export function AnalyticsScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-slate-900 rounded-[3.5rem] p-12 shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-slate-800 relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            AI Predictive Engine
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-black text-white leading-tight"
          >
            Predicting Failure <br />Before it Happens.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-lg leading-relaxed"
          >
            Our ML model analyzes CAT scores and attendance to flag students who might drop grades this term.
          </motion.p>
        </div>

        <div className="flex-1 w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-700 space-y-8"
          >
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Confidence</div>
                 <div className="text-4xl font-black text-blue-500">89.4%</div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status: Optimized</div>
                 <div className="h-10 w-24 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs">
                   ACCURACY
                 </div>
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                  <span>Student Risk Distribution</span>
                  <span className="text-blue-400">Term 2 Projection</span>
               </div>
               <div className="flex gap-2 items-end h-32">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1 + (i * 0.1), duration: 0.8 }}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg"
                    />
                  ))}
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
