import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Zap, Brain } from 'lucide-react';
import { ZENITH_MODELS } from '../../lib/ai/models';

export default function ModelSelector({ selectedModelId, onSelectModel, dropUp = false }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentModel = ZENITH_MODELS.find((m) => m.id === selectedModelId) || ZENITH_MODELS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Brain': return <Brain className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
      >
        <span className="flex items-center gap-1.5">
          {getIcon(currentModel.icon)}
          <span className="truncate max-w-[150px]">{currentModel.name}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute left-0 z-50 w-72 bg-[#141b2d] border border-white/10 rounded-2xl shadow-2xl p-1.5 animate-fade-in ${
            dropUp ? 'bottom-11' : 'top-10'
          }`}
        >
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Select AI Model
            </div>
          </div>

          <div className="space-y-1 max-h-[320px] overflow-y-auto">
            {ZENITH_MODELS.map((model) => {
              const isSelected = model.id === selectedModelId;
              return (
                <button
                  type="button"
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    setOpen(false);
                  }}
                  className={`flex items-start justify-between w-full p-2.5 rounded-xl text-left transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 border border-indigo-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{getIcon(model.icon)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{model.name}</span>
                        {model.badge && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {model.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
