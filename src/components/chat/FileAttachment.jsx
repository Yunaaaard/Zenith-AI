import React from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';
import { formatFileSize } from '../../lib/utils/fileParser';

export default function FileAttachment({ file, onRemove }) {
  const isImage = file.type?.startsWith('image/') || file.previewUrl;

  return (
    <div className="relative group flex items-center gap-2.5 px-3 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs shadow-sm max-w-[240px] animate-fade-in">
      {isImage && file.previewUrl ? (
        <img
          src={file.previewUrl}
          alt={file.name}
          className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="font-semibold text-white truncate text-xs">{file.name}</div>
        <div className="text-[10px] text-slate-400">
          {formatFileSize(file.size)}
        </div>
      </div>

      <button
        onClick={() => onRemove(file.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
        title="Remove file"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
