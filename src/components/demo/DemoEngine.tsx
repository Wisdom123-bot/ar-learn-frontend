"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_SCENES, DemoScene } from './demoConfig';
import DemoOverlay from './DemoOverlay';

// Mock Scene Components (simplified versions of real UI)
import { IntroScene } from './scenes/IntroScene';
import { AuthScene } from './scenes/AuthScene';
import { DashboardScene } from './scenes/DashboardScene';
import { AnalyticsScene } from './scenes/AnalyticsScene';
import { ParentScene } from './scenes/ParentScene';
import { FeesScene } from './scenes/FeesScene';
import { TimetableScene } from './scenes/TimetableScene';
import { ReportCardScene } from './scenes/ReportCardScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';
import { StudentProfileScene } from './scenes/StudentProfileScene';
import { DisciplineScene } from './scenes/DisciplineScene';

interface DemoEngineProps {
  onClose: () => void;
}

export default function DemoEngine({ onClose }: DemoEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  const scene = DEMO_SCENES[currentIdx];

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - (pausedTimeRef.current || 0);

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const p = Math.min((elapsed / scene.duration) * 100, 100);
        setProgress(p);

        if (p >= 100) {
          handleNext();
        }
      }, 50);

      timerRef.current = interval;
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      pausedTimeRef.current = Date.now() - startTimeRef.current;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, scene.duration]);

  const handleNext = () => {
    if (currentIdx < DEMO_SCENES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setProgress(0);
      pausedTimeRef.current = 0;
    } else {
      onClose();
    }
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const renderScene = () => {
    switch (scene.type) {
      case 'intro': return <IntroScene scene={scene} />;
      case 'auth': return <AuthScene scene={scene} />;
      case 'dashboard': return <DashboardScene scene={scene} />;
      case 'ai': return <AnalyticsScene scene={scene} />;
      case 'parent': return <ParentScene scene={scene} />;
      case 'fees': return <FeesScene scene={scene} />;
      case 'timetable': return <TimetableScene scene={scene} />;
      case 'report_card': return <ReportCardScene scene={scene} />;
      case 'leaderboard': return <LeaderboardScene scene={scene} />;
      case 'student_profile': return <StudentProfileScene scene={scene} />;
      case 'discipline': return <DisciplineScene scene={scene} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center relative"
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>

      <DemoOverlay
        scene={scene}
        progress={progress}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onClose={onClose}
        onNext={handleNext}
      />
    </div>
  );
}
