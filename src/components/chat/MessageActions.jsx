import React, { useState } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, Share2, MoreHorizontal } from 'lucide-react';

export default function MessageActions({ content, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="flex items-center gap-1 mt-2 text-slate-400 opacity-80 hover:opacity-100 transition">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        title="Copy response"
        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>

      {/* Like Button */}
      <button
        onClick={handleLike}
        title="Good response"
        className={`p-1.5 rounded-lg hover:bg-white/10 transition ${liked ? 'text-indigo-400 bg-indigo-500/20' : 'hover:text-white'}`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>

      {/* Dislike Button */}
      <button
        onClick={handleDislike}
        title="Poor response"
        className={`p-1.5 rounded-lg hover:bg-white/10 transition ${disliked ? 'text-red-400 bg-red-500/20' : 'hover:text-white'}`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>

      {/* Regenerate Button */}
      {onRegenerate && (
        <button
          onClick={onRegenerate}
          title="Regenerate response"
          className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Share / More Button */}
      <button
        onClick={handleCopy}
        title="More actions"
        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
