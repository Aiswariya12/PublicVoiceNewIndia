import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, CheckCircle, Search, Flame, ArrowRight } from 'lucide-react';

export function HeroBanner({ searchQuery, setSearchQuery, onOpenCreateModal, onCategorySelect, activeCategory }) {
  const categories = [
    { id: 'ALL', label: 'All Issues', icon: '🌐' },
    { id: 'ROAD', label: 'Roads & Potholes', icon: '🛣️' },
    { id: 'WATER', label: 'Water Supply', icon: '💧' },
    { id: 'GARBAGE', label: 'Waste & Sanitation', icon: '🗑️' },
    { id: 'STREETLIGHT', label: 'Street Lighting', icon: '💡' },
    { id: 'OTHER', label: 'Other Civic Needs', icon: '🏛️' },
  ];

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-5xl mx-auto text-center">
        
        {/* Subtle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-6 shadow-sm"
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Transparent Citizen Grievance & Community Action System</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight"
        >
          Your Voice Shapes <br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            A Clean & Smarter India
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
        >
          Report civic problems, monitor real-time department resolution timelines, 
          or organize local community initiatives with transparent digital governance.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8 relative"
        >
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, locality, PIN code or problem description..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 shadow-xl backdrop-blur-md transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-24 text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onOpenCreateModal}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20"
            >
              <span>+ Post</span>
            </button>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto"
        >
          {categories.map((cat) => {
            const isSelected = (activeCategory || 'ALL') === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategorySelect(cat.id === 'ALL' ? '' : cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all backdrop-blur-md border ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/25'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20 hover:bg-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
