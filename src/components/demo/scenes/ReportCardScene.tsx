"use client";

import { motion } from 'framer-motion';

export function ReportCardScene({ scene }: any) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-lg p-6 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-200 relative overflow-hidden">
      {/* School Header */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-6 mb-12 border-b-4 border-blue-600 pb-8">
        <div className="space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl md:text-4xl font-black mb-4 mx-auto md:mx-0"
          >
            A
          </motion.div>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">AR-LEARN ACADEMY</h3>
          <p className="text-blue-600 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em]">Knowledge is Power</p>
        </div>
        <div className="text-right space-y-1">
          <p className="font-black text-slate-900">STUDENT REPORT CARD</p>
          <p className="text-xs text-slate-400 font-bold uppercase">TERM 2, 2026</p>
          <div className="pt-4">
             <div className="h-4 w-32 bg-slate-50 rounded ml-auto" />
             <div className="h-3 w-40 bg-slate-50 rounded mt-2 ml-auto" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="space-y-4 mb-12">
        <div className="grid grid-cols-4 border-b border-slate-100 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Subject</span>
          <span className="text-center">Mid Term</span>
          <span className="text-center">End Term</span>
          <span className="text-right">Grade</span>
        </div>
        {[
          { s: 'Mathematics', m: 85, e: 88, g: 'A' },
          { s: 'English', m: 72, e: 78, g: 'B+' },
          { s: 'Science', m: 90, e: 94, g: 'A' },
          { s: 'History', m: 65, e: 60, g: 'C' },
        ].map((row, i) => (
          <motion.div
            key={row.s}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 + (i * 0.2) }}
            className="grid grid-cols-4 py-2 border-b border-slate-50 text-sm font-bold text-slate-700"
          >
            <span>{row.s}</span>
            <span className="text-center">{row.m}</span>
            <span className="text-center">{row.e}</span>
            <span className="text-right text-blue-600 font-black">{row.g}</span>
          </motion.div>
        ))}
      </div>

      {/* AI Remarks */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
        className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 space-y-4"
      >
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Executive Summary</span>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          John exhibits exceptional aptitude in STEM subjects. While History performance dipped slightly, his overall mean score has improved by <span className="text-blue-600 font-black">4.2%</span>. We predict an <span className="text-blue-600 font-black">A-minus</span> for the final national exams if current trends continue.
        </p>
      </motion.div>

      {/* Cinematic Seal */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/5 rounded-full flex items-center justify-center border border-blue-100"
      >
        <div className="w-32 h-32 border-2 border-dashed border-blue-200 rounded-full" />
      </motion.div>
    </div>
  );
}
