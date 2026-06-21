"use client";

import { motion } from 'framer-motion';

export function AuthScene({ scene }: any) {
  return (
    <div className="w-full max-w-lg bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

      <div className="space-y-6 md:space-y-8">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Initialize School</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Institution Registry</p>
        </div>

        <div className="space-y-3 md:space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="h-12 md:h-14 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl flex items-center px-4 md:px-6 justify-between"
          >
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Institution Name</span>
            <span className="text-xs md:text-sm font-black text-slate-900">Ar-Learn Academy</span>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="h-12 md:h-14 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl flex items-center px-4 md:px-6 justify-between"
          >
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Principal Email</span>
            <span className="text-xs md:text-sm font-black text-slate-900">principal@ar-learn.com</span>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="h-12 md:h-14 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl flex items-center px-4 md:px-6 justify-between"
          >
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Location</span>
            <span className="text-xs md:text-sm font-black text-slate-900">Nairobi, KE</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: "spring" }}
          className="h-14 md:h-16 bg-blue-600 rounded-xl md:rounded-[1.2rem] flex items-center justify-center text-white font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-blue-200"
        >
          Create My Account
        </motion.div>
      </div>

      {/* Cinematic Spotlight */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400/20 blur-[80px] rounded-full"
      />
    </div>
  );
}
