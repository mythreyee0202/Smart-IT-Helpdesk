import React, { useState, useMemo } from 'react';
import { 
  Ticket as TicketIcon, 
  Search, 
  Filter, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Bot, 
  User, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/common/Badge';
import { Category, Priority, TicketStatus } from '../types/helpdesk';

interface MyTicketsPageProps {
  onNavigate: (path: string) => void;
}

type TabType = 'all' | 'open' | 'ai_diagnosing' | 'technician_assigned' | 'resolved';

export const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ onNavigate }) => {
  const { tickets } = useTickets();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Tab filter
      if (activeTab === 'open' && ticket.status !== 'open' && ticket.status !== 'ai_diagnosing') return false;
      if (activeTab === 'ai_diagnosing' && ticket.status !== 'ai_diagnosing') return false;
      if (activeTab === 'technician_assigned' && ticket.status !== 'technician_assigned' && ticket.status !== 'in_progress') return false;
      if (activeTab === 'resolved' && ticket.status !== 'resolved') return false;

      // Category filter
      if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;

      // Priority filter
      if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = ticket.id.toLowerCase().includes(q);
        const matchTitle = ticket.title.toLowerCase().includes(q);
        const matchDesc = ticket.description.toLowerCase().includes(q);
        const matchTech = ticket.assignedTechnician?.toLowerCase().includes(q);
        return matchId || matchTitle || matchDesc || matchTech;
      }

      return true;
    });
  }, [tickets, activeTab, categoryFilter, priorityFilter, searchQuery]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter(t => t.status === 'open' || t.status === 'ai_diagnosing').length,
      ai_diagnosing: tickets.filter(t => t.status === 'ai_diagnosing').length,
      technician_assigned: tickets.filter(t => t.status === 'technician_assigned' || t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length
    };
  }, [tickets]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & New Ticket Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track problem diagnoses, active technician interventions, and resolution logs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/report')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-subtle transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'all', label: 'All Tickets', count: tabCounts.all },
          { id: 'open', label: 'Open & Triage', count: tabCounts.open },
          { id: 'ai_diagnosing', label: 'AI Diagnosing', count: tabCounts.ai_diagnosing },
          { id: 'technician_assigned', label: 'Technician Assigned', count: tabCounts.technician_assigned },
          { id: 'resolved', label: 'Resolved', count: tabCounts.resolved },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-primary-light text-primary' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Select Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, issue, description, or technician..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Categories</option>
            <option value="network">Network</option>
            <option value="performance">Performance</option>
            <option value="account">Account & Access</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* TICKET TABLE (DESKTOP) & CARDS (MOBILE) */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <TicketIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No tickets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'You do not have any tickets under this filter view.'}
          </p>
          {(searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setPriorityFilter('all');
              }}
              className="text-xs text-primary font-semibold underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Problem / Issue</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTickets.map(ticket => {
                  const updatedDate = new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => onNavigate(`/tickets/${ticket.id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-primary group-hover:underline">
                        {ticket.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                          {ticket.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <CategoryBadge category={ticket.category} showIcon={false} />
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {updatedDate}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-primary font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => onNavigate(`/tickets/${ticket.id}`)}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{ticket.id}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{ticket.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{ticket.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={ticket.category} showIcon={false} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
