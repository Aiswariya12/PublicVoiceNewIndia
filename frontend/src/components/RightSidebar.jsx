import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Building2, TrendingUp, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  { name: 'Public Works Dept (PWD)', ward: 'Roads & Bridges', resolved: 48, rate: '92%' },
  { name: 'Jal Board (Water Supply)', ward: 'Pipelines & Supply', resolved: 36, rate: '88%' },
  { name: 'Municipal Sanitation Board', ward: 'Solid Waste Dept', resolved: 54, rate: '95%' },
  { name: 'Electricity & Lighting', ward: 'Zone 2 Infrastructure', resolved: 29, rate: '84%' },
];

export function RightSidebar({ onOpenCreateModal, onOpenAuthModal }) {
  const { user, switchRole, isAuthenticated } = useAuth();

  return (
    <aside className="w-80 shrink-0 hidden lg:block space-y-6 select-none">
      
      {/* 1. User Profile Mini Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-sm text-slate-800 dark:text-white">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[130px]">
                {user?.fullName || 'Citizen User'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                {user?.email || 'citizen@newindia.gov.in'}
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            {user?.role || 'CITIZEN'}
          </span>
        </div>

        {/* Quick Role Switch Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Switch Role to Test:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'CITIZEN', label: 'Citizen', icon: UserCheck },
              { id: 'OFFICER', label: 'Officer', icon: ShieldCheck },
              { id: 'VERIFIER', label: 'Verifier', icon: Building2 },
              { id: 'ADMIN', label: 'Admin', icon: Sparkles },
            ].map((r) => {
              const Icon = r.icon;
              const isActive = user?.role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Top Performing Municipal Departments */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Department Performance
            </h3>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
            Live
          </span>
        </div>

        <div className="space-y-3">
          {DEPARTMENTS.map((dept, idx) => (
            <div key={dept.name} className="flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                  <span className="truncate max-w-[160px]">{dept.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {dept.ward}
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {dept.rate}
                </span>
                <div className="text-[10px] text-slate-400">
                  {dept.resolved} fixed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Civic Helpline & Quick Rules */}
      <div className="bg-linear-to-br from-orange-500/10 via-amber-500/5 to-emerald-500/10 border border-orange-200 dark:border-orange-900/40 rounded-3xl p-5 shadow-xs text-xs space-y-2">
        <div className="font-bold text-orange-950 dark:text-orange-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>New India Grievance SLA</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
          Citizen complaints are automatically routed to municipal officers with a 48-hour verification target.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="w-full mt-2 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
        >
          <span>Report New Issue</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Footer Mini Links */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 space-y-2 px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:underline">About Portal</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Citizens Charter</a>
          <a href="#" className="hover:underline">Municipal Wards</a>
          <a href="#" className="hover:underline">API Docs</a>
        </div>
        <p>© 2026 Public Voice New India • Digital Governance</p>
      </div>

    </aside>
  );
}
