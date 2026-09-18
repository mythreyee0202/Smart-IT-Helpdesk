import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Wrench, 
  FileText, 
  Bot, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight,
  Send,
  AlertCircle,
  HelpCircle,
  Laptop
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/common/Badge';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';
import { StarRating } from '../components/common/StarRating';
import { TicketStatus } from '../types/helpdesk';

interface TicketDetailsPageProps {
  ticketId: string;
  onNavigate: (path: string) => void;
}

export const TicketDetailsPage: React.FC<TicketDetailsPageProps> = ({ ticketId, onNavigate }) => {
  const { getTicket, updateTicketStatus, addTechnicianNote, assignTechnician } = useTickets();
  const { user } = useAuth();
  const isTech = user?.role === 'technician';

  const ticket = getTicket(ticketId);
  const [newNote, setNewNote] = useState('');
  const [statusSelection, setStatusSelection] = useState<TicketStatus>(ticket?.status || 'open');

  if (!ticket) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Ticket Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested ticket <span className="font-mono font-bold">{ticketId}</span> does not exist.
        </p>
        <button
          onClick={() => onNavigate('/tickets')}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addTechnicianNote(ticket.id, newNote.trim(), user?.name || 'IT Support');
    setNewNote('');
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    setStatusSelection(newStatus);
    updateTicketStatus(ticket.id, newStatus, user?.name || 'Technician');
  };

  const handleSelfAssign = () => {
    assignTechnician(ticket.id, user?.name || 'Priya Sharma', user?.title || 'Senior IT Specialist');
  };

  const formattedCreated = new Date(ticket.createdAt).toLocaleString([], { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
  const formattedUpdated = new Date(ticket.updatedAt).toLocaleString([], { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Header Back & Actions */}
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
              <span className="font-mono text-sm font-bold text-primary">{ticket.id}</span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {ticket.title}
            </h1>
          </div>
        </div>

        {/* Action Button: Jump to AI Diagnosis or Technician console */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {ticket.status === 'ai_diagnosing' && (
            <button
              onClick={() => onNavigate(`/diagnosis/${ticket.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-subtle transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Resume AI Diagnosis</span>
            </button>
          )}
        </div>
      </div>

      {/* METADATA SUMMARY BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Category</span>
          <div className="mt-1">
            <CategoryBadge category={ticket.category} />
          </div>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Device</span>
          <span className="font-semibold text-slate-800 capitalize mt-1 block">
            {ticket.device}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Reported By</span>
          <span className="font-semibold text-slate-800 mt-1 block">
            {ticket.userName}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Last Activity</span>
          <span className="font-semibold text-slate-800 mt-1 block">
            {formattedUpdated}
          </span>
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT: DETAILS + TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLUMNS: PROBLEM, AI DIAGNOSIS & TECHNICIAN NOTES */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROBLEM DESCRIPTION CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Problem Description
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed font-sans">
              {ticket.description}
            </p>

            {/* Attached Screenshot if any */}
            {ticket.screenshotUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Attached Error Screenshot:
                </span>
                <div className="max-h-60 rounded-xl overflow-hidden border border-slate-200 bg-slate-950/5 flex items-center justify-center">
                  <img
                    src={ticket.screenshotUrl}
                    alt={ticket.screenshotName || 'Error Screenshot'}
                    className="max-h-60 w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI DIAGNOSIS CARD */}
          {ticket.aiAnalysis && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary-light text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    AI Diagnosis & Root Cause Assessment
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate(`/diagnosis/${ticket.id}`)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Interactive checklist →
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {ticket.aiAnalysis.summary}
              </p>

              {/* Likely Causes */}
              {ticket.aiAnalysis.possibleCauses && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Likely Root Causes:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
                    {ticket.aiAnalysis.possibleCauses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Confidence Meter */}
              <div className="pt-2 border-t border-slate-100">
                <ConfidenceMeter confidence={ticket.aiAnalysis.confidence} showLabel={true} />
              </div>
            </div>
          )}

          {/* AI TECHNICIAN SUMMARY CARD */}
          <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-dark">
              <Bot className="w-4 h-4 text-primary" />
              <span>AI Automated Technician Handover Summary</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              {ticket.aiAnalysis?.technicianSummary || 'Issue recorded in queue. Standard triage protocols apply.'}
            </p>
          </div>

          {/* RESOLUTION FEEDBACK (IF RESOLVED) */}
          {ticket.feedback && (
            <div className="bg-emerald-50/80 rounded-2xl border border-emerald-200 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  User Resolution Feedback
                </span>
                <StarRating value={ticket.feedback.rating} readonly size="sm" />
              </div>
              {ticket.feedback.comment && (
                <p className="text-xs text-emerald-900 italic">
                  "{ticket.feedback.comment}"
                </p>
              )}
            </div>
          )}

          {/* TECHNICIAN NOTES SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Technician Notes & Triage Logs
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {ticket.notes.length} notes
              </span>
            </div>

            {/* Note Editor Form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={isTech ? "Add internal technical note or diagnosis update..." : "Add a comment..."}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${
                    newNote.trim() ? 'bg-primary hover:bg-primary-hover' : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>Post Note</span>
                </button>
              </div>
            </form>

            {/* Existing Notes List */}
            <div className="space-y-3 pt-2">
              {ticket.notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  No technician notes recorded yet.
                </p>
              ) : (
                ticket.notes.map(note => (
                  <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-slate-800">{note.technicianName}</span>
                      <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ASSIGNED TECH + VERTICAL TIMELINE */}
        <div className="space-y-6">
          {/* ASSIGNED TECHNICIAN CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assigned Specialist
            </h3>

            {ticket.assignedTechnician ? (
              <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                  PS
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">
                    {ticket.assignedTechnician}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {ticket.technicianTitle || 'Senior IT Systems Specialist'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                <p className="text-xs text-slate-500">
                  Unassigned • In AI Automated Triage
                </p>
                {isTech && (
                  <button
                    onClick={handleSelfAssign}
                    className="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Assign to Myself
                  </button>
                )}
              </div>
            )}

            {/* Quick Status Selector for Technician Role */}
            {isTech && (
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Update Status (Technician)
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                >
                  <option value="open">Open</option>
                  <option value="ai_diagnosing">AI Diagnosing</option>
                  <option value="technician_assigned">Technician Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>
            )}
          </div>

          {/* VERTICAL TIMELINE HISTORY */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Troubleshooting History</span>
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {ticket.events.map((event, idx) => {
                let dotColor = 'bg-slate-400 ring-slate-100';
                if (event.type === 'created') dotColor = 'bg-blue-500 ring-blue-100';
                if (event.type === 'diagnosed') dotColor = 'bg-indigo-500 ring-indigo-100';
                if (event.type === 'step_completed') dotColor = 'bg-sky-500 ring-sky-100';
                if (event.type === 'escalated') dotColor = 'bg-amber-500 ring-amber-100';
                if (event.type === 'assigned') dotColor = 'bg-amber-600 ring-amber-100';
                if (event.type === 'resolved') dotColor = 'bg-emerald-500 ring-emerald-100';

                const timeStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={event.id || idx} className="relative group text-xs">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-6 top-0.5 w-2.5 h-2.5 rounded-full ring-4 ${dotColor}`} />
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                      <span className="font-mono">{timeStr}</span>
                      <span className="font-medium text-slate-500 truncate max-w-[110px]">{event.actor}</span>
                    </div>
                    <div className="text-slate-800 font-medium leading-snug">
                      {event.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
