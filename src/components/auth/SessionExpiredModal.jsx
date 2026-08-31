import React from 'react';
import { Clock, LogIn } from 'lucide-react';

export default function SessionExpiredModal({ onSignInAgain }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#141b2d] border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Clock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Session Expired</h3>
        <p className="text-xs text-slate-400 mb-6">
          Your session has expired. Please sign in again to access your developer workspace.
        </p>

        <button
          onClick={onSignInAgain}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In Again</span>
        </button>
      </div>
    </div>
  );
}
