import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Activity, RefreshCw, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { pingBackend, BACKEND_STATE } from '../api/client';

export function BackendStatusBanner() {
  const [isLive, setIsLive] = useState(BACKEND_STATE.isLive);
  const [latency, setLatency] = useState(BACKEND_STATE.latency);
  const [checking, setChecking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    const live = await pingBackend();
    setIsLive(live);
    setLatency(BACKEND_STATE.latency);
    setChecking(false);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {isLive ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              )}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Spring Boot API:
            </span>
            {isLive ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                Connected (:8081)
                {latency && <span className="text-slate-500 font-normal">({latency}ms)</span>}
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Offline Sandbox (Live at port 8081)
              </span>
            )}
          </div>

          <button
            onClick={checkStatus}
            disabled={checking}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-300 dark:border-slate-700 text-[11px] shadow-2xs"
            title="Ping backend"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin text-orange-500' : ''}`} />
            <span>Ping</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
          <span className="hidden sm:inline">PostgreSQL @ localhost:5432</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium"
          >
            <span>Diagnostics</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <Server className="w-4 h-4 text-blue-500" />
                  Backend Configuration
                </div>
                <div className="text-slate-600 dark:text-slate-400 space-y-0.5 font-mono text-[11px]">
                  <div>Port: 8081 (Spring Boot 3.3.4)</div>
                  <div>Security: JWT Bearer stateless filter</div>
                  <div>CORS: http://localhost:5173</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  TanStack Sync Engine
                </div>
                <div className="text-slate-600 dark:text-slate-400 space-y-0.5 text-[11px]">
                  <div>Live query caching & mutations</div>
                  <div>Optimistic local persistence active</div>
                  <div>Automatic synchronization on reconnect</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <Terminal className="w-4 h-4 text-amber-500" />
                  Spring Boot Run Command
                </div>
                <div className="text-slate-900 dark:text-slate-200 font-mono text-[11px] bg-slate-200/60 dark:bg-black/40 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
                  mvnw spring-boot:run
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Target database: postgresql://localhost:5432/publicvoice_db
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
