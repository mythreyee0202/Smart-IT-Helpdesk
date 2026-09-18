import React, { useEffect, useState } from 'react';
import { Bot, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AnalysisAnimationProps {
  onComplete: () => void;
  speedMultiplier?: number;
}

const STAGES = [
  { id: 1, label: 'Understanding problem context & extracting symptoms', delay: 400 },
  { id: 2, label: 'Classifying category & computing priority severity', delay: 500 },
  { id: 3, label: 'Evaluating likely root causes & pattern similarity', delay: 500 },
  { id: 4, label: 'Searching local enterprise knowledge base articles', delay: 500 },
  { id: 5, label: 'Generating step-by-step diagnostic resolution workflow', delay: 600 },
];

export const AnalysisAnimation: React.FC<AnalysisAnimationProps> = ({
  onComplete,
  speedMultiplier = 1
}) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (currentStage < STAGES.length) {
      const stageDelay = STAGES[currentStage].delay * speedMultiplier;
      timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, stageDelay);
    } else {
      timer = setTimeout(() => {
        onComplete();
      }, 400 * speedMultiplier);
    }

    return () => clearTimeout(timer);
  }, [currentStage, onComplete, speedMultiplier]);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl border border-slate-200 shadow-card max-w-xl mx-auto my-8 animate-in fade-in zoom-in-95">
      {/* Central Pulsing Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse-subtle">
          <Bot className="w-10 h-10" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-900 rounded-full p-1 shadow">
          <Sparkles className="w-4 h-4 animate-spin" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-1 text-center">
        AI is analyzing your problem
      </h2>
      <p className="text-xs text-slate-500 mb-8 text-center max-w-sm">
        Correlating telemetry patterns, matching historical ticket resolutions, and verifying diagnostic procedures...
      </p>

      {/* Checklist Progress */}
      <div className="w-full space-y-3.5">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isRunning = idx === currentStage;
          const isPending = idx > currentStage;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : isRunning
                  ? 'bg-blue-50/90 border-blue-200 text-blue-900 ring-2 ring-primary/20'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-in zoom-in-75 duration-200" />
                ) : isRunning ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </div>
              <span className="flex-1">{stage.label}</span>
              {isRunning && (
                <span className="text-[10px] text-primary font-semibold animate-pulse">
                  Analyzing...
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onComplete}
        className="mt-8 text-xs text-slate-400 hover:text-slate-600 underline font-medium"
      >
        Skip animation
      </button>
    </div>
  );
};
