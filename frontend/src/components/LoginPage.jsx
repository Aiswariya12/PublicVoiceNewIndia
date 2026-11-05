import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Sun, 
  Moon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BackendStatusBanner } from './BackendStatusBanner';

export function LoginPage({ isDark, toggleTheme, showToast }) {
  const { login, register, loginWithDemo, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    const res = await login(email, password);
    if (res.success) {
      showToast('Welcome back! Signed in successfully.', 'success');
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName || !email || !password) {
      setErrorMsg('Please complete all fields to register');
      return;
    }
    const res = await register(fullName, email, password);
    if (res.success) {
      showToast('Citizen account created! Welcome to Public Voice New India.', 'success');
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  const handleQuickDemoClick = (role, demoEmail, demoName) => {
    loginWithDemo(role, demoEmail, demoName);
    showToast(`Quick logged in as ${demoName} (${role})`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Backend Status Top Bar */}
      <BackendStatusBanner />

      {/* Top Header with Theme Switcher */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-sm">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-sm text-orange-600 dark:text-orange-400">
              PV
            </div>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-serif italic">
              Public Voice
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block not-italic ml-1"></span>
            </span>
            <span className="block text-[9px] font-sans font-bold tracking-wider text-slate-400 uppercase -mt-0.5">
              New India • National Portal
            </span>
          </div>
        </div>

        {/* Theme Switcher */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Toggle White / Night Mode"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Night Mode</span>
            </>
          )}
        </motion.button>
      </header>

      {/* Main Dual-Column Instagram-Style Showcase & Login Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Instagram Phone Feed Mockup (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col items-center justify-center relative">
            
            {/* Phone Frame Mockup */}
            <div className="relative w-76 rounded-[40px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800 dark:border-slate-700 select-none">
              
              {/* Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20" />

              {/* Screen Content */}
              <div className="rounded-[30px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                
                {/* Mini App Header */}
                <div className="px-4 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-serif italic font-bold text-sm text-slate-900 dark:text-white">
                    Public Voice
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                {/* Mini Stories Bar */}
                <div className="flex gap-2.5 px-3 py-2 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
                  {['🛣️ Roads', '💧 Water', '🗑️ Waste', '💡 Lights'].map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full p-0.5 bg-linear-to-tr from-amber-500 via-orange-500 to-emerald-500">
                        <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sm">
                          {s.split(' ')[0]}
                        </div>
                      </div>
                      <span className="text-[8px] font-semibold text-slate-500 mt-0.5">{s.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>

                {/* Mini Post Card 1 */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[9px]">
                      A
                    </div>
                    <div>
                      <div className="font-bold text-[10px] text-slate-900 dark:text-white">Aarav Sharma</div>
                      <div className="text-[8px] text-slate-400">Sector 62, Noida • 2h ago</div>
                    </div>
                    <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      In Progress
                    </span>
                  </div>
                  <div className="h-24 rounded-xl bg-linear-to-br from-amber-500/15 via-orange-500/10 to-amber-600/20 p-2.5 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300">🛣️ Roads</span>
                    <p className="font-bold text-[10px] text-slate-900 dark:text-white line-clamp-2">
                      Deep crater potholes on main sector avenue resurfacing commenced.
                    </p>
                    <div className="text-[8px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-orange-500" />
                      <span>Noida, UP</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 pt-0.5 text-[9px]">
                    <span className="flex items-center gap-0.5 text-red-500 font-bold">
                      <Heart className="w-3 h-3 fill-red-500" /> 42
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3" /> 8
                    </span>
                    <span className="ml-auto text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">
                      PWD Assigned
                    </span>
                  </div>
                </div>

                {/* Mini Post Card 2 */}
                <div className="p-3 space-y-1.5 opacity-90">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[9px]">
                      P
                    </div>
                    <div>
                      <div className="font-bold text-[10px] text-slate-900 dark:text-white">Priya N.</div>
                      <div className="text-[8px] text-slate-400">Indiranagar, BLR</div>
                    </div>
                    <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Resolved
                    </span>
                  </div>
                  <div className="h-14 rounded-xl bg-linear-to-br from-blue-500/10 to-cyan-500/20 p-2 flex flex-col justify-between">
                    <p className="font-bold text-[9px] text-slate-800 dark:text-white">
                      Water pipeline burst repaired within 24 hours.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Floating Highlights Badges */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -left-6 top-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 backdrop-blur-md"
            >
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                  100% Transparent
                </div>
                <div className="text-[9px] text-slate-400">
                  Live Public Resolution Telemetry
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -right-6 bottom-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 backdrop-blur-md"
            >
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                  Multi-Role Portal
                </div>
                <div className="text-[9px] text-slate-400">
                  Citizens • Officers • Verifiers
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Instagram-Style Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto space-y-4">
            
            {/* The Main Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
              
              {/* Header Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif italic tracking-tight">
                  Public Voice
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block not-italic ml-1"></span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {activeTab === 'login'
                    ? 'Sign in to access your civic dashboard & file grievances'
                    : 'Create your citizen account for transparent governance'}
                </p>
              </div>

              {/* Tab Selector: Sign In / Create Account */}
              <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-5">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'login'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'register'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. citizen@newindia.gov.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>Sign In to Dashboard</span>
                  </button>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>Register Citizen Account</span>
                  </button>
                </form>
              )}

              {/* Instagram "OR" Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400">
                    OR 1-CLICK INSTANT TEST
                  </span>
                </div>
              </div>

              {/* 1-Click Fast Demo Logins */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mb-2">
                  Select any persona to test live features without manual typing:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoClick('CITIZEN', 'citizen@newindia.gov.in', 'Aarav Sharma')}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-left hover:bg-emerald-100 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Citizen</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Report Grievances
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoClick('OFFICER', 'officer.pwd@newindia.gov.in', 'Rajesh Verma (PWD)')}
                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-left hover:bg-blue-100 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Officer</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Update Issue Status
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoClick('VERIFIER', 'verifier.zone1@newindia.gov.in', 'Kavita Singh')}
                    className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-left hover:bg-amber-100 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Verifier</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Verify Reports
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoClick('ADMIN', 'admin@newindia.gov.in', 'Administrator')}
                    className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-left hover:bg-purple-100 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Admin</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Full System Access
                    </div>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Help Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center text-xs text-slate-500 dark:text-slate-400 shadow-2xs">
              <span>National Citizen Grievance Helpline: </span>
              <strong className="text-orange-600 dark:text-orange-400 font-bold">1913 (Toll Free)</strong>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <p>Public Voice New India • Government of India Citizen Engagement Portal</p>
      </footer>

    </div>
  );
}
