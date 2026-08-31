import React from 'react';
import { BookOpen, PenTool, BarChart2, Code2, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';
import { SUGGESTION_CARDS } from '../../lib/ai/prompts';

export default function EmptyChat({ onSelectSuggestion }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'PenTool': return <PenTool className="w-4 h-4 text-emerald-400" />;
      case 'BarChart2': return <BarChart2 className="w-4 h-4 text-purple-400" />;
      case 'Code2': return <Code2 className="w-4 h-4 text-amber-400" />;
      default: return <BookOpen className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center px-4 py-8 max-w-3xl mx-auto animate-fade-in">
      {/* Floating Glowing Emblem */}
      <div className="mb-6">
        <Logo size="xl" showText={false} glow={true} className="transform hover:scale-110 transition duration-300" />
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
        How can I help you today?
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-10 leading-relaxed">
        Ask questions, explore ideas, analyze information, or build something new with <span className="text-indigo-300 font-semibold">Zenith AI</span>.
      </p>

      {/* 4 Interactive Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {SUGGESTION_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelectSuggestion(card.prompt)}
            className="group relative flex flex-col items-start p-4 bg-[#141b2d]/70 hover:bg-[#1c263e] border border-white/10 hover:border-indigo-500/40 rounded-2xl text-left transition duration-200 shadow-md hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                  {getIcon(card.icon)}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {card.category}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              "{card.prompt}"
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
