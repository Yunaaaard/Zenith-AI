import React from 'react';
import Logo from '../ui/Logo';
import { Square } from 'lucide-react';

export default function TypingIndicator({ onStop }) {
  return (
    <div className="chat-message assistant animate-fade-in">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-full bg-slate-900 border border-indigo-500/30 flex items-center justify-center p-1 shadow-md shadow-indigo-500/10">
          <Logo size="xs" showText={false} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-white">Zenith AI</span>
          <span className="text-[10px] text-slate-500">Thinking...</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="text-xs text-indigo-300 ml-1.5 font-medium">
              Zenith AI is thinking...
            </span>
          </div>

          {onStop && (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium rounded-xl transition"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop generating</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
