import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  MapPin, 
  User, 
  CheckCircle2, 
  Wrench,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function IssueDetailModal({ issue, isOpen, onClose, onUpdateStatus, showToast }) {
  const { user } = useAuth();

  if (!isOpen || !issue) return null;

  const canManageStatus = ['OFFICER', 'VERIFIER', 'ADMIN'].includes(user?.role);

  const steps = [
    { key: 'PENDING', label: 'Reported', sub: 'Logged by Citizen' },
    { key: 'VERIFIED', label: 'Verified', sub: 'Inspected on-site' },
    { key: 'IN_PROGRESS', label: 'In Progress', sub: 'Work crew dispatched' },
    { key: 'RESOLVED', label: 'Resolved', sub: 'Repair completed' },
  ];

  const getStepState = (stepKey) => {
    const order = ['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED'];
    const currentIndex = order.indexOf(issue.status);
    const stepIndex = order.indexOf(stepKey);

    if (issue.status === 'REJECTED') {
      return stepKey === 'PENDING' ? 'done' : 'rejected';
    }

    if (currentIndex >= stepIndex) return 'done';
    if (currentIndex + 1 === stepIndex) return 'current';
    return 'upcoming';
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Grievance link copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden text-slate-900 dark:text-white"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40 px-2 py-0.5 rounded-md">
                PV-REF #{issue.id}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {issue.category}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {issue.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Timeline Visual Tracker */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
              Lifecycle Progress Timeline
            </h3>

            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((st, i) => {
                const state = getStepState(st.key);
                return (
                  <div key={st.key} className="flex flex-col items-center text-center relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                        state === 'done'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : state === 'current'
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {state === 'done' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {st.label}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      {st.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Citizen Description
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {issue.description}
            </div>
          </div>

          {/* Meta Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                Location
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {issue.locationName || 'Location Recorded'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-blue-500" />
                Reported By
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {issue.reporterName || 'Citizen User'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {issue.reportedAt ? new Date(issue.reportedAt).toLocaleString() : ''}
              </p>
            </div>
          </div>

          {/* Resolution Details */}
          {issue.resolutionSource && issue.resolutionSource !== 'PENDING' && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Resolution Provenance
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  Resolved via{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {issue.resolutionSource === 'GOVERNMENT_RESOLVED'
                      ? 'Government Municipal Agency'
                      : 'Citizen Community Action Project'}
                  </strong>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
          <button
            onClick={copyShareLink}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <div className="flex items-center gap-2">
            {canManageStatus && (
              <button
                onClick={() => {
                  onClose();
                  onUpdateStatus(issue);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-xs font-bold transition-all"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
