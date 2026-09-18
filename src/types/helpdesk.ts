export type UserRole = 'user' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title: string;
}

export type Category = 
  | 'network'
  | 'performance'
  | 'account'
  | 'hardware'
  | 'software'
  | 'security'
  | 'other';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TicketStatus = 
  | 'open'
  | 'ai_diagnosing'
  | 'technician_assigned'
  | 'in_progress'
  | 'resolved'
  | 'escalated';

export type DeviceType = 'laptop' | 'desktop' | 'mobile' | 'printer' | 'other';

export interface TroubleshootingStep {
  id: string;
  number: string;
  title: string;
  explanation: string;
  codeSnippet?: string;
  completed: boolean;
}

export interface AIAnalysis {
  detectedIssue: string;
  category: Category;
  priority: Priority;
  confidence: number; // e.g. 92
  summary: string;
  possibleCauses: string[];
  troubleshootingSteps: TroubleshootingStep[];
  knowledgeBaseArticles: string[];
  escalationRequired: boolean;
  technicianSummary: string;
  analyzedAt: string;
}

export interface TechnicianNote {
  id: string;
  technicianName: string;
  content: string;
  createdAt: string;
}

export interface TicketEvent {
  id: string;
  timestamp: string;
  description: string;
  actor: string;
  type: 'created' | 'diagnosed' | 'step_completed' | 'escalated' | 'assigned' | 'status_changed' | 'note_added' | 'resolved';
}

export interface Feedback {
  rating: number; // 1 to 5
  comment?: string;
  submittedAt: string;
}

export interface Ticket {
  id: string; // e.g., 'IT-1042'
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TicketStatus;
  device: DeviceType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userEmail: string;
  assignedTechnician?: string;
  technicianTitle?: string;
  screenshotName?: string;
  screenshotUrl?: string;
  visionAnalysis?: string;
  aiAnalysis?: AIAnalysis;
  events: TicketEvent[];
  notes: TechnicianNote[];
  feedback?: Feedback;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: Category;
  estimatedTime: string;
  symptoms: string[];
  possibleCauses: string[];
  solutionSteps: {
    step: number;
    title: string;
    detail: string;
    command?: string;
  }[];
  whenToContactIT: string[];
  tags: string[];
}
