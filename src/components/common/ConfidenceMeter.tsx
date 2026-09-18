import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  size = 'md',
  showLabel = true
}) => {
  let color = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-500';
  let qualitative = 'High Confidence';

  if (confidence < 80) {
    color = 'text-amber-700 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
    qualitative = 'Moderate Confidence (Technician Recommended)';
  } else if (confidence < 90) {
    color = 'text-blue-700 bg-blue-50 border-blue-200';
    barColor = 'bg-blue-600';
    qualitative = 'Good Match';
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>AI Diagnostic Confidence</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-xs font-bold border ${color}`}>
          {confidence}%
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${confidence}%` }}
        />
      </div>

      {showLabel && (
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{qualitative}</span>
          <span className="text-slate-400">Pattern match score</span>
        </div>
      )}
    </div>
  );
};
