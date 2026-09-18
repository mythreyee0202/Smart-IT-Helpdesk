import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Wifi,
  Cpu,
  UserCheck,
  Printer,
  AppWindow,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { CategoryBadge } from '../components/common/Badge';
import { Category } from '../types/helpdesk';

interface KnowledgeBasePageProps {
  onNavigate: (path: string) => void;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ onNavigate }) => {
  const { knowledgeArticles } = useTickets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Articles', icon: BookOpen },
    { id: 'network', label: 'Network', icon: Wifi },
    { id: 'performance', label: 'Performance', icon: Cpu },
    { id: 'account', label: 'Accounts', icon: UserCheck },
    { id: 'hardware', label: 'Hardware', icon: Printer },
    { id: 'software', label: 'Software', icon: AppWindow },
  ];

  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter(article => {
      // Category filter
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = article.title.toLowerCase().includes(q);
        const matchTags = article.tags.some(t => t.toLowerCase().includes(q));
        const matchSymptoms = article.symptoms.some(s => s.toLowerCase().includes(q));
        const matchCauses = article.possibleCauses.some(c => c.toLowerCase().includes(q));
        return matchTitle || matchTags || matchSymptoms || matchCauses;
      }

      return true;
    });
  }, [knowledgeArticles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-1.5 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Verified IT Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Self-Service Resolution Library
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Standard Operating Procedures, hardware diagnostic trees, and network repair manuals indexed for rapid resolution.
          </p>

          {/* Search Bar inside Hero */}
          <div className="pt-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search IT solutions, error codes, commands (e.g. wifi, spooler, bsod)..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 shadow-subtle"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-subtle'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No matching articles found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any knowledge base articles matching "{searchQuery}". Try searching with different keywords or report your problem for AI assistance.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setSearchQuery('')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Clear Search
            </button>
            <button
              onClick={() => onNavigate('/report')}
              className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold"
            >
              Report Problem
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => onNavigate(`/knowledge-base/${article.id}`)}
              className="bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-subtle transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <CategoryBadge category={article.category} />
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{article.estimatedTime} read</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {article.symptoms[0] || 'Troubleshooting guide and step-by-step resolution.'}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                <span>Read step-by-step solution</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
