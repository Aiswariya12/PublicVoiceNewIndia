import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Users2, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react';
import { getAnalyticsSummaryApi } from '../api/analytics';

export function StatsSummary() {
  const { data: stats, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: getAnalyticsSummaryApi,
    refetchInterval: 30000,
  });

  const cards = [
    {
      title: 'Total Grievances',
      value: stats?.totalReported ?? 0,
      icon: ClipboardList,
      gradient: 'from-orange-500/10 to-amber-500/5',
      border: 'border-orange-200 dark:border-orange-900/40',
      iconColor: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40',
      tag: 'Logged',
      tagColor: 'text-orange-600 bg-orange-100 dark:bg-orange-950/60 dark:text-orange-400',
    },
    {
      title: 'Pending Action',
      value: stats?.pending ?? 0,
      icon: Clock,
      gradient: 'from-amber-500/10 to-yellow-500/5',
      border: 'border-amber-200 dark:border-amber-900/40',
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      tag: 'Verification',
      tagColor: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      title: 'Govt. Resolved',
      value: stats?.resolvedByGovt ?? 0,
      icon: CheckCircle2,
      gradient: 'from-blue-500/10 to-indigo-500/5',
      border: 'border-blue-200 dark:border-blue-900/40',
      iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
      tag: 'Municipal Fix',
      tagColor: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: 'Community Resolved',
      value: stats?.resolvedByCommunity ?? 0,
      icon: Users2,
      gradient: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-200 dark:border-emerald-900/40',
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      tag: 'Citizen Drives',
      tagColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
            National Civic Pulse
          </h2>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin text-orange-500' : ''}`} />
          <span>Live Sync</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className={`rounded-2xl bg-white dark:bg-slate-900 p-3.5 border ${card.border} shadow-2xs flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl ${card.iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                {isLoading ? (
                  <div className="h-7 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                ) : (
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {card.value}
                  </div>
                )}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${card.tagColor}`}>
                  {card.tag}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
