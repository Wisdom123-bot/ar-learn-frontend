"use client";

import { motion } from 'framer-motion';

export function StudentProfileScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-white rounded-[3rem] p-6 md:p-10 shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-8 md:gap-12 relative overflow-hidden">
      {/* Profile Sidebar */}
      <div className="w-full md:w-72 space-y-6 md:space-y-8 md:border-r border-slate-50 md:pr-8">
        <div className="flex flex-row md:flex-col items-center text-left md:text-center gap-4 md:space-y-4">
           <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 md:w-32 md:h-32 bg-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-2xl md:text-4xl shadow-inner"
           >
             👤
           </motion.div>
           <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">John Doe</h3>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">ADM: 024/2026</p>
           </div>
        </div>

        <div className="space-y-4">
           <div className="h-10 bg-slate-50 rounded-xl flex items-center px-4 justify-between">
              <span className="text-[10px] font-bold text-slate-400">Class</span>
              <span className="text-[10px] font-black text-slate-900">Form 4 Alpha</span>
           </div>
           <div className="h-10 bg-slate-50 rounded-xl flex items-center px-4 justify-between">
              <span className="text-[10px] font-bold text-slate-400">Status</span>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">ACTIVE</span>
           </div>
        </div>
      </div>

      {/* Profile Analytics */}
      <div className="flex-1 space-y-8">
        <div className="grid grid-cols-3 gap-4">
           {[
             { label: 'Mean Grade', value: 'A-', color: 'text-blue-600' },
             { label: 'Attendance', value: '98%', color: 'text-emerald-600' },
             { label: 'Risk Level', value: 'LOW', color: 'text-slate-400' },
           ].map((stat, i) => (
             <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-slate-50 p-4 rounded-2xl text-center space-y-1 border border-slate-100"
             >
                <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
             </motion.div>
           ))}
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-end">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Subject Trends</h4>
              <div className="flex gap-1">
                 <div className="h-1 w-8 bg-blue-500 rounded-full" />
                 <div className="h-1 w-2 bg-slate-200 rounded-full" />
              </div>
           </div>

           <div className="h-48 bg-slate-50 rounded-3xl p-6 relative">
              <div className="absolute inset-0 flex items-end justify-between px-8 pb-4">
                 {[60, 85, 75, 95, 80, 70].map((h, i) => (
                   <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + (i * 0.1), duration: 1, type: "spring" }}
                    className="w-8 bg-blue-600/10 rounded-t-lg relative group"
                   >
                      <div className="absolute top-0 inset-x-0 h-1 bg-blue-600 rounded-full" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* AI Pulse Badge */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100"
      >
        Deep Analytics Active
      </motion.div>
    </div>
  );
}
