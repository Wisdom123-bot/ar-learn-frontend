"use client";

import { motion } from 'framer-motion';

export function StaffingScene({ scene }: any) {
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
            Staffing Optimization
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight"
          >
            Optimize Your <br />Staff.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-lg leading-relaxed"
          >
            Intelligent workload distribution ensures every class is covered without burning out your educators.
          </motion.p>
        </div>

        <div className="flex-1 w-full space-y-4">
           {[
             { name: 'Dr. Sarah', load: '18/22 Periods', color: 'bg-emerald-500', width: '81%' },
             { name: 'Mr. Mutua', load: '21/22 Periods', color: 'bg-rose-500', width: '95%' },
             { name: 'Mrs. Odhiambo', load: '15/22 Periods', color: 'bg-blue-500', width: '68%' }
           ].map((staff, i) => (
             <motion.div
               key={i}
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.6 + (i * 0.1) }}
               className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-3"
             >
               <div className="flex justify-between items-center">
                 <span className="text-xs md:text-sm font-bold">{staff.name}</span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{staff.load}</span>
               </div>
               <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: staff.width }}
                    transition={{ duration: 1, delay: 1 }}
                    className={`h-full ${staff.color}`}
                  />
               </div>
             </motion.div>
           ))}

           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 1.5 }}
             className="text-center text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] pt-4"
           >
             Automatic Conflict Resolution Active
           </motion.div>
        </div>
      </div>
    </div>
  );
}
