"use client";

import { motion } from 'framer-motion';

export function AdmissionsScene({ scene }: any) {
  return (
    <div className="w-full max-w-5xl bg-emerald-950 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(16,185,129,0.1)] border border-emerald-900/50 relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        <div className="flex-1 space-y-4 md:space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Smart Admissions
          </motion.div>
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-black text-white leading-tight"
          >
            Onboard Students <br />in Seconds.
          </motion.h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-emerald-100/60 text-sm md:text-lg leading-relaxed"
          >
            Say goodbye to paper forms. Capture student details, documents, and parent info in one seamless digital flow.
          </motion.p>
        </div>

        <div className="flex-1 w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="bg-emerald-900/40 backdrop-blur-xl p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-emerald-800/50 space-y-6"
          >
            <div className="space-y-4">
               {[
                 { label: "Full Name", value: "John Doe" },
                 { label: "Grade/Class", value: "Grade 4 East" },
                 { label: "Parent Phone", value: "+254 700 000 000" }
               ].map((field, i) => (
                 <motion.div
                   key={i}
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.8 + (i * 0.1) }}
                   className="p-3 bg-emerald-950/50 rounded-xl border border-emerald-800/30"
                 >
                   <div className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter mb-1">{field.label}</div>
                   <div className="text-sm font-bold text-white">{field.value}</div>
                 </motion.div>
               ))}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="w-full py-3 bg-emerald-500 rounded-xl text-center text-xs font-black text-emerald-950 uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            >
              Complete Enrollment
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />
    </div>
  );
}
