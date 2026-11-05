import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  XCircle, 
  Sparkles,
  Building2,
  Users2,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORY_STYLES = {
  ROAD: {
    label: 'Roads & Potholes',
    emoji: '🛣️',
    gradient: 'from-amber-500/10 via-orange-500/10 to-amber-600/20',
    tagBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700/50',
    accent: '#f59e0b',
  },
  WATER: {
    label: 'Water Supply',
    emoji: '💧',
    gradient: 'from-blue-500/10 via-sky-500/10 to-cyan-600/20',
    tagBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700/50',
    accent: '#3b82f6',
  },
  GARBAGE: {
    label: 'Waste & Sanitation',
    emoji: '🗑️',
    gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-600/20',
    tagBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50',
    accent: '#10b981',
  },
  STREETLIGHT: {
    label: 'Street Lighting',
    emoji: '💡',
    gradient: 'from-yellow-500/10 via-amber-500/10 to-yellow-600/20',
    tagBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/50',
    accent: '#eab308',
  },
  OTHER: {
    label: 'Civic Need',
    emoji: '🏛️',
    gradient: 'from-purple-500/10 via-indigo-500/10 to-purple-600/20',
    tagBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-700/50',
    accent: '#8b5cf6',
  },
};

const STATUS_CONFIG = {
  PENDING: { label: 'Pending Review', color: 'bg-amber-500 text-white', icon: Clock },
  VERIFIED: { label: 'Verified', color: 'bg-sky-500 text-white', icon: ShieldCheck },
  IN_PROGRESS: { label: 'Work In Progress', color: 'bg-indigo-600 text-white', icon: Wrench },
  RESOLVED: { label: 'Resolved', color: 'bg-emerald-600 text-white', icon: CheckCircle2 },
  REJECTED: { label: 'Closed', color: 'bg-rose-500 text-white', icon: XCircle },
};

function formatTimeAgo(dateStr) {
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

export function InstagramIssueCard({ issue, onSelect, onUpdateStatus, showToast }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(() => 14 + (issue.id % 37));
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'WardCouncillor_42', text: 'Inspection scheduled with municipal junior engineer.' },
  ]);
  const [commentInput, setCommentInput] = useState('');
  const [showComments, setShowComments] = useState(false);

  const cat = CATEGORY_STYLES[issue.category] || CATEGORY_STYLES.OTHER;
  const stat = STATUS_CONFIG[issue.status] || STATUS_CONFIG.PENDING;
  const canManageStatus = ['OFFICER', 'VERIFIER', 'ADMIN'].includes(user?.role);

  // Double tap to like like Instagram
  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const authorName = user?.fullName || 'Citizen';
    setComments((prev) => [
      ...prev,
      { id: Date.now(), user: authorName, text: commentInput.trim() },
    ]);
    setCommentInput('');
    setShowComments(true);
    showToast('Comment posted to public issue record!', 'success');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Grievance link copied to clipboard!', 'info');
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
    >
      {/* 1. Header (Avatar, Username, Location, More Menu) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          {/* Avatar with Story Ring */}
          <div className="relative p-0.5 rounded-full bg-linear-to-tr from-amber-500 via-orange-500 to-emerald-500">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-slate-100">
                {issue.reporterName?.charAt(0) || 'C'}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {issue.reporterName || 'Citizen Reporter'}
              </span>
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]" title="Verified Citizen">
                ✓
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{issue.locationName || 'India'}</span>
              <span>•</span>
              <span>{formatTimeAgo(issue.reportedAt)}</span>
            </div>
          </div>
        </div>

        {/* Header Right: Status Badge & Detail Button */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs ${stat.color}`}>
            <stat.icon className="w-3 h-3" />
            <span>{stat.label}</span>
          </span>

          <button
            onClick={() => onSelect(issue)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Details"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Visual Media Canvas (Instagram Post Content Area with Double Tap) */}
      <div
        onDoubleClick={handleDoubleTap}
        className={`relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden bg-linear-to-br ${cat.gradient} bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-5 select-none cursor-pointer`}
      >
        {/* Category Pill Sticker */}
        <div className="flex items-center justify-between z-10">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${cat.tagBg}`}>
            <span className="text-sm">{cat.emoji}</span>
            <span>{cat.label}</span>
          </span>

          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            REF #{issue.id}
          </span>
        </div>

        {/* Center Poster Headline */}
        <div className="my-auto z-10 py-2">
          <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm mb-3">
            {cat.emoji}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-3 leading-snug drop-shadow-xs">
            {issue.title}
          </h2>
        </div>

        {/* Bottom Location & Resolution Tag inside Canvas */}
        <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-200/40 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span className="truncate max-w-[220px]">{issue.locationName}</span>
          </div>

          {issue.resolutionSource && issue.resolutionSource !== 'PENDING' && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>{issue.resolutionSource === 'GOVERNMENT_RESOLVED' ? 'Govt Resolved' : 'Community Drive'}</span>
            </span>
          )}
        </div>

        {/* Floating Heart Pop Animation on Double Tap */}
        <AnimatePresence>
          {showHeartAnim && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, times: [0, 0.4, 1] }}
              className="absolute inset-0 m-auto w-24 h-24 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Instagram Action Bar (Like, Comment, Share, Bookmark, Officer Update) */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like Heart */}
          <motion.button
            whileTap={{ scale: 1.25 }}
            onClick={toggleLike}
            className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 focus:outline-hidden"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isLiked
                  ? 'text-red-500 fill-red-500'
                  : 'text-slate-800 dark:text-slate-100 hover:text-red-500'
              }`}
            />
          </motion.button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-slate-800 dark:text-slate-100 hover:text-blue-500 transition-colors focus:outline-hidden"
            title="Comments"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="text-slate-800 dark:text-slate-100 hover:text-orange-500 transition-colors focus:outline-hidden"
            title="Share"
          >
            <Send className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Right Action Icons: Officer Status Update & Bookmark */}
        <div className="flex items-center gap-2">
          {canManageStatus && (
            <button
              onClick={() => onUpdateStatus(issue)}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Update Status</span>
            </button>
          )}

          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={() => {
              setIsSaved(!isSaved);
              showToast(isSaved ? 'Removed from tracked issues' : 'Saved to tracked civic issues!', 'info');
            }}
            className="text-slate-800 dark:text-slate-100 focus:outline-hidden"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                isSaved ? 'text-amber-500 fill-amber-500' : 'hover:text-amber-500'
              }`}
            />
          </motion.button>
        </div>
      </div>

      {/* 4. Instagram Post Body: Likes count, Caption, Hashtags */}
      <div className="px-4 pb-4 space-y-2 text-sm text-slate-800 dark:text-slate-200">
        {/* Likes Count */}
        <div className="font-bold text-xs text-slate-900 dark:text-white">
          Supported by {likes} citizens & civic monitors
        </div>

        {/* Caption */}
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-bold text-slate-900 dark:text-white mr-1.5">
            {issue.reporterName || 'Citizen'}
          </span>
          <span className="text-slate-700 dark:text-slate-300">
            {isExpanded
              ? issue.description
              : `${issue.description?.slice(0, 120) || ''}${issue.description?.length > 120 ? '...' : ''}`}
          </span>
          {issue.description?.length > 120 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-1 text-slate-400 dark:text-slate-500 font-semibold text-xs hover:text-slate-600 dark:hover:text-slate-300"
            >
              {isExpanded ? 'less' : 'more'}
            </button>
          )}
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
          <span>#PublicVoice</span>
          <span>#NewIndia</span>
          <span>#{issue.category}</span>
          <span>#CivicAction</span>
        </div>

        {/* 4-Step Mini Timeline Progression Bar */}
        <div className="pt-2 pb-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${
                issue.status === 'RESOLVED'
                  ? 'w-full bg-emerald-500'
                  : issue.status === 'IN_PROGRESS'
                  ? 'w-3/4 bg-indigo-500'
                  : issue.status === 'VERIFIED'
                  ? 'w-1/2 bg-sky-500'
                  : issue.status === 'REJECTED'
                  ? 'w-full bg-rose-500'
                  : 'w-1/4 bg-amber-500'
              }`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
            <span>Reported</span>
            <span>Verified</span>
            <span>In Progress</span>
            <span>Resolved</span>
          </div>
        </div>

        {/* Comments Section */}
        {comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 block"
          >
            View all {comments.length} civic updates / comments
          </button>
        )}

        {showComments && (
          <div className="pt-2 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
            {comments.map((c) => (
              <div key={c.id} className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                  {c.user}
                </span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add a Comment Input Row */}
        <form
          onSubmit={handleAddComment}
          className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
        >
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a citizen update or encouraging note..."
            className="flex-1 text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden py-1"
          />
          {commentInput.trim() && (
            <button
              type="submit"
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700"
            >
              Post
            </button>
          )}
        </form>

      </div>
    </motion.article>
  );
}
