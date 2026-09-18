import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Ticket as TicketIcon, 
  BookOpen, 
  BarChart3, 
  Headphones, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  User as UserIcon,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpen,
  onClose
}) => {
  const { user, logout, switchRole } = useAuth();
  const { tickets, resetDemoData } = useTickets();

  const isTech = user?.role === 'technician';

  // Count active open/diagnosing/assigned tickets
  const activeTicketCount = tickets.filter(t => t.status !== 'resolved').length;

  const navItems = isTech
    ? [
        { label: 'IT Support Console', path: '/technician', icon: ShieldCheck, badge: activeTicketCount },
        { label: 'All Tickets Queue', path: '/tickets', icon: TicketIcon },
        { label: 'Report a Problem', path: '/report', icon: PlusCircle },
        { label: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Report Problem', path: '/report', icon: PlusCircle },
        { label: 'My Tickets', path: '/tickets', icon: TicketIcon, badge: activeTicketCount > 0 ? activeTicketCount : undefined },
        { label: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
      ];

  const handleNav = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => handleNav(isTech ? '/technician' : '/dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shadow-subtle group-hover:bg-primary-hover transition-colors">
                <Headphones className="w-5 h-5" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                  Smart IT Helpdesk
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {isTech ? 'Technician Portal' : 'AI Diagnostic Support'}
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Role Pill */}
          <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border ${
            isTech 
              ? 'bg-amber-50 text-amber-900 border-amber-200' 
              : 'bg-primary-light text-primary-dark border-blue-200'
          }`}>
            <span className="flex items-center gap-1.5 font-semibold">
              {isTech ? <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> : <UserIcon className="w-3.5 h-3.5 text-primary" />}
              {isTech ? 'Technician View' : 'Employee View'}
            </span>
            <button
              onClick={switchRole}
              className="underline text-[11px] hover:opacity-80 transition-opacity"
              title="Switch demo persona"
            >
              Switch
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path + '/'));

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-subtle'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Demo Reset Utility */}
          <div className="pt-6 px-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>Prototype State</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Live</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Data persists in browser localStorage. Click below to restore initial tickets.
              </p>
              <button
                onClick={resetDemoData}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-[11px] transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Profile & Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 truncate">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {user?.name || 'Alex Morgan'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {user?.title || 'Employee'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out / Change User"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
