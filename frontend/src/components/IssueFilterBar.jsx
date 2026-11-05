import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, X, Sparkles } from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'ALL', label: 'All Feeds' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'VERIFIED', label: 'Verified' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'REJECTED', label: 'Closed' },
];

export function IssueFilterBar({
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  sortOrder,
  setSortOrder,
  totalCount,
  filteredCount,
}) {
  const hasActiveFilters = selectedStatus !== 'ALL' || selectedCategory !== '' || selectedSource !== 'ALL';

  const resetFilters = () => {
    setSelectedStatus('ALL');
    setSelectedCategory('');
    setSelectedSource('ALL');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Status Scrollable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = selectedStatus === status.id;
            return (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {/* Resolution Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="ALL">All Outcomes</option>
            <option value="GOVERNMENT_RESOLVED">Govt Action</option>
            <option value="COMMUNITY_RESOLVED">Community Drives</option>
            <option value="PENDING">Pending Fix</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3 h-3 text-orange-500" />
            <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-100 border border-orange-200 dark:border-orange-800"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="text-[11px] font-mono text-slate-400">
            {filteredCount}/{totalCount}
          </div>
        </div>

      </div>
    </div>
  );
}
