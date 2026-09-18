import React from 'react';
import { Category, Priority, TicketStatus } from '../../types/helpdesk';
import { 
  Wifi, 
  Cpu, 
  UserCheck, 
  Printer, 
  AppWindow, 
  ShieldAlert, 
  HelpCircle,
  AlertCircle,
  Clock,
  CheckCircle2,
  User,
  ArrowUpRight,
  Bot
} from 'lucide-react';

export const CategoryBadge: React.FC<{ category: Category; showIcon?: boolean }> = ({ category, showIcon = true }) => {
  const configs: Record<Category, { label: string; icon: any; bg: string; text: string; border: string }> = {
    network: {
      label: 'Network',
      icon: Wifi,
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200'
    },
    performance: {
      label: 'Performance',
      icon: Cpu,
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200'
    },
    account: {
      label: 'Account & Access',
      icon: UserCheck,
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200'
    },
    hardware: {
      label: 'Hardware',
      icon: Printer,
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200'
    },
    software: {
      label: 'Software',
      icon: AppWindow,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    security: {
      label: 'Security',
      icon: ShieldAlert,
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200'
    },
    other: {
      label: 'General / Other',
      icon: HelpCircle,
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200'
    }
  };

  const config = configs[category] || configs.other;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const configs: Record<Priority, { label: string; bg: string; text: string; dot: string; border: string }> = {
    low: {
      label: 'Low',
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      border: 'border-slate-200'
    },
    medium: {
      label: 'Medium',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      border: 'border-blue-200'
    },
    high: {
      label: 'High',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      border: 'border-amber-200'
    },
    critical: {
      label: 'Critical',
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-600',
      border: 'border-red-200'
    }
  };

  const config = configs[priority] || configs.medium;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const configs: Record<TicketStatus, { label: string; icon: any; bg: string; text: string; border: string }> = {
    open: {
      label: 'Open',
      icon: Clock,
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200'
    },
    ai_diagnosing: {
      label: 'AI Diagnosing',
      icon: Bot,
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200'
    },
    technician_assigned: {
      label: 'Technician Assigned',
      icon: User,
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200'
    },
    in_progress: {
      label: 'In Progress',
      icon: Clock,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    resolved: {
      label: 'Resolved',
      icon: CheckCircle2,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    escalated: {
      label: 'Escalated',
      icon: ArrowUpRight,
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200'
    }
  };

  const config = configs[status] || configs.open;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
