import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Info,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { AnalysisAnimation } from '../components/diagnosis/AnalysisAnimation';
import { TroubleshootingChecklist } from '../components/diagnosis/TroubleshootingChecklist';
import { FeedbackSection } from '../components/diagnosis/FeedbackSection';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/common/Badge';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';

interface DiagnosisPageProps {
  ticketId: string;
  onNavigate: (path: string) => void;
}

export const DiagnosisPage: React.FC<DiagnosisPageProps> = ({ ticketId, onNavigate }) => {
  const { 
    getTicket, 
    toggleTroubleshootingStep, 
    resolveTicketWithFeedback, 
    escalateTicket,
    knowledgeArticles 
  } = useTickets();

  const ticket = getTicket(ticketId);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // If already resolved or escalated or older, skip animation quickly
  useEffect(() => {
    if (!ticket) {
      setIsAnalyzing(false);
      return;
    }
    // If ticket status is resolved or technician_assigned, no need for long animation
    if (ticket.status !== 'ai_diagnosing' && ticket.status !== 'open') {
      setIsAnalyzing(false);
    }
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Ticket Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested ticket ID <span className="font-mono font-bold text-slate-700">{ticketId}</span> does not exist or has been cleared.
        </p>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const analysis = ticket.aiAnalysis;

  if (isAnalyzing) {
    return (
      <AnalysisAnimation
        onComplete={() => setIsAnalyzing(false)}
        speedMultiplier={1}
      />
    );
  }

  // Matched KB articles
  const matchedArticles = knowledgeArticles.filter(art => 
    analysis?.knowledgeBaseArticles?.includes(art.id) || art.category === ticket.category
  ).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/tickets')}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Back to Tickets"
            aria-label="Back to Tickets"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary">{ticket.id}</span>
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              AI Problem Diagnosis
            </h1>
          </div>
        </div>

        <button
          onClick={() => onNavigate(`/tickets/${ticket.id}`)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <span>View Ticket Details & Timeline</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* DIAGNOSIS HERO CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        {/* Top Badges & Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <CategoryBadge category={ticket.category} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {analysis?.detectedIssue || ticket.title}
            </h2>
            <p className="text-xs text-slate-500">
              Reported by {ticket.userName} for device <strong className="capitalize">{ticket.device}</strong>
            </p>
          </div>

          {/* Confidence Meter Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
            <ConfidenceMeter confidence={analysis?.confidence || 85} />
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-dark">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Diagnostic Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {analysis?.summary || 'Standard client diagnosis generated based on symptom match.'}
          </p>
        </div>

        {/* Likely Causes */}
        {analysis?.possibleCauses && analysis.possibleCauses.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Likely Root Causes Identified</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysis.possibleCauses.map((cause, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{cause}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RESOLUTION TROUBLESHOOTING CHECKLIST */}
      {analysis?.troubleshootingSteps && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
          <TroubleshootingChecklist
            steps={analysis.troubleshootingSteps}
            onToggleStep={(stepId) => toggleTroubleshootingStep(ticket.id, stepId)}
            disabled={ticket.status === 'resolved'}
          />
        </div>
      )}

      {/* RESOLUTION FEEDBACK / ESCALATION WORKFLOW */}
      <FeedbackSection
        ticket={ticket}
        onResolve={(rating, comment) => resolveTicketWithFeedback(ticket.id, rating, comment)}
        onEscalate={() => escalateTicket(ticket.id)}
        onViewTicket={() => onNavigate(`/tickets/${ticket.id}`)}
      />

      {/* RELATED KNOWLEDGE BASE ARTICLES */}
      {matchedArticles.length > 0 && (
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Related Knowledge Base References
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/knowledge-base')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Search all articles
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedArticles.map(article => (
              <div
                key={article.id}
                onClick={() => onNavigate(`/knowledge-base/${article.id}`)}
                className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                    {article.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {article.estimatedTime} resolution guide
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
