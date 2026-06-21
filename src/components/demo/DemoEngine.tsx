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
import { AdmissionsScene } from './scenes/AdmissionsScene';
import { ImportScene } from './scenes/ImportScene';
import { ManagementScene } from './scenes/ManagementScene';
import { ReportBuilderScene } from './scenes/ReportBuilderScene';
import { AttendanceLiveScene } from './scenes/AttendanceLiveScene';
import { CBCCompetencyScene } from './scenes/CBCCompetencyScene';
import { CashFlowScene } from './scenes/CashFlowScene';
import { StaffingScene } from './scenes/StaffingScene';
import { ValueAddScene } from './scenes/ValueAddScene';

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
      case 'admissions': return <AdmissionsScene scene={scene} />;
      case 'import': return <ImportScene scene={scene} />;
      case 'management': return <ManagementScene scene={scene} />;
      case 'report_builder': return <ReportBuilderScene scene={scene} />;
      case 'attendance_live': return <AttendanceLiveScene scene={scene} />;
      case 'cbc_competency': return <CBCCompetencyScene scene={scene} />;
      case 'cash_flow': return <CashFlowScene scene={scene} />;
      case 'staffing': return <StaffingScene scene={scene} />;
      case 'value_add': return <ValueAddScene scene={scene} />;
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
          className="w-full h-full flex flex-col items-center p-4 pt-24 md:pt-32 pb-32 md:pb-48 overflow-y-auto scrollbar-hide relative"
        >
          {renderScene()}

          {/* Auto-scroll indicator/anchor */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 flex flex-col items-center opacity-40 md:hidden"
          >
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Scroll for more</p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-600">
               <path d="M7 13l5 5 5-5M7 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
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
