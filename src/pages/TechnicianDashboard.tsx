import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Filter, 
  User, 
  Bot, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  PlusCircle,
  Inbox
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/common/Badge';

interface TechnicianDashboardProps {
  onNavigate: (path: string) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ onNavigate }) => {
  const { tickets, updateTicketStatus, assignTechnician } = useTickets();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Compute live metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status !== 'resolved').length;
  const highPriorityCount = tickets.filter(t => (t.priority === 'high' || t.priority === 'critical') && t.status !== 'resolved').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const aiResolvedRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 68;

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Status filter
      if (statusFilter === 'active' && ticket.status === 'resolved') return false;
      if (statusFilter === 'assigned_me' && ticket.assignedTechnician !== user?.name) return false;
      if (statusFilter === 'unassigned' && ticket.assignedTechnician) return false;
      if (statusFilter === 'escalated' && ticket.status !== 'technician_assigned' && ticket.status !== 'escalated') return false;
      if (statusFilter === 'resolved' && ticket.status !== 'resolved') return false;

      // Priority filter
      if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = ticket.id.toLowerCase().includes(q);
        const matchTitle = ticket.title.toLowerCase().includes(q);
        const matchUser = ticket.userName.toLowerCase().includes(q);
        const matchTech = ticket.assignedTechnician?.toLowerCase().includes(q);
        return matchId || matchTitle || matchUser || matchTech;
      }

      return true;
    });
  }, [tickets, statusFilter, priorityFilter, searchQuery, user?.name]);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Tier-2 / Tier-3 Support Operations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            IT Support Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Triage AI-escalated tickets, review pre-computed diagnostic logs, and manage resolution workflows.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/report')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-subtle transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Admin Ticket</span>
        </button>
      </div>

      {/* OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900">{openCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Active Open Tickets</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-amber-600">{highPriorityCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">High / Critical Urgency</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-emerald-600">{aiResolvedRate}%</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">AI Resolution Rate</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900">21 min</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Avg MTTR Resolution</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TICKET TRIAGE QUEUE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tickets Requiring Attention
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review automatically generated AI summaries and user-attempted troubleshooting logs.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'active', label: 'Active Queue' },
              { id: 'escalated', label: 'Escalated to IT' },
              { id: 'assigned_me', label: 'Assigned to Me' },
              { id: 'all', label: 'All Records' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar & Priority selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search queue by ticket ID, issue, user, or assignee..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {filteredTickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No tickets match the selected console filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Ticket ID</th>
                  <th className="py-3 px-3">Issue / Summary</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">AI Match</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assigned To</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTickets.map(ticket => {
                  const isAssignedToMe = ticket.assignedTechnician === user?.name;
                  const confidence = ticket.aiAnalysis?.confidence || 85;

                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => onNavigate(`/tickets/${ticket.id}`)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-primary group-hover:underline">
                        {ticket.id}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                          {ticket.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          User: {ticket.userName} ({ticket.userEmail})
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <CategoryBadge category={ticket.category} showIcon={false} />
                      </td>
                      <td className="py-3.5 px-3">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          confidence >= 90
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {confidence}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-3">
                        {ticket.assignedTechnician ? (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            isAssignedToMe ? 'text-amber-800' : 'text-slate-700'
                          }`}>
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{ticket.assignedTechnician}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(`/tickets/${ticket.id}`);
                          }}
                          className="px-2.5 py-1 bg-slate-100 group-hover:bg-primary group-hover:text-white rounded-lg text-slate-700 text-[11px] font-bold transition-colors"
                        >
                          Triage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
