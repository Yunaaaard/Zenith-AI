import React, { useState, useRef, useEffect } from 'react';
import { Menu, PanelLeftOpen, PanelLeftClose, Activity, MoreVertical, Settings, BarChart2, LogOut } from 'lucide-react';

export default function ChatHeader({
  selectedModelId,
  onSelectModel,
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileSidebar,
  onOpenUsage,
  onOpenSettings,
  onOpenSignOutModal,
  user,
}) {
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const headerMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setHeaderMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="workspace-header">
      {/* Left Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Mobile Toggle Drawer */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Right Navigation Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Usage Pill */}
        <button
          onClick={onOpenUsage}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-[11px] font-medium text-slate-300 transition"
          title="View API Usage Dashboard"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">API Stats</span>
        </button>

        {/* Developer Avatar */}
        <div
          onClick={() => onOpenSettings('account')}
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 cursor-pointer shadow-md transition hover:scale-105"
          title="Developer Account Settings"
        >
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-indigo-300">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'G')}
          </div>
        </div>

        {/* Header 3-Dot Options Menu */}
        <div className="relative" ref={headerMenuRef}>
          <button
            onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {headerMenuOpen && (
            <div className="absolute right-0 top-9 z-50 w-44 bg-[#141b2d] border border-white/10 rounded-2xl shadow-2xl p-1 text-xs animate-fade-in">
              <button
                onClick={() => {
                  setHeaderMenuOpen(false);
                  onOpenUsage();
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>API Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setHeaderMenuOpen(false);
                  onOpenSettings('general');
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Preferences</span>
              </button>

              <div className="my-1 border-t border-white/5" />

              <button
                onClick={() => {
                  setHeaderMenuOpen(false);
                  onOpenSignOutModal();
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
