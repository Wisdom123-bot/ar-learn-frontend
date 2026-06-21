"use client";

import { motion } from 'framer-motion';

export function ParentScene({ scene }: any) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-6xl px-6">
      {/* Phone Mockup for Parent App */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-12 flex items-center justify-center">
           <div className="w-20 h-4 bg-slate-800 rounded-full" />
        </div>

        <div className="p-6 pt-12 space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-black">JD</div>
              <div className="space-y-1">
                 <div className="text-white font-black text-sm">John Doe</div>
                 <div className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">Form 4 Alpha</div>
              </div>
           </div>

           <div className="bg-white/5 rounded-2xl p-4 space-y-4 border border-white/5">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Fee Balance</div>
              <div className="flex justify-between items-end">
                 <div className="text-2xl font-black text-white">KES 12,450</div>
                 <div className="text-[10px] font-bold text-rose-400">DUE IN 4 DAYS</div>
              </div>
           </div>

           <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-blue-600 p-4 rounded-2xl space-y-2 shadow-lg shadow-blue-950"
           >
              <div className="text-[10px] font-black text-white uppercase tracking-widest">New Result Published</div>
              <div className="text-xs font-bold text-blue-100">Mathematics: 88% (Grade A)</div>
           </motion.div>

           <div className="space-y-3">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Recent Activities</div>
              {[
                { label: 'Attendance', detail: 'Present today at 07:45 AM', color: 'text-emerald-400' },
                { label: 'Discipline', detail: 'Received "Peer Mentor" badge', color: 'text-blue-400' },
                { label: 'Exam', detail: 'Physics CAT 2: 74%', color: 'text-white' },
              ].map((act, i) => (
                <div key={i} className="flex gap-3 items-center">
                   <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-xs">🔔</div>
                   <div className="flex-1">
                      <div className={`text-[10px] font-black ${act.color}`}>{act.label}</div>
                      <div className="text-[10px] font-medium text-white/40">{act.detail}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center">
           <div className="w-32 h-1.5 bg-white/20 rounded-full" />
        </div>
      </motion.div>

      <div className="max-w-md space-y-8 text-center md:text-left">
         <motion.h3
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-black text-white italic leading-tight"
         >
          Transparency <br/>in Every Pocket.
         </motion.h3>
         <motion.p
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-slate-400 text-lg leading-relaxed"
         >
          Our Parent Portal ensures that guardians are always part of the academic journey, with instant notifications and real-time data.
         </motion.p>
      </div>
    </div>
  );
}
