import React from 'react';
import { Search, X } from 'lucide-react';

export default function ConversationSearch({ value, onChange, collapsed }) {
  if (collapsed) return null;

  return (
    <div className="relative px-3 mb-3">
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 absolute left-3 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-8 pr-8 py-1.5 bg-[#141b2d] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2.5 text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
