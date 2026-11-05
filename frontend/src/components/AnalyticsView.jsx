import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  Award, 
  Zap, 
  Clock, 
  Building2, 
  Users2, 
  Activity 
} from 'lucide-react';
import { getAnalyticsSummaryApi } from '../api/analytics';
import { getAllIssuesApi } from '../api/issues';

export function AnalyticsView() {
  const { data: stats } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: getAnalyticsSummaryApi,
  });

  const { data: issues = [] } = useQuery({
    queryKey: ['issues'],
    queryFn: getAllIssuesApi,
  });

  const total = stats?.totalReported || issues.length || 1;
  const resolvedGovt = stats?.resolvedByGovt || issues.filter(i => i.resolutionSource === 'GOVERNMENT_RESOLVED').length;
  const resolvedComm = stats?.resolvedByCommunity || issues.filter(i => i.resolutionSource === 'COMMUNITY_RESOLVED').length;
  const totalResolved = resolvedGovt + resolvedComm;
  const pendingCount = stats?.pending ?? issues.filter(i => i.status === 'PENDING').length;

  const resolutionRate = Math.round((totalResolved / (total || 1)) * 100);

  const categoryCounts = {
    ROAD: issues.filter(i => i.category === 'ROAD').length,
    WATER: issues.filter(i => i.category === 'WATER').length,
    GARBAGE: issues.filter(i => i.category === 'GARBAGE').length,
    STREETLIGHT: issues.filter(i => i.category === 'STREETLIGHT').length,
    OTHER: issues.filter(i => i.category === 'OTHER').length,
  };

  const categories = [
    { key: 'ROAD', label: 'Roads & Potholes', count: categoryCounts.ROAD, color: 'bg-amber-500', icon: '🛣️' },
    { key: 'WATER', label: 'Water Supply & Leakage', count: categoryCounts.WATER, color: 'bg-blue-500', icon: '💧' },
    { key: 'GARBAGE', label: 'Waste Management', count: categoryCounts.GARBAGE, color: 'bg-emerald-500', icon: '🗑️' },
    { key: 'STREETLIGHT', label: 'Street Lighting', count: categoryCounts.STREETLIGHT, color: 'bg-yellow-400', icon: '💡' },
    { key: 'OTHER', label: 'Other Civic Works', count: categoryCounts.OTHER, color: 'bg-purple-500', icon: '🏛️' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 dark:text-white"
    >
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Civic Impact & Governance Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time public grievance resolution rates, ward performance, and citizen impact telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 shadow-2xs">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Live National Data Stream</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Resolution Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Resolution Rate
            </span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              {resolutionRate}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Complaints Resolved
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${resolutionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>{totalResolved} resolved</span>
              <span>{total} total complaints</span>
            </div>
          </div>
        </div>

        {/* Govt vs Community */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Resolution Provenance
            </span>
            <Zap className="w-5 h-5 text-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Govt Action</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{resolvedGovt}</div>
              <div className="text-[10px] text-slate-500">Official Municipal</div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                <Users2 className="w-3.5 h-3.5" />
                <span>Community</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{resolvedComm}</div>
              <div className="text-[10px] text-slate-500">Citizen Projects</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Encouraging cooperative municipal governance and citizen initiatives
          </p>
        </div>

        {/* Verification Timeline */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Verification & SLA
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-2.5 my-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Awaiting Verification</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Work Crews Dispatched</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {issues.filter(i => i.status === 'IN_PROGRESS').length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Average SLA Target</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">48-72h</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
            Digital tracking ensures public officers remain accountable to citizens.
          </div>
        </div>

      </div>

      {/* Category Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <span>Distribution by Problem Category</span>
        </h3>

        <div className="space-y-4">
          {categories.map((cat) => {
            const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{cat.count} cases</span>
                    <span className="text-slate-900 dark:text-white font-bold">{pct}%</span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full ${cat.color} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </motion.div>
  );
}
