import React, { useState, useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusSquare, 
  Inbox, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { getAllIssuesApi } from './api/issues';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { BackendStatusBanner } from './components/BackendStatusBanner';
import { StoryHighlights } from './components/StoryHighlights';
import { StatsSummary } from './components/StatsSummary';
import { IssueFilterBar } from './components/IssueFilterBar';
import { InstagramIssueCard } from './components/InstagramIssueCard';
import { RightSidebar } from './components/RightSidebar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { CreateIssueModal } from './components/CreateIssueModal';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { AuthModal } from './components/AuthModal';
import { AnalyticsView } from './components/AnalyticsView';
import { ToastContainer } from './components/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function CivicPortalContent() {
  const { user, isAuthenticated } = useAuth();

  // Theme State: Default is Light (White) as requested
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pvi_theme') || 'light';
  });

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('pvi_theme', nextTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Navigation and Modal States
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'analytics'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedIssueForDetail, setSelectedIssueForDetail] = useState(null);
  const [selectedIssueForStatus, setSelectedIssueForStatus] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');

  // Custom Toast State
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // TanStack Query for Issues (enabled only when authenticated)
  const { 
    data: issues = [], 
    isLoading: isIssuesLoading, 
    refetch: refetchIssues 
  } = useQuery({
    queryKey: ['issues'],
    queryFn: getAllIssuesApi,
    enabled: isAuthenticated,
  });

  // Filter and Sort Processing
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // 1. Status Filter
      if (selectedStatus !== 'ALL' && issue.status !== selectedStatus) {
        return false;
      }
      // 2. Category Filter
      if (selectedCategory) {
        if (selectedCategory === 'RESOLVED') {
          if (issue.status !== 'RESOLVED') return false;
        } else if (issue.category !== selectedCategory) {
          return false;
        }
      }
      // 3. Resolution Source Filter
      if (selectedSource !== 'ALL' && issue.resolutionSource !== selectedSource) {
        return false;
      }
      // 4. Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = issue.title?.toLowerCase().includes(query);
        const descMatch = issue.description?.toLowerCase().includes(query);
        const locMatch = issue.locationName?.toLowerCase().includes(query);
        const reporterMatch = issue.reporterName?.toLowerCase().includes(query);
        const catMatch = issue.category?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !locMatch && !reporterMatch && !catMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.reportedAt || 0).getTime();
      const dateB = new Date(b.reportedAt || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [issues, selectedStatus, selectedCategory, selectedSource, searchQuery, sortOrder]);

  // 1. FIRST SHOW LOGIN PAGE IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage
          isDark={isDark}
          toggleTheme={toggleTheme}
          showToast={showToast}
        />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // 2. AFTER LOGIN, SHOW THE ATTRACTIVE DASHBOARD
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Real-time Backend Connectivity Status Banner */}
      <BackendStatusBanner />

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Instagram-style Story Highlights Bar */}
      {activeTab === 'feed' && (
        <StoryHighlights
          activeCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Main Content Layout (Feed + Right Sidebar on Desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start justify-center gap-8"
            >
              {/* Center Feed Column (Instagram Card Width) */}
              <div className="w-full max-w-xl space-y-5">
                
                {/* Stats Summary Cards */}
                <StatsSummary />

                {/* Filter and Sorting Pills */}
                <IssueFilterBar
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  totalCount={issues.length}
                  filteredCount={filteredIssues.length}
                />

                {/* Issues Feed */}
                {isIssuesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-pulse shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                          </div>
                        </div>
                        <div className="aspect-16/10 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredIssues.length > 0 ? (
                  <div className="space-y-6">
                    <AnimatePresence>
                      {filteredIssues.map((issue) => (
                        <InstagramIssueCard
                          key={issue.id}
                          issue={issue}
                          onSelect={(item) => setSelectedIssueForDetail(item)}
                          onUpdateStatus={(item) => setSelectedIssueForStatus(item)}
                          showToast={showToast}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Empty State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-14 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                  >
                    <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-3">
                      <Inbox className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      No Civic Grievances Found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-xs mx-auto">
                      {searchQuery || selectedCategory || selectedStatus !== 'ALL'
                        ? 'No complaints match your active filters. Try clearing them to view the complete public record.'
                        : 'No grievances reported yet in this category. Be the first citizen to report!'}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      {(searchQuery || selectedCategory || selectedStatus !== 'ALL') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('');
                            setSelectedStatus('ALL');
                            setSelectedSource('ALL');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <PlusSquare className="w-4 h-4" />
                        <span>Post Grievance</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Right Sidebar (Desktop only) */}
              <RightSidebar
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            </motion.div>
          ) : (
            /* Analytics Dashboard Tab */
            <AnalyticsView key="analytics" />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Sticky Bottom Navigation (Instagram Style) */}
      <MobileBottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Floating Animated Modals */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateIssueModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIssueForStatus && (
          <StatusUpdateModal
            issue={selectedIssueForStatus}
            isOpen={!!selectedIssueForStatus}
            onClose={() => setSelectedIssueForStatus(null)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIssueForDetail && (
          <IssueDetailModal
            issue={selectedIssueForDetail}
            isOpen={!!selectedIssueForDetail}
            onClose={() => setSelectedIssueForDetail(null)}
            onUpdateStatus={(issue) => {
              setSelectedIssueForDetail(null);
              setSelectedIssueForStatus(issue);
            }}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CivicPortalContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
