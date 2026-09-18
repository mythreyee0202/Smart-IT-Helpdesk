import React, { useState } from 'react';
import { Headphones, Sparkles, User, ShieldCheck, ArrowRight, CheckCircle2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginAs, loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const isTech = loginWithCredentials(email);
    if (email.toLowerCase().includes('support') || email.toLowerCase().includes('tech')) {
      onNavigate('/technician');
    } else {
      onNavigate('/dashboard');
    }
  };

  const handleDemoUser = () => {
    loginAs('user');
    onNavigate('/dashboard');
  };

  const handleDemoTechnician = () => {
    loginAs('technician');
    onNavigate('/technician');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-elevated mb-4">
          <Headphones className="w-7 h-7" />
          <Sparkles className="w-4 h-4 -top-1 -right-1 relative text-amber-300" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Smart IT Helpdesk
        </h1>
        <p className="text-sm font-semibold text-primary mt-1">
          Resolve IT problems faster.
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          AI-powered diagnosis and intelligent IT support for modern enterprise teams.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-2xl border border-slate-200">
          {/* Standard Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-subtle transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">
                Demo Access (No password required)
              </span>
            </div>
          </div>

          {/* 1-Click Demo Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDemoUser}
              type="button"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-primary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">
                    Continue as User
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    alex@company.com (Employee)
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={handleDemoTechnician}
              type="button"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    Continue as IT Technician
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    it.support@company.com (Priya Sharma)
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fully functional offline prototype • Local state persistent</span>
          </div>
        </div>
      </div>
    </div>
  );
};
