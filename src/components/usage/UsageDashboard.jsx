import React, { useState, useEffect } from 'react';
import { X, Activity, Cpu, ArrowUpRight, DollarSign, Calendar, Database } from 'lucide-react';
import UsageCard from './UsageCard';
import UsageCharts from './UsageCharts';
import { calculateFirestoreAnalytics } from '../../lib/db/storage';
import { fetchUserConversations } from '../../lib/db/conversations';

export default function UsageDashboard({ isOpen, onClose, user }) {
  const [dateFilter, setDateFilter] = useState('7Days');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreStats() {
      if (!isOpen) return;
      setLoading(true);
      const userId = user?.uid;
      const convs = await fetchUserConversations(userId);
      const computed = calculateFirestoreAnalytics(convs);

      if (isMounted) {
        setAnalytics(computed);
        setLoading(false);
      }
    }

    loadFirestoreStats();
    return () => {
      isMounted = false;
    };
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  const stats = analytics || {
    todayRequests: 0,
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    estimatedCost: 0,
    dailyLogs: [
      { date: 'Mon', requests: 0, tokens: 0 },
      { date: 'Tue', requests: 0, tokens: 0 },
      { date: 'Wed', requests: 0, tokens: 0 },
      { date: 'Thu', requests: 0, tokens: 0 },
      { date: 'Fri', requests: 0, tokens: 0 },
      { date: 'Sat', requests: 0, tokens: 0 },
      { date: 'Sun', requests: 0, tokens: 0 },
    ],
    modelUsage: [{ model: 'Claude Opus 5', count: 0, percentage: 100 }],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0e131f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dashboard Title & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Developer API Analytics
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2">
                <Database className="w-3 h-3" />
                Firestore Live DB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live token telemetry, model request distributions, and cost analytics synced with Cloud Firestore.
            </p>
          </div>

          {/* Date Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
            {['Today', '7Days', '30Days'].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setDateFilter(filterKey)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  dateFilter === filterKey
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filterKey === '7Days' ? '7 Days' : filterKey === '30Days' ? '30 Days' : 'Today'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Fetching analytics telemetry from Firestore...
          </div>
        ) : (
          <>
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <UsageCard
                title="Total Requests"
                value={stats.todayRequests}
                subtext="Synced from Firestore"
                icon={Activity}
                color="text-indigo-400"
              />
              <UsageCard
                title="Total Tokens"
                value={stats.totalTokens.toLocaleString()}
                subtext="Input + Output combined"
                icon={Cpu}
                color="text-purple-400"
              />
              <UsageCard
                title="Input / Output"
                value={`${(stats.inputTokens / 1000).toFixed(1)}k / ${(stats.outputTokens / 1000).toFixed(1)}k`}
                subtext="Prompt token breakdown"
                icon={ArrowUpRight}
                color="text-cyan-400"
              />
              <UsageCard
                title="Estimated Cost"
                value={`$${stats.estimatedCost}`}
                subtext="Based on standard API rates"
                icon={DollarSign}
                color="text-emerald-400"
              />
            </div>

            {/* Usage Analytics Charts */}
            <UsageCharts
              dailyLogs={stats.dailyLogs}
              modelUsage={stats.modelUsage}
            />
          </>
        )}
      </div>
    </div>
  );
}
