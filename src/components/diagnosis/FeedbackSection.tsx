import React, { useState } from 'react';
import { Ticket } from '../../types/helpdesk';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  UserCheck, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Send
} from 'lucide-react';
import { StarRating } from '../common/StarRating';

interface FeedbackSectionProps {
  ticket: Ticket;
  onResolve: (rating: number, comment?: string) => void;
  onEscalate: () => void;
  onViewTicket: () => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  ticket,
  onResolve,
  onEscalate,
  onViewTicket
}) => {
  const [outcome, setOutcome] = useState<'prompt' | 'yes' | 'no'>('prompt');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const isResolved = ticket.status === 'resolved';
  const isEscalated = ticket.status === 'technician_assigned' || ticket.status === 'in_progress' || ticket.status === 'escalated';

  const completedSteps = ticket.aiAnalysis?.troubleshootingSteps.filter(s => s.completed) || [];

  if (isResolved) {
    return (
      <div className="p-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl animate-in fade-in">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-emerald-950">
                Ticket Closed & Resolved
              </h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-200 text-emerald-900">
                AI Solved
              </span>
            </div>
            <p className="mt-1 text-xs text-emerald-800">
              Great! Your problem was resolved through automated troubleshooting.
            </p>
            {ticket.feedback && (
              <div className="mt-3 flex items-center gap-3">
                <StarRating value={ticket.feedback.rating} readonly size="sm" />
                {ticket.feedback.comment && (
                  <span className="text-xs text-emerald-900 italic">
                    "{ticket.feedback.comment}"
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onViewTicket}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-subtle transition-colors"
          >
            <span>View Ticket Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (isEscalated) {
    return (
      <div className="p-6 bg-amber-50/80 border border-amber-200 rounded-2xl animate-in fade-in">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-amber-950">
              Escalated to IT Support Team
            </h4>
            <p className="mt-1 text-xs text-amber-800">
              Assigned to {ticket.assignedTechnician || 'Senior IT Specialist'}. An IT technician has been provided with your AI diagnostic logs and completed steps.
            </p>
          </div>
          <button
            onClick={onViewTicket}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-subtle transition-colors"
          >
            <span>View Ticket Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-card space-y-6">
      {outcome === 'prompt' && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary-light text-primary">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Did this solve your problem?
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Let us know if the automated resolution steps worked, or escalate immediately to an IT specialist.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setOutcome('yes')}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm transition-all hover:shadow-subtle group"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Yes, problem solved</span>
            </button>

            <button
              onClick={() => setOutcome('no')}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-sm transition-all hover:shadow-subtle group"
            >
              <UserCheck className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
              <span>No, I still need help</span>
            </button>
          </div>
        </div>
      )}

      {/* YES PATH */}
      {outcome === 'yes' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Great! Your issue has been resolved.
                </h4>
                <p className="text-xs text-slate-500">
                  Please rate how helpful this AI troubleshooting workflow was.
                </p>
              </div>
            </div>
            <button
              onClick={() => setOutcome('prompt')}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Back
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                How helpful was this solution?
              </label>
              <StarRating value={rating} onChange={setRating} size="md" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tell us what helped (optional):
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Example: Step 3 DNS flush fixed it immediately..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onResolve(rating, comment)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-subtle transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Close Ticket as Resolved</span>
            </button>
          </div>
        </div>
      )}

      {/* NO / ESCALATE PATH */}
      {outcome === 'no' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Let's get this to an IT technician
                </h4>
                <p className="text-xs text-slate-500">
                  AI couldn't resolve the issue with available automated steps.
                </p>
              </div>
            </div>
            <button
              onClick={() => setOutcome('prompt')}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Back
            </button>
          </div>

          {/* Completed Steps Overview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-700 flex items-center justify-between">
              <span>Troubleshooting Already Completed:</span>
              <span className="text-slate-500 font-mono">
                {completedSteps.length} of {ticket.aiAnalysis?.troubleshootingSteps.length || 0} steps checked
              </span>
            </div>
            {completedSteps.length > 0 ? (
              <ul className="space-y-1 pl-1">
                {completedSteps.map(s => (
                  <li key={s.id} className="flex items-center gap-2 text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">
                No specific troubleshooting steps were marked as successful.
              </p>
            )}
          </div>

          {/* AI Escalation Summary */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-dark">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI Generated Technician Summary</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {ticket.aiAnalysis?.technicianSummary || 'User reported issue unresolved via standard client-side diagnosis. Handing over with all attached logs.'}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onEscalate}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-subtle transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Escalate to IT Support</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
