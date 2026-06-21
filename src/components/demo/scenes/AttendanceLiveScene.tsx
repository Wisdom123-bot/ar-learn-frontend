"use client";

import { motion } from 'framer-motion';

export function AttendanceLiveScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(37,99,235,0.1)] border border-slate-800 relative overflow-hidden text-white">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Live Classroom
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight"
          >
            One-Tap <br />Attendance.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-lg leading-relaxed"
          >
            Mark presence in seconds. Parents receive instant SMS alerts the moment a child is marked absent.
          </motion.p>
        </div>

        <div className="flex-1 w-full space-y-4">
           {[
             { name: 'Alice W.', status: 'Present', color: 'bg-emerald-500' },
             { name: 'Bob M.', status: 'Absent', color: 'bg-rose-500', alert: true },
             { name: 'Charlie K.', status: 'Late', color: 'bg-amber-500' }
           ].map((student, i) => (
             <motion.div
               key={i}
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.6 + (i * 0.1) }}
               className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex justify-between items-center relative overflow-hidden"
             >
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-700" />
                 <span className="font-bold text-sm md:text-base">{student.name}</span>
               </div>
               <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.color}`}>
                 {student.status}
               </div>

               {student.alert && (
                 <motion.div
                   initial={{ y: 50, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 1.5 }}
                   className="absolute inset-0 bg-blue-600 flex items-center justify-center gap-2"
                 >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                       <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">SMS Sent to Parent</span>
                 </motion.div>
               )}
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
