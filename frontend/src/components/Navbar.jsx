import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  PlusSquare, 
  BarChart3, 
  LogOut, 
  LogIn, 
  Sparkles,
  ChevronDown,
  Layers,
  Sun,
  Moon,
  Search,
  Heart,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'CITIZEN', label: 'Citizen', desc: 'Report issues & track progress', icon: UserCheck, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700' },
  { id: 'OFFICER', label: 'Officer', desc: 'Review & resolve civic complaints', icon: ShieldCheck, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700' },
  { id: 'VERIFIER', label: 'Verifier', desc: 'Inspect & verify legitimacy', icon: Building2, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700' },
  { id: 'ADMIN', label: 'Admin', desc: 'System supervision & analytics', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700' },
];

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenCreateModal, 
  onOpenAuthModal, 
  isDark, 
  toggleTheme,
  searchQuery,
  setSearchQuery
}) {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentRoleInfo = ROLES.find((r) => r.id === user?.role) || ROLES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Instagram-style Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => setActiveTab('feed')}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-xs shadow-orange-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-lg font-black bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500 bg-clip-text text-transparent">
                PV
              </span>
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-serif italic">
              Public Voice
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block not-italic"></span>
            </span>
            <span className="text-[10px] font-sans font-semibold tracking-wider text-slate-400 uppercase hidden sm:block -mt-1">
              New India • Civic Portal
            </span>
          </div>
        </div>

        {/* Center Search Bar (like Instagram Web) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              id="instagram-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grievances, PIN codes, wards..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/40 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle Button (Sun / Moon) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
            title={isDark ? "Switch to White Light Theme" : "Switch to Night Dark Theme"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </motion.button>

          {/* Desktop Tab Switcher (Feed vs Analytics) */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${currentRoleInfo.color}`}
              title="Click to test different roles (Citizen, Officer, Verifier)"
            >
              <currentRoleInfo.icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Switch Role</p>
                    <p className="text-[11px] text-slate-400">Test role-specific workflows</p>
                  </div>
                  <div className="p-1 space-y-1">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isActive = user?.role === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => {
                            switchRole(r.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                            isActive
                              ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${r.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold flex items-center gap-1.5">
                              {r.label}
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 leading-tight">
                              {r.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* New Issue + Post Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/20 transition-all border border-orange-400/30"
          >
            <PlusSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Report Issue</span>
          </motion.button>

          {/* Profile / Auth Avatar */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 p-1 rounded-full hover:ring-2 hover:ring-orange-500 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
