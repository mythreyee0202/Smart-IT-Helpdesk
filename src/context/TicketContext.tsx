import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Ticket,
  KnowledgeArticle,
  Category,
  Priority,
  DeviceType,
  TicketStatus
} from '../types/helpdesk';
import { StorageService, DEMO_USERS } from '../services/storageService';
import { analyzeProblemWithPython } from '../services/aiEngine';
import { useToast } from './ToastContext';

interface CreateTicketParams {
  description: string;
  device: DeviceType;
  category?: Category | 'detect';
  priority?: Priority | 'detect';
  screenshotName?: string;
  screenshotUrl?: string;
  visionAnalysis?: string;
}

interface TicketContextType {
  tickets: Ticket[];
  knowledgeArticles: KnowledgeArticle[];
  createTicket: (params: CreateTicketParams) => Promise<Ticket>;
  getTicket: (id: string) => Ticket | undefined;
  updateTicketStatus: (id: string, status: TicketStatus, actorName?: string) => void;
  toggleTroubleshootingStep: (ticketId: string, stepId: string) => void;
  escalateTicket: (ticketId: string, customSummary?: string) => void;
  resolveTicketWithFeedback: (ticketId: string, rating: number, comment?: string) => void;
  addTechnicianNote: (ticketId: string, content: string, technicianName: string) => void;
  assignTechnician: (ticketId: string, technicianName: string, technicianTitle?: string) => void;
  resetDemoData: () => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => StorageService.getTickets());
  const [knowledgeArticles] = useState<KnowledgeArticle[]>(() => StorageService.getKnowledgeArticles());
  const { addToast } = useToast();

  useEffect(() => {
    StorageService.saveTickets(tickets);
  }, [tickets]);

  const getTicket = useCallback((id: string) => {
    return tickets.find(t => t.id === id);
  }, [tickets]);

  const createTicket = useCallback(async (params: CreateTicketParams): Promise<Ticket> => {
    const analysis = await analyzeProblemWithPython(
      params.description,
      params.device,
      params.category,
      params.priority
    );

    // Generate next Ticket ID, e.g. IT-1043
    const nextNum = tickets.reduce((max, t) => {
      const match = t.id.match(/IT-(\d+)/);
      if (match) {
        return Math.max(max, parseInt(match[1], 10));
      }
      return max;
    }, 1042) + 1;

    const ticketId = `IT-${nextNum}`;
    const now = new Date().toISOString();

    // Derive a clean title from detected issue or description
    const title = analysis.detectedIssue || (params.description.length > 40 ? params.description.substring(0, 40) + '...' : params.description);

    const newTicket: Ticket = {
      id: ticketId,
      title,
      description: params.description,
      category: analysis.category,
      priority: analysis.priority,
      status: 'ai_diagnosing',
      device: params.device,
      createdAt: now,
      updatedAt: now,
      userId: DEMO_USERS.user.id,
      userName: DEMO_USERS.user.name,
      userEmail: DEMO_USERS.user.email,
      screenshotName: params.screenshotName,
      screenshotUrl: params.screenshotUrl,
      visionAnalysis: params.visionAnalysis,
      aiAnalysis: analysis,
      events: [
        {
          id: `ev-${Date.now()}-1`,
          timestamp: now,
          description: 'Ticket created by user',
          actor: DEMO_USERS.user.name,
          type: 'created'
        },
        {
          id: `ev-${Date.now()}-2`,
          timestamp: new Date(Date.now() + 500).toISOString(),
          description: `AI Diagnosis complete: ${analysis.detectedIssue} (${analysis.confidence}% confidence)`,
          actor: 'Smart IT AI Engine',
          type: 'diagnosed'
        }
      ],
      notes: []
    };

    setTickets(prev => [newTicket, ...prev]);
    addToast({
      type: 'info',
      title: `Ticket ${ticketId} Created`,
      message: 'AI diagnosis generated with tailored troubleshooting steps.'
    });

    return newTicket;
  }, [tickets, addToast]);

  const updateTicketStatus = useCallback((id: string, status: TicketStatus, actorName: string = 'Alex Morgan') => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== id) return t;

      const readableStatus = status.replace('_', ' ').toUpperCase();
      const updatedEvents = [
        ...t.events,
        {
          id: `ev-${Date.now()}`,
          timestamp: now,
          description: `Status changed to ${readableStatus}`,
          actor: actorName,
          type: 'status_changed' as const
        }
      ];

      return {
        ...t,
        status,
        updatedAt: now,
        events: updatedEvents
      };
    }));

    addToast({
      type: 'success',
      title: 'Status Updated',
      message: `Ticket ${id} is now ${status.replace('_', ' ')}.`
    });
  }, [addToast]);

  const toggleTroubleshootingStep = useCallback((ticketId: string, stepId: string) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId || !t.aiAnalysis) return t;

      let changedStepTitle = '';
      let isNowCompleted = false;

      const updatedSteps = t.aiAnalysis.troubleshootingSteps.map(step => {
        if (step.id === stepId) {
          isNowCompleted = !step.completed;
          changedStepTitle = step.title;
          return { ...step, completed: isNowCompleted };
        }
        return step;
      });

      const updatedEvents = [
        ...t.events,
        {
          id: `ev-${Date.now()}`,
          timestamp: now,
          description: isNowCompleted
            ? `Step marked done: "${changedStepTitle}"`
            : `Step unmarked: "${changedStepTitle}"`,
          actor: t.userName,
          type: 'step_completed' as const
        }
      ];

      return {
        ...t,
        updatedAt: now,
        aiAnalysis: {
          ...t.aiAnalysis,
          troubleshootingSteps: updatedSteps
        },
        events: updatedEvents
      };
    }));
  }, []);

  const escalateTicket = useCallback((ticketId: string, customSummary?: string) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const completedCount = t.aiAnalysis?.troubleshootingSteps.filter(s => s.completed).length || 0;
      const totalCount = t.aiAnalysis?.troubleshootingSteps.length || 0;

      const updatedEvents = [
        ...t.events,
        {
          id: `ev-${Date.now()}-1`,
          timestamp: now,
          description: `User completed ${completedCount}/${totalCount} diagnostic steps. Automated troubleshooting unresolved.`,
          actor: t.userName,
          type: 'step_completed' as const
        },
        {
          id: `ev-${Date.now()}-2`,
          timestamp: new Date(Date.now() + 200).toISOString(),
          description: 'Ticket escalated to Human IT Technician queue with AI triage summary.',
          actor: 'Smart IT AI Dispatcher',
          type: 'escalated' as const
        },
        {
          id: `ev-${Date.now()}-3`,
          timestamp: new Date(Date.now() + 400).toISOString(),
          description: `Assigned to ${DEMO_USERS.technician.name} (${DEMO_USERS.technician.title})`,
          actor: 'IT Triage Dispatcher',
          type: 'assigned' as const
        }
      ];

      return {
        ...t,
        status: 'technician_assigned',
        assignedTechnician: DEMO_USERS.technician.name,
        technicianTitle: DEMO_USERS.technician.title,
        updatedAt: now,
        events: updatedEvents,
        aiAnalysis: t.aiAnalysis ? {
          ...t.aiAnalysis,
          technicianSummary: customSummary || t.aiAnalysis.technicianSummary,
          escalationRequired: true
        } : undefined
      };
    }));

    addToast({
      type: 'warning',
      title: 'Escalated to IT Support',
      message: `Ticket ${ticketId} assigned to ${DEMO_USERS.technician.name}.`
    });
  }, [addToast]);

  const resolveTicketWithFeedback = useCallback((ticketId: string, rating: number, comment?: string) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const updatedEvents = [
        ...t.events,
        {
          id: `ev-${Date.now()}`,
          timestamp: now,
          description: `Ticket successfully resolved by user (${rating} ★ rating submitted)`,
          actor: t.userName,
          type: 'resolved' as const
        }
      ];

      return {
        ...t,
        status: 'resolved',
        updatedAt: now,
        events: updatedEvents,
        feedback: {
          rating,
          comment,
          submittedAt: now
        }
      };
    }));

    addToast({
      type: 'success',
      title: 'Ticket Resolved!',
      message: 'Thank you for your feedback. The ticket has been closed.'
    });
  }, [addToast]);

  const addTechnicianNote = useCallback((ticketId: string, content: string, technicianName: string) => {
    const now = new Date().toISOString();
    const newNote = {
      id: `note-${Date.now()}`,
      technicianName,
      content,
      createdAt: now
    };

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const updatedEvents = [
        ...t.events,
        {
          id: `ev-${Date.now()}`,
          timestamp: now,
          description: `Technician note added by ${technicianName}`,
          actor: technicianName,
          type: 'note_added' as const
        }
      ];

      return {
        ...t,
        updatedAt: now,
        notes: [newNote, ...t.notes],
        events: updatedEvents
      };
    }));

    addToast({
      type: 'info',
      title: 'Note Added',
      message: 'Technician note saved to ticket record.'
    });
  }, [addToast]);

  const assignTechnician = useCallback((ticketId: string, technicianName: string, technicianTitle?: string) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const updatedEvents = [
        ...t.events,
        {
          id: `ev-${Date.now()}`,
          timestamp: now,
          description: `Assigned to ${technicianName}`,
          actor: 'IT Triage Dispatcher',
          type: 'assigned' as const
        }
      ];

      return {
        ...t,
        assignedTechnician: technicianName,
        technicianTitle: technicianTitle || 'IT Support Specialist',
        status: t.status === 'open' || t.status === 'ai_diagnosing' ? 'technician_assigned' : t.status,
        updatedAt: now,
        events: updatedEvents
      };
    }));

    addToast({
      type: 'info',
      title: 'Technician Assigned',
      message: `Ticket ${ticketId} assigned to ${technicianName}.`
    });
  }, [addToast]);

  const resetDemoData = useCallback(() => {
    StorageService.resetDemoData();
    setTickets(StorageService.getTickets());
    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All tickets and logs restored to initial clean demo state.'
    });
  }, [addToast]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        knowledgeArticles,
        createTicket,
        getTicket,
        updateTicketStatus,
        toggleTroubleshootingStep,
        escalateTicket,
        resolveTicketWithFeedback,
        addTechnicianNote,
        assignTechnician,
        resetDemoData
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
