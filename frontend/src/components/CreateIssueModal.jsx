import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { X, Send, MapPin, Search, AlertCircle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { createIssueApi } from '../api/issues';
import { searchLocationsApi } from '../api/locations';

const CATEGORIES = [
  { id: 'ROAD', label: 'Roads & Potholes', icon: '🛣️', desc: 'Crater potholes, broken roads, missing dividers' },
  { id: 'WATER', label: 'Water Supply & Leakage', icon: '💧', desc: 'Pipeline bursts, contaminated water, low pressure' },
  { id: 'GARBAGE', label: 'Sanitation & Waste', icon: '🗑️', desc: 'Uncollected waste piles, overflowing dumpsters' },
  { id: 'STREETLIGHT', label: 'Street Lighting', icon: '💡', desc: 'Dark streets, flickering bulbs, damaged electric poles' },
  { id: 'OTHER', label: 'Other Civic Needs', icon: '🏛️', desc: 'Footpath damage, illegal hoardings, drainage issues' },
];

export function CreateIssueModal({ isOpen, onClose, showToast }) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ROAD');
  const [locSearch, setLocSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Location search using TanStack query
  const { data: locations = [], isLoading: locLoading } = useQuery({
    queryKey: ['locations-search', locSearch],
    queryFn: () => searchLocationsApi(locSearch),
    enabled: isOpen,
    staleTime: 60000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => createIssueApi(data),
    onSuccess: (newIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
      showToast('Civic grievance reported successfully! Reference ID #' + (newIssue?.id || 'new'), 'success');
      onClose();
      setTitle('');
      setDescription('');
      setSelectedLocation(null);
      setLocSearch('');
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to submit grievance');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || title.length < 5) {
      setErrorMsg('Please enter a descriptive title (at least 5 characters)');
      return;
    }
    if (!description.trim() || description.length < 10) {
      setErrorMsg('Please enter detailed description (at least 10 characters)');
      return;
    }
    if (!selectedLocation) {
      setErrorMsg('Please select your locality/PIN code from the location search list');
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      category,
      locationId: selectedLocation.id,
    });
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
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Report a Civic Grievance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log a public issue to official municipal agency & community tracker
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-slate-900 dark:text-slate-100">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Issue Headline / Summary *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Major drinking water pipe burst flooding road near Metro Station"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
              maxLength={120}
            />
            <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
              {title.length}/120 characters
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-950 dark:text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        {cat.label}
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Autocomplete Search */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Locality & PIN Code *
            </label>
            
            {selectedLocation ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="font-bold text-xs">{selectedLocation.name}</span>
                    <span className="text-[11px] opacity-80 ml-2">
                      {selectedLocation.district} — PIN {selectedLocation.pinCode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLocation(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline font-semibold"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={locSearch}
                    onChange={(e) => setLocSearch(e.target.value)}
                    placeholder="Type city, district, colony or PIN code (e.g. Connaught Place, 110001)..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
                  />
                  {locLoading && (
                    <Loader2 className="w-4 h-4 absolute right-3.5 top-3 text-orange-500 animate-spin" />
                  )}
                </div>

                <div className="max-h-36 overflow-y-auto rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/50">
                  {locations.length > 0 ? (
                    locations.map((loc) => (
                      <button
                        type="button"
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc)}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{loc.name}</span>
                          <span className="text-[11px] text-slate-500">({loc.district})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {loc.pinCode}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No matching registered localities. Try "Delhi", "Bengaluru", or "Noida".
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Description & Landmark *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem, affected citizens, duration, and identifiable landmarks..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
              maxLength={1000}
            />
            <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
              {description.length}/1000 characters
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Grievance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
