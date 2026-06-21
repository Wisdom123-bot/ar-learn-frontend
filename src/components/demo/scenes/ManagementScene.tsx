"use client";

import { motion } from 'framer-motion';

export function ManagementScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-blue-600 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(37,99,235,0.3)] border border-blue-400/20 relative overflow-hidden text-white">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Executive Dashboard
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black leading-tight"
          >
            Command & Control <br />for Headteachers.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-100 text-sm md:text-lg leading-relaxed"
          >
            Monitor school performance, fee collection, and teacher activity from a single, powerful overview.
          </motion.p>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          {[
            { label: "Fee Collection", val: "84%", color: "bg-emerald-400" },
            { label: "Avg Attendance", val: "96.2%", color: "bg-white" },
            { label: "Teacher Activity", val: "Active", color: "bg-amber-300" },
            { label: "Exam Status", val: "Live", color: "bg-red-400" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 + (i * 0.1), type: "spring" }}
              className="bg-white/10 backdrop-blur-lg p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10"
            >
               <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">{stat.label}</div>
               <div className="text-xl md:text-3xl font-black">{stat.val}</div>
               <div className={`h-1 w-8 ${stat.color} mt-4 rounded-full`} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background shapes */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
    </div>
  );
}
