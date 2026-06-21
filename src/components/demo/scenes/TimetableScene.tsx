"use client";

import { motion } from 'framer-motion';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIODS = ['08:00', '09:00', '10:00', '11:00', '12:00'];

const SUBJECTS = [
  { name: 'Math', color: 'bg-blue-500' },
  { name: 'English', color: 'bg-purple-500' },
  { name: 'Science', color: 'bg-emerald-500' },
  { name: 'History', color: 'bg-amber-500' },
  { name: 'Swa', color: 'bg-rose-500' },
];

export function TimetableScene({ scene }: any) {
  return (
    <div className="w-full max-w-6xl bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden border border-slate-100">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-1">
          <motion.h3
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-black text-slate-900"
          >
            Auto-Generated Timetables
          </motion.h3>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-bold uppercase tracking-widest text-xs"
          >
            Conflict-Free Scheduling in Seconds
          </motion.p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-dashed border-blue-200 flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-blue-600 rounded-full" />
        </motion.div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="space-y-4 pt-12">
          {PERIODS.map(p => (
            <div key={p} className="h-16 flex items-center justify-end pr-4 text-[10px] font-bold text-slate-300">
              {p}
            </div>
          ))}
        </div>
        {DAYS.map((day, di) => (
          <div key={day} className="space-y-4">
            <div className="text-center font-black text-slate-400 uppercase tracking-widest text-[10px] mb-2">
              {day}
            </div>
            {PERIODS.map((p, pi) => {
              const sub = SUBJECTS[(di + pi) % SUBJECTS.length];
              return (
                <motion.div
                  key={p}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + (di * 0.1) + (pi * 0.05) }}
                  className={`h-16 ${sub.color} rounded-2xl p-3 text-white shadow-lg shadow-black/5 flex flex-col justify-between group hover:scale-105 transition-transform cursor-pointer`}
                >
                  <div className="font-black text-xs">{sub.name}</div>
                  <div className="w-4 h-4 bg-white/20 rounded-full" />
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Cinematic Highlight Line */}
      <motion.div
        animate={{ y: [0, 450, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 h-1 bg-blue-500/20 blur-sm pointer-events-none"
      />
    </div>
  );
}
