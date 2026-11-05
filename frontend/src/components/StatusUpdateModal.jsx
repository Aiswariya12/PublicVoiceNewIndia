import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, ShieldCheck, CheckCircle2, Clock, Wrench, XCircle, Loader2 } from 'lucide-react';
import { updateIssueStatusApi } from '../api/issues';

const STATUS_TRANSITIONS = [
  { id: 'PENDING', label: 'Pending Review', desc: 'Awaiting on-site verification', icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  { id: 'VERIFIED', label: 'Mark as Verified', desc: 'Legitimate issue confirmed by inspector', icon: ShieldCheck, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' },
  { id: 'IN_PROGRESS', label: 'Work In Progress', desc: 'Municipal crew / contractor dispatched', icon: Wrench, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' },
  { id: 'RESOLVED', label: 'Mark as Resolved', desc: 'Repair completed on-site', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  { id: 'REJECTED', label: 'Close / Reject', desc: 'Duplicate or out-of-jurisdiction item', icon: XCircle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
];

export function StatusUpdateModal({ issue, isOpen, onClose, showToast }) {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState(issue?.status || 'IN_PROGRESS');

  const updateMutation = useMutation({
    mutationFn: (newStatus) => updateIssueStatusApi(issue.id, newStatus),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
      showToast(`Status updated to ${updated?.status || selectedStatus} successfully!`, 'success');
      onClose();
    },
    onError: (err) => {
      showToast(err.message || 'Failed to update status', 'error');
    },
  });

  if (!isOpen || !issue) return null;

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
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden text-slate-900 dark:text-white"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Officer Status Action</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                Ref #{issue.id}: {issue.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Select New Status for this Grievance:
          </p>

          <div className="space-y-2">
            {STATUS_TRANSITIONS.map((item) => {
              const Icon = item.icon;
              const isCurrent = issue.status === item.id;
              const isSelected = selectedStatus === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedStatus(item.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 shadow-xs ring-1 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${item.color} mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{item.label}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => updateMutation.mutate(selectedStatus)}
              disabled={updateMutation.isPending || selectedStatus === issue.status}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Status Update</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
