import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, PlusSquare, BarChart2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function MobileBottomBar({ activeTab, setActiveTab, onOpenCreateModal, onOpenAuthModal }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 md:hidden transition-colors shadow-lg">
      <div className="flex items-center justify-around h-15 px-2">
        
        {/* Home / Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'feed'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Feed</span>
        </button>

        {/* Explore / Search */}
        <button
          onClick={() => {
            setActiveTab('feed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const searchInput = document.getElementById('instagram-search-input');
            if (searchInput) searchInput.focus();
          }}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-500 dark:text-slate-400"
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>

        {/* Center + Post Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onOpenCreateModal}
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-emerald-500 text-white shadow-md shadow-orange-500/30"
          title="Report Civic Grievance"
        >
          <PlusSquare className="w-6 h-6" />
        </motion.button>

        {/* Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Analytics</span>
        </button>

        {/* Profile */}
        <button
          onClick={onOpenAuthModal}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-500 dark:text-slate-400"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600">
            {user?.fullName?.charAt(0) || <User className="w-3.5 h-3.5" />}
          </div>
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>

      </div>
    </nav>
  );
}
