"use client";

import { motion } from 'framer-motion';

export function ReportBuilderScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.1)] border border-slate-200 relative overflow-hidden text-slate-900">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-600 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Report Designer
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight tracking-tighter"
          >
            Your Brand. <br />Your Reports.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm md:text-lg leading-relaxed"
          >
            Customize report card layouts with your school logo, colors, and specific grading structures.
          </motion.p>
        </div>

        <div className="flex-1 w-full relative">
           <motion.div
             initial={{ rotate: 5, y: 50, opacity: 0 }}
             animate={{ rotate: 0, y: 0, opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 space-y-4"
           >
              <div className="flex justify-between items-center border-b pb-4">
                 <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg" />
                    <div className="font-black text-xs uppercase tracking-tighter">School Logo</div>
                 </div>
                 <div className="text-[10px] font-bold text-slate-400">TERM 3 REPORT</div>
              </div>

              <div className="space-y-2">
                 {[75, 90, 60].map((w, i) => (
                    <div key={i} className="h-4 bg-slate-50 rounded flex items-center px-2">
                       <div style={{ width: `${w}%` }} className="h-1 bg-blue-600/20 rounded" />
                    </div>
                 ))}
              </div>

              <div className="pt-4 flex gap-2">
                 <div className="flex-1 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest">Print All</div>
                 <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                       <path d="M12 5v14M5 12h14" />
                    </svg>
                 </div>
              </div>
           </motion.div>

           {/* Color Picker Floating UI */}
           <motion.div
             initial={{ x: 50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 1 }}
             className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex gap-2"
           >
              {['#2563EB', '#10B981', '#F59E0B', '#EF4444'].map(c => (
                 <div key={c} className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
              ))}
           </motion.div>
        </div>
      </div>
    </div>
  );
}
