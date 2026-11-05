import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, CheckCircle2 } from 'lucide-react';

const STORIES = [
  { id: 'ALL', name: 'All Grievances', emoji: '🇮🇳', count: 'Live', gradient: 'from-orange-500 via-amber-500 to-emerald-500' },
  { id: 'ROAD', name: 'Roads & Potholes', emoji: '🛣️', count: 'New', gradient: 'from-amber-500 to-orange-600' },
  { id: 'WATER', name: 'Water Supply', emoji: '💧', count: 'Urgent', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'GARBAGE', name: 'Sanitation', emoji: '🗑️', count: 'Action', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'STREETLIGHT', name: 'Lighting', emoji: '💡', count: 'Night', gradient: 'from-yellow-400 to-amber-500' },
  { id: 'RESOLVED', name: 'Resolved Stories', emoji: '🏆', count: 'Impact', gradient: 'from-green-500 to-emerald-600' },
  { id: 'OTHER', name: 'Civic Needs', emoji: '🏛️', count: 'Wards', gradient: 'from-purple-500 to-indigo-600' },
];

export function StoryHighlights({ activeCategory, onSelectCategory, onOpenCreateModal }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none select-none">
          
          {/* Post New Story / Issue Ring */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCreateModal}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
          >
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 border-2 border-dashed border-orange-400 dark:border-orange-500 group-hover:border-orange-600 flex items-center justify-center transition-colors">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-inner">
                <Plus className="w-6 h-6 text-orange-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                +
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[70px] truncate text-center">
              Post Issue
            </span>
          </motion.button>

          {/* Category Highlight Rings */}
          {STORIES.map((story) => {
            const isSelected =
              story.id === 'ALL'
                ? !activeCategory
                : activeCategory === story.id;

            return (
              <motion.button
                key={story.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(story.id === 'ALL' ? '' : story.id)}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
              >
                <div
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.75 transition-all ${
                    isSelected
                      ? `bg-linear-to-tr ${story.gradient} ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md`
                      : 'bg-linear-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 hover:from-orange-400 hover:to-pink-500'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
                      {story.emoji}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span
                    className={`block text-[11px] sm:text-xs font-semibold max-w-[76px] truncate ${
                      isSelected
                        ? 'text-orange-600 dark:text-orange-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {story.name}
                  </span>
                </div>
              </motion.button>
            );
          })}

        </div>
      </div>
    </div>
  );
}
