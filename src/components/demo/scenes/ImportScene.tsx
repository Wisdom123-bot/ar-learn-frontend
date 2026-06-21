"use client";

import { motion } from 'framer-motion';

export function ImportScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-slate-800 relative overflow-hidden text-white">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/10 text-slate-300 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Data Migration
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight"
          >
            Import Data <br />Instantly.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-lg leading-relaxed"
          >
            Moving from Excel? Our intelligent mapper recognizes your columns and imports thousands of records in seconds.
          </motion.p>
        </div>

        <div className="flex-1 w-full">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative bg-slate-800/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-700 overflow-hidden"
          >
             <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-dashed border-slate-600">
                   <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                         <polyline points="14 2 14 8 20 8" />
                         <line x1="12" y1="18" x2="12" y2="12" />
                         <polyline points="9 15 12 12 15 15" />
                      </svg>
                   </div>
                   <div>
                      <div className="text-sm font-bold">students_2024.xlsx</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Ready to process</div>
                   </div>
                </div>

                <div className="space-y-3">
                   {[
                     { col: "Name", status: "Mapped" },
                     { col: "Admission No", status: "Mapped" },
                     { col: "Guardian", status: "Auto-detected" }
                   ].map((item, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.8 + (i * 0.1) }}
                       className="flex justify-between items-center p-3 bg-slate-900/30 rounded-xl"
                     >
                       <span className="text-xs font-bold">{item.col}</span>
                       <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{item.status}</span>
                     </motion.div>
                   ))}
                </div>
             </div>

             {/* Scanning Animation */}
             <motion.div
               animate={{ top: ['0%', '100%', '0%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-px bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 pointer-events-none"
             />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
