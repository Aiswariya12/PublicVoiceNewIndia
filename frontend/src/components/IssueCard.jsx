import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Wrench, 
  Sparkles, 
  Building,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORY_META = {
  ROAD: { label: 'Road & Pothole', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', emoji: '🛣️' },
  WATER: { label: 'Water Supply', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', emoji: '💧' },
  GARBAGE: { label: 'Waste & Sanitation', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', emoji: '🗑️' },
  STREETLIGHT: { label: 'Streetlight', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', emoji: '💡' },
  OTHER: { label: 'Civic Need', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', emoji: '🏛️' },
};

const STATUS_META = {
  PENDING: { label: 'Pending Verification', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  VERIFIED: { label: 'Verified by Officer', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30', dot: 'bg-sky-400' },
  IN_PROGRESS: { label: 'Action in Progress', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', dot: 'bg-indigo-400' },
  RESOLVED: { label: 'Issue Resolved', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  REJECTED: { label: 'Closed / Rejected', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dot: 'bg-rose-400' },
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - d) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export function IssueCard({ issue, onSelect, onUpdateStatus }) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const cat = CATEGORY_META[issue.category] || CATEGORY_META.OTHER;
  const stat = STATUS_META[issue.status] || STATUS_META.PENDING;

  const canManageStatus = ['OFFICER', 'VERIFIER', 'ADMIN'].includes(user?.role);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl bg-slate-900/80 border border-white/10 hover:border-orange-500/40 p-5 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/5 transition-all flex flex-col justify-between"
    >
      {/* Top Header: Category & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cat.color}`}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </span>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${stat.badge}`}>
            <span className={`w-2 h-2 rounded-full ${stat.dot} animate-pulse`} />
            <span>{stat.label}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(issue)}
          className="text-base sm:text-lg font-bold text-white group-hover:text-orange-300 transition-colors cursor-pointer line-clamp-2 mb-2 leading-snug"
        >
          {issue.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          {isExpanded ? issue.description : `${issue.description?.slice(0, 140) || ''}${issue.description?.length > 140 ? '...' : ''}`}
          {issue.description?.length > 140 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-1 text-xs text-orange-400 hover:text-orange-300 font-semibold"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="pt-3 border-t border-white/5 space-y-3">
        <div className="flex flex-col gap-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">{issue.locationName || 'Location Recorded'}</span>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 truncate">
              <User className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{issue.reporterName || 'Citizen'}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatRelativeTime(issue.reportedAt)}</span>
            </span>
          </div>
        </div>

        {/* Resolution Source Tag */}
        {issue.resolutionSource && issue.resolutionSource !== 'PENDING' && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            {issue.resolutionSource === 'GOVERNMENT_RESOLVED' ? (
              <>
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>Resolved via Official Government Department</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resolved via Local Citizen Community Project</span>
              </>
            )}
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onSelect(issue)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-1"
          >
            <span>View Timeline</span>
            <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
          </button>

          {canManageStatus && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateStatus(issue)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-300 hover:text-orange-200 border border-orange-500/20 text-xs font-bold transition-all shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5 text-orange-400" />
              <span>Update Status</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
