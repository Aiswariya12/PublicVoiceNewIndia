import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-start gap-2.5 backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-500/40 text-red-900 dark:text-red-200'
                : toast.type === 'info'
                ? 'bg-blue-50/95 dark:bg-blue-950/90 border-blue-200 dark:border-blue-500/40 text-blue-900 dark:text-blue-200'
                : 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-blue-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
