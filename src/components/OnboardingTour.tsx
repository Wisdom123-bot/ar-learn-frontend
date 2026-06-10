"use client";

import { useState, useEffect } from "react";

interface Step {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  steps: Step[];
  tourKey: string;
}

export default function OnboardingTour({ steps, tourKey }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tour_${tourKey}`);
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, [tourKey]);

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [isVisible, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem(`tour_${tourKey}`, "true");
  };

  if (!isVisible || !steps[currentStep]) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop with hole */}
      <div
        className="absolute inset-0 bg-black/60 transition-all duration-300"
        style={{
          clipPath: `polygon(0% 0%, 0% 100%, ${coords.left}px 100%, ${coords.left}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top + coords.height}px, ${coords.left}px ${coords.top + coords.height}px, ${coords.left}px 100%, 100% 100%, 100% 0%)`
        }}
      />

      {/* Popover */}
      <div
        className="absolute pointer-events-auto bg-white rounded-2xl shadow-2xl p-6 w-72 transition-all duration-300 border border-blue-100"
        style={{
          top: step.position === "bottom" ? coords.top + coords.height + 20 :
               step.position === "top" ? coords.top - 180 : coords.top,
          left: step.position === "right" ? coords.left + coords.width + 20 :
                step.position === "left" ? coords.left - 300 : coords.left + (coords.width/2) - 144,
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-black text-blue-900 text-lg">{step.title}</h3>
          <span className="text-[10px] font-bold text-gray-400">{currentStep + 1} / {steps.length}</span>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {step.content}
        </p>
        <div className="flex justify-between items-center">
          <button
            onClick={handleComplete}
            className="text-xs font-bold text-gray-400 hover:text-gray-600"
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
