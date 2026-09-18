import React from 'react';
import { TroubleshootingStep } from '../../types/helpdesk';
import { Check, Square, CheckSquare, Wrench } from 'lucide-react';
import { CodeSnippet } from '../common/CodeSnippet';

interface TroubleshootingChecklistProps {
  steps: TroubleshootingStep[];
  onToggleStep: (stepId: string) => void;
  disabled?: boolean;
}

export const TroubleshootingChecklist: React.FC<TroubleshootingChecklistProps> = ({
  steps,
  onToggleStep,
  disabled = false
}) => {
  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-light text-primary">
            <Wrench className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Recommended Resolution Steps
          </h3>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {completedCount} of {steps.length} completed
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Follow these steps in sequence. Check each item as you complete it to record your troubleshooting history.
      </p>

      <div className="space-y-3">
        {steps.map((step) => {
          return (
            <div
              key={step.id}
              onClick={() => !disabled && onToggleStep(step.id)}
              className={`p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                disabled ? 'cursor-default' : 'cursor-pointer'
              } ${
                step.completed
                  ? 'bg-slate-50/80 border-slate-200 text-slate-500 opacity-90'
                  : 'bg-white border-slate-200 hover:border-primary/40 hover:shadow-subtle text-slate-900'
              }`}
            >
              {/* Step Number */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                  step.completed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-primary-light text-primary'
                }`}
              >
                {step.completed ? <Check className="w-4 h-4" /> : step.number}
              </div>

              {/* Step Details */}
              <div className="flex-1 min-w-0" onClick={e => step.codeSnippet && e.stopPropagation()}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${step.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {step.title}
                  </h4>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {step.explanation}
                </p>

                {step.codeSnippet && (
                  <div className="mt-2" onClick={e => e.stopPropagation()}>
                    <CodeSnippet code={step.codeSnippet} />
                  </div>
                )}
              </div>

              {/* Checkbox */}
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStep(step.id);
                }}
                className={`shrink-0 mt-0.5 transition-transform ${
                  disabled ? 'cursor-default' : 'hover:scale-110'
                }`}
                aria-label={`Mark step ${step.number} as ${step.completed ? 'incomplete' : 'completed'}`}
              >
                {step.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 hover:text-primary" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
