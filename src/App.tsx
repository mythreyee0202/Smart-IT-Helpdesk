import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboard';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { DiagnosisPage } from './pages/DiagnosisPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Clean hash-based routing with window.location synchronization
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    return isAuthenticated ? (user?.role === 'technician' ? '/technician' : '/dashboard') : '/login';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentPath(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not logged in, show login page
  if (!isAuthenticated || currentPath === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  // Route matching logic
  let pageContent: React.ReactNode = null;
  let pageTitle = 'Dashboard';
  let pageSubtitle = 'AI Diagnostic Support';

  // 1. Diagnosis detail route: /diagnosis/:ticketId
  if (currentPath.startsWith('/diagnosis/')) {
    const ticketId = currentPath.replace('/diagnosis/', '');
    pageTitle = `AI Diagnosis: ${ticketId}`;
    pageSubtitle = 'Automated root cause isolation and troubleshooting';
    pageContent = <DiagnosisPage ticketId={ticketId} onNavigate={navigate} />;
  }
  // 2. Ticket detail route: /tickets/:ticketId or /technician/tickets/:ticketId
  else if (currentPath.startsWith('/tickets/') || currentPath.startsWith('/technician/tickets/')) {
    const ticketId = currentPath.replace('/technician/tickets/', '').replace('/tickets/', '');
    pageTitle = `Ticket Record: ${ticketId}`;
    pageSubtitle = 'Resolution timeline and technician logs';
    pageContent = <TicketDetailsPage ticketId={ticketId} onNavigate={navigate} />;
  }
  // 3. Knowledge base article: /knowledge-base/:articleId
  else if (currentPath.startsWith('/knowledge-base/') && currentPath !== '/knowledge-base') {
    const articleId = currentPath.replace('/knowledge-base/', '');
    pageTitle = 'Knowledge Base Guide';
    pageSubtitle = 'Standard operating procedure & diagnostic tree';
    pageContent = <ArticleDetailPage articleId={articleId} onNavigate={navigate} />;
  }
  // 4. Report Problem: /report
  else if (currentPath === '/report') {
    pageTitle = 'Report an IT Problem';
    pageSubtitle = 'Describe your issue in normal language for AI analysis';
    pageContent = <ReportProblemPage onNavigate={navigate} />;
  }
  // 5. My Tickets / All Tickets: /tickets
  else if (currentPath === '/tickets') {
    pageTitle = user?.role === 'technician' ? 'All Tickets Queue' : 'My Support Tickets';
    pageSubtitle = 'Real-time status tracking and history';
    pageContent = <MyTicketsPage onNavigate={navigate} />;
  }
  // 6. Knowledge Base list: /knowledge-base
  else if (currentPath === '/knowledge-base') {
    pageTitle = 'Knowledge Base';
    pageSubtitle = 'Self-service guides and hardware/network manuals';
    pageContent = <KnowledgeBasePage onNavigate={navigate} />;
  }
  // 7. Analytics: /analytics
  else if (currentPath === '/analytics') {
    pageTitle = 'Operational Analytics';
    pageSubtitle = 'Diagnostic metrics, MTTR, and AI resolution rates';
    pageContent = <AnalyticsPage onNavigate={navigate} />;
  }
  // 8. Technician Console: /technician
  else if (currentPath === '/technician') {
    pageTitle = 'IT Support Console';
    pageSubtitle = 'Tier-2 triage, AI summaries, and priority dispatch';
    pageContent = <TechnicianDashboard onNavigate={navigate} />;
  }
  // 9. Default User Dashboard: /dashboard
  else {
    pageTitle = 'Employee Support Dashboard';
    pageSubtitle = `Welcome back, ${user?.name}`;
    pageContent = <UserDashboard onNavigate={navigate} />;
  }

  return (
    <Layout
      currentPath={currentPath}
      onNavigate={navigate}
      title={pageTitle}
      subtitle={pageSubtitle}
    >
      {pageContent}
    </Layout>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TicketProvider>
          <AppContent />
        </TicketProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
