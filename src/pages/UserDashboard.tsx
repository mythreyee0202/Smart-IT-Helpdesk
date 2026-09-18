import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  BookOpen, 
  Search,
  Zap,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/common/Badge';

interface UserDashboardProps {
  onNavigate: (path: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { tickets, knowledgeArticles, createTicket } = useTickets();
  const [problemText, setProblemText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute live user support stats
  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'ai_diagnosing').length;
  const inProgressCount = tickets.filter(t => t.status === 'technician_assigned' || t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problemText.trim()) return;

    setIsSubmitting(true);
    const newTicket = await createTicket({
      description: problemText.trim(),
      device: 'laptop'
    });

    setTimeout(() => {
      onNavigate(`/diagnosis/${newTicket.id}`);
    }, 200);
  };

  const handleFillExample = (exampleText: string) => {
    setProblemText(exampleText);
  };

  return (
    <div className="space-y-8">
      {/* Top Greeting Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Good morning, {user?.name.split(' ')[0] || 'Alex'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Describe an IT problem and let AI diagnose the root cause and guide you through resolution.
        </p>
      </div>

      {/* Prominent AI Help Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/40 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-card">
        {/* Subtle decorative background circle */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Diagnostic Assistant</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          How can we help you today?
        </h2>
        <p className="text-xs text-slate-600 mb-4 max-w-xl leading-relaxed">
          State your issue in normal, everyday language. Our deterministic AI diagnosis engine classifies the category, isolates probable causes, and generates step-by-step resolution actions.
        </p>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Describe your IT problem in your own words... e.g. My laptop is connected to Wi-Fi but I can't access any websites."
              className="w-full p-4 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Quick Examples Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Try sample:
            </span>
            <button
              type="button"
              onClick={() => handleFillExample("My laptop is connected to Wi-Fi but I can't access any websites.")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-[11px] transition-colors"
            >
              Wi-Fi connected but no internet
            </button>
            <button
              type="button"
              onClick={() => handleFillExample("Laptop is extremely slow, freezing up, and apps take forever to open.")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-[11px] transition-colors"
            >
              Laptop running slow
            </button>
            <button
              type="button"
              onClick={() => handleFillExample("Cannot log into company email and getting account locked message.")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-[11px] transition-colors"
            >
              Company email locked out
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/report')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Report & Screenshot</span>
            </button>

            <button
              type="submit"
              disabled={!problemText.trim() || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-subtle ${
                problemText.trim() && !isSubmitting
                  ? 'bg-primary hover:bg-primary-hover shadow-primary/20'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{isSubmitting ? 'Initializing...' : 'Analyze Problem'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* SUPPORT OVERVIEW METRICS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Your Support Overview
          </h3>
          <span className="text-[11px] text-slate-400">Live ticket metrics</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900">{openCount}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Open Tickets</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900">{inProgressCount}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">In Progress</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900">{resolvedCount}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Resolved</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900">18 min</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Avg Resolution</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: RECENT TICKETS & POPULAR HELP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT TICKETS (2 COLS) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Recent Tickets
            </h3>
            <button
              onClick={() => onNavigate('/tickets')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all tickets</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {tickets.slice(0, 4).map(ticket => {
              return (
                <div
                  key={ticket.id}
                  onClick={() => onNavigate(`/tickets/${ticket.id}`)}
                  className="p-4 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl shadow-2xs hover:shadow-subtle transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-primary transition-colors">
                        {ticket.id}
                      </span>
                      <CategoryBadge category={ticket.category} showIcon={false} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
                      {ticket.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {ticket.description}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <StatusBadge status={ticket.status} />
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* POPULAR HELP ARTICLES (1 COL) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Popular Help
            </h3>
            <button
              onClick={() => onNavigate('/knowledge-base')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Browse KB
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {knowledgeArticles.slice(0, 4).map(article => (
              <div
                key={article.id}
                onClick={() => onNavigate(`/knowledge-base/${article.id}`)}
                className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary-light group-hover:text-primary transition-colors shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {article.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="capitalize">{article.category}</span>
                    <span>•</span>
                    <span>{article.estimatedTime} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
