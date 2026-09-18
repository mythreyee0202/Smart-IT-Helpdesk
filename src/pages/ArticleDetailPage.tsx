import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Bot, 
  ChevronRight, 
  Share2, 
  ThumbsUp,
  FileText,
  LifeBuoy
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { CategoryBadge } from '../components/common/Badge';
import { CodeSnippet } from '../components/common/CodeSnippet';
import { useToast } from '../context/ToastContext';

interface ArticleDetailPageProps {
  articleId: string;
  onNavigate: (path: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ articleId, onNavigate }) => {
  const { knowledgeArticles } = useTickets();
  const { addToast } = useToast();

  const article = knowledgeArticles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Article Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested knowledge base article <span className="font-mono font-bold">{articleId}</span> could not be located.
        </p>
        <button
          onClick={() => onNavigate('/knowledge-base')}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          Back to Knowledge Base
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Article direct URL copied to clipboard.'
    });
  };

  const handleHelpful = () => {
    addToast({
      type: 'success',
      title: 'Feedback Received',
      message: 'Thank you for helping us improve our IT knowledge base.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/knowledge-base')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all articles</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 shadow-2xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Article</span>
        </button>
      </div>

      {/* Article Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={article.category} />
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.estimatedTime} resolution time</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-mono text-slate-400">ID: {article.id}</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 2-COLUMN ARTICLE CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN BODY (2 COLUMNS) */}
        <div className="lg:col-span-2 space-y-8">
          {/* STEP-BY-STEP SOLUTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step-by-Step Resolution Procedures
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Execute these validated technical instructions in sequence.
              </p>
            </div>

            <div className="space-y-6">
              {article.solutionSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-primary-light text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.detail}
                    </p>
                    {step.command && (
                      <CodeSnippet code={step.command} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHEN TO CONTACT IT */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>When to Escalate / Contact IT Support</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              If any of the following conditions are met during your troubleshooting, automated self-service should be paused and an IT technician dispatched:
            </p>
            <ul className="space-y-1.5 pl-4 text-xs text-amber-900 list-disc">
              {article.whenToContactIT.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* SIDEBAR: SYMPTOMS, CAUSES, HELPFUL WIDGET */}
        <div className="space-y-6">
          {/* SYMPTOMS CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recognized Symptoms
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {article.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* POSSIBLE CAUSES CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Underlying Causes
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {article.possibleCauses.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* REPORT AI PROBLEM CTA */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 p-5 space-y-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mx-auto shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Need personalized AI diagnosis?
            </h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              If this article didn't match your exact error signature, let our AI engine analyze your specific symptoms.
            </p>
            <button
              onClick={() => onNavigate('/report')}
              className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-subtle transition-colors"
            >
              Analyze My Problem
            </button>
          </div>

          {/* WAS THIS HELPFUL? */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center space-y-2 shadow-2xs">
            <span className="text-xs font-semibold text-slate-700 block">
              Was this guide helpful?
            </span>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleHelpful}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Yes, helped</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
