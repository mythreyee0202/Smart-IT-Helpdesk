import React, { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  title?: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  title,
  subtitle
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-dark flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onNavigate={onNavigate}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>
    </div>
  );
};
