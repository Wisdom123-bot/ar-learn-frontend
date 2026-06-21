"use client";

import { motion } from 'framer-motion';

export function IntroScene({ scene }: any) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-12"
      >
        <span className="text-white font-black text-6xl">A</span>
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-4xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none"
      >
        Ar-Learn
      </motion.h1>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 1, duration: 1 }}
        className="h-1.5 bg-blue-500 rounded-full mb-8"
      />
    </div>
  );
}
