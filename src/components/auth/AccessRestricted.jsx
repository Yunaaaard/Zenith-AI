import React from 'react';
import { ShieldX, LogOut } from 'lucide-react';
import Logo from '../ui/Logo';

export default function AccessRestricted({ onReturnToLogin }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#080b11] p-4 sm:p-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px] bg-[#0e131f]/95 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
          <ShieldX className="w-7 h-7" />
        </div>

        <Logo size="lg" showText={true} className="justify-center mb-4" />

        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-400 mb-7 leading-relaxed">
          This Zenith AI workspace is currently limited to developer access.
        </p>

        <button
          onClick={onReturnToLogin}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Return to Login</span>
        </button>
      </div>
    </div>
  );
}
