import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, MoreHorizontal, Edit2, Archive, Trash2, Check, X } from 'lucide-react';

export default function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onArchive,
  onDelete,
  collapsed,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRename(conversation.id, editTitle.trim());
    }
    setIsEditing(false);
    setMenuOpen(false);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditTitle(conversation.title);
    setIsEditing(false);
  };

  if (collapsed) {
    return (
      <button
        onClick={() => onSelect(conversation.id)}
        title={conversation.title}
        className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition ${
          isActive
            ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      onClick={() => !isEditing && onSelect(conversation.id)}
      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition select-none ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white font-medium border border-indigo-500/30'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />

        {isEditing ? (
          <div className="flex items-center gap-1 w-full mr-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename(e);
                if (e.key === 'Escape') handleCancelRename(e);
              }}
              className="w-full px-2 py-1 bg-[#141b2d] border border-indigo-500 rounded text-xs text-white outline-none"
            />
            <button onClick={handleSaveRename} className="p-1 text-emerald-400 hover:text-emerald-300">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleCancelRename} className="p-1 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="truncate">{conversation.title}</span>
        )}
      </div>

      {!isEditing && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className={`p-1 rounded-lg text-slate-400 hover:text-white transition ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-50 w-36 bg-[#141b2d] border border-white/10 rounded-xl shadow-2xl py-1 text-xs animate-fade-in">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rename</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(conversation.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <Archive className="w-3.5 h-3.5 text-amber-400" />
                <span>Archive</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conversation.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
