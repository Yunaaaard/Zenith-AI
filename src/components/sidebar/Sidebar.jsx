import React, { useState, useRef, useEffect } from 'react';
import { Plus, Settings, BarChart2, LogOut, User } from 'lucide-react';
import Logo from '../ui/Logo';
import ConversationSearch from './ConversationSearch';
import ConversationList from './ConversationList';

export default function Sidebar({
  user,
  collapsed,
  onToggleCollapse,
  groupedConversations,
  activeId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onArchiveChat,
  onDeleteChat,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenUsage,
  onOpenSignOutModal,
  mobileOpen,
  onCloseMobile,
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountRef = useRef(null);

  const isGuest = user?.role === 'guest' || user?.uid?.startsWith('guest-');
  const userDisplayName = user?.displayName || (isGuest ? 'Guest' : 'Developer');
  const userSubtitle = isGuest ? 'Guest Account' : (user?.email || 'developer@zenith.ai');
  const avatarLetter = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'G';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Top Header & Branding */}
        <div className="flex items-center justify-center w-full px-4 pt-5 pb-3">
          <Logo size="lg" showText={false} className="mx-auto" />
        </div>

        {/* Primary Action Button: + New Chat */}
        <div className="px-3 mb-2.5">
          <button
            onClick={() => {
              onNewChat();
              if (mobileOpen) onCloseMobile();
            }}
            className={`w-full py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition active:scale-[0.98] ${
              collapsed ? 'px-0 justify-center' : 'px-4'
            }`}
            title="New Chat"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Search Conversations Input */}
        <ConversationSearch
          value={searchQuery}
          onChange={onSearchChange}
          collapsed={collapsed}
        />

        {/* Grouped Conversation List (Takes remaining height) */}
        <ConversationList
          groupedConversations={groupedConversations}
          activeId={activeId}
          onSelect={(id) => {
            onSelectChat(id);
            if (mobileOpen) onCloseMobile();
          }}
          onRename={onRenameChat}
          onArchive={onArchiveChat}
          onDelete={onDeleteChat}
          collapsed={collapsed}
        />

        {/* Sidebar Bottom: Account Section (Docked to bottom) */}
        <div className="p-3 border-t border-white/5 relative mt-auto" ref={accountRef}>
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/5 transition ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {/* Account Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shrink-0 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-indigo-300">
                {avatarLetter}
              </div>
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{userDisplayName}</div>
                <div className="text-[11px] text-slate-400 truncate">
                  {userSubtitle}
                </div>
              </div>
            )}
          </button>

          {/* Account Dropdown Menu */}
          {accountMenuOpen && (
            <div
              className={`absolute bottom-16 z-50 w-52 bg-[#141b2d] border border-white/10 rounded-2xl shadow-2xl p-1.5 animate-fade-in ${
                collapsed ? 'left-14' : 'left-3'
              }`}
            >
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <div className="text-xs font-semibold text-white">
                  {isGuest ? 'Guest Workspace' : 'Developer Workspace'}
                </div>
                <div className="text-[10px] text-indigo-400 font-medium">
                  {isGuest ? 'Token Authorized' : 'Access Granted'}
                </div>
              </div>

              <button
                onClick={() => {
                  setAccountMenuOpen(false);
                  onOpenSettings('account');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Account</span>
              </button>

              <button
                onClick={() => {
                  setAccountMenuOpen(false);
                  onOpenSettings('general');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => {
                  setAccountMenuOpen(false);
                  onOpenUsage();
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>API Usage</span>
              </button>

              <div className="my-1 border-t border-white/5" />

              <button
                onClick={() => {
                  setAccountMenuOpen(false);
                  onOpenSignOutModal();
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
