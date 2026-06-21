"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DemoScene } from './demoConfig';

interface DemoOverlayProps {
  scene: DemoScene;
  progress: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onNext: () => void;
}

export default function DemoOverlay({
  scene,
  progress,
  isPlaying,
  onTogglePlay,
  onClose,
  onNext
}: DemoOverlayProps) {
  return (
    <>
      {/* Cinematic Borders/Letterbox - Responsive */}
      <div className="absolute inset-0 pointer-events-none md:border-[4rem] border-slate-950/20 z-10" />

      {/* Top Bar: Scene Info */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 inset-x-0 p-6 md:p-12 flex justify-between items-start z-20 pointer-events-none"
      >
        <div className="max-w-xl">
          <motion.h2
            key={scene.title}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl md:text-4xl font-black text-[#2563EB] italic tracking-tighter mb-2"
          >
            {scene.title}
          </motion.h2>
          <motion.p
            key={scene.description}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-lg text-[#2563EB] font-bold leading-tight bg-white/10 backdrop-blur-sm inline-block px-2 py-1 rounded"
          >
            {scene.description}
          </motion.p>
        </div>

        <button
          onClick={onClose}
          className="pointer-events-auto p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>

      {/* Bottom Bar: Controls & Progress */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 inset-x-0 p-12 flex flex-col gap-8 z-20"
      >
        <div className="flex items-center gap-6">
          <button
            onClick={onTogglePlay}
            className="p-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl hover:scale-110 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <motion.div
              className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.05 }}
            />
          </div>

          <button
            onClick={onNext}
            className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
          >
            Skip Scene
          </button>
        </div>
      </motion.div>
    </>
  );
}
