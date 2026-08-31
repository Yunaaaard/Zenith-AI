import React from 'react';

export default function UsageCharts({ dailyLogs = [], modelUsage = [] }) {
  const maxReq = Math.max(...dailyLogs.map((l) => l.requests), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {/* Requests Over Time Bar Chart */}
      <div className="p-5 bg-[#141b2d] border border-white/10 rounded-2xl shadow-sm">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Requests Over Time</span>
          <span className="text-[10px] text-indigo-400 font-normal">Past 7 Days</span>
        </h4>

        <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-white/10">
          {dailyLogs.map((log, idx) => {
            const heightPercent = Math.round((log.requests / maxReq) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Hover Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded border border-white/10 whitespace-nowrap z-10 pointer-events-none">
                  {log.requests} requests ({Math.round(log.tokens / 1000)}k tokens)
                </div>

                <div className="w-full bg-slate-900 rounded-t-lg overflow-hidden flex items-end h-32">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-md transition-all duration-300 group-hover:from-indigo-500 group-hover:to-cyan-300"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1">{log.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Usage Distribution */}
      <div className="p-5 bg-[#141b2d] border border-white/10 rounded-2xl shadow-sm">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Model Usage Distribution</span>
          <span className="text-[10px] text-cyan-400 font-normal">By Request Volume</span>
        </h4>

        <div className="space-y-4 pt-2">
          {modelUsage.map((m, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{m.model}</span>
                <span className="text-slate-400 font-mono">{m.count} req ({m.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  style={{ width: `${m.percentage}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    idx === 0
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      : idx === 1
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
