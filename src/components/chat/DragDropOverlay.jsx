import React from 'react';
import { UploadCloud } from 'lucide-react';

export default function DragDropOverlay({ isDragging }) {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md border-4 border-dashed border-indigo-500/60 p-6 animate-fade-in pointer-events-none">
      <div className="flex flex-col items-center text-center p-8 bg-[#141b2d] border border-white/10 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mb-4 text-indigo-400 animate-bounce">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Drop files here to upload</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Supports PDF, DOCX, TXT, CSV, and Images for Zenith AI context analysis.
        </p>
      </div>
    </div>
  );
}
