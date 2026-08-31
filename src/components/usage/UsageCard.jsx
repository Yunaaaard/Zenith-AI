import React from 'react';

export default function UsageCard({ title, value, subtext, icon: Icon, color = 'text-indigo-400' }) {
  return (
    <div className="p-4 bg-[#141b2d] border border-white/10 rounded-2xl shadow-sm flex items-start justify-between">
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {value}
        </div>
        {subtext && (
          <div className="text-[10px] text-slate-500 mt-1">
            {subtext}
          </div>
        )}
      </div>

      {Icon && (
        <div className={`p-2.5 rounded-xl bg-slate-900 border border-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
