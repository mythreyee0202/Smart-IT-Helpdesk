import React from 'react';
import { Menu, Search, Bot, Bell, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigate: (path: string) => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onNavigate,
  title,
  subtitle
}) => {
  const { user, switchRole } = useAuth();
  const isTech = user?.role === 'technician';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right side: Global search & Action buttons */}
      <div className="flex items-center gap-3">
        {/* Knowledge Base Quick Search */}
        <button
          onClick={() => onNavigate('/knowledge-base')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-xs font-medium border border-slate-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search solutions & articles...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white rounded border border-slate-300 text-slate-400 font-mono">⌘K</kbd>
        </button>

        {/* AI Engine Status Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Bot className="w-3.5 h-3.5" />
          <span>AI Engine Active</span>
        </div>

        {/* Persona Switch button */}
        <button
          onClick={switchRole}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all shadow-2xs"
          title={`Click to switch to ${isTech ? 'User (Alex)' : 'Technician (Priya)'}`}
        >
          {isTech ? <Shield className="w-3.5 h-3.5 text-amber-600" /> : <User className="w-3.5 h-3.5 text-primary" />}
          <span className="hidden sm:inline">Role:</span>
          <span className={isTech ? 'text-amber-700 font-bold' : 'text-primary font-bold'}>
            {isTech ? 'IT Technician' : 'User'}
          </span>
        </button>
      </div>
    </header>
  );
};
