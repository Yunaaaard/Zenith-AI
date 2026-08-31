import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useConversations } from './hooks/useConversations';
import { useTheme } from './hooks/useTheme';
import { useFileUpload } from './hooks/useFileUpload';
import { useChat } from './hooks/useChat';

import LoginForm from './components/auth/LoginForm';
import AccessRestricted from './components/auth/AccessRestricted';
import SessionExpiredModal from './components/auth/SessionExpiredModal';

import Sidebar from './components/sidebar/Sidebar';
import ChatHeader from './components/chat/ChatHeader';
import ChatContainer from './components/chat/ChatContainer';

import SettingsModal from './components/settings/SettingsModal';
import UsageDashboard from './components/usage/UsageDashboard';

import Logo from './components/ui/Logo';
import { LogOut } from 'lucide-react';

export default function App() {
  // Hooks initialization
  const {
    user,
    loading: authLoading,
    authError,
    isAuthorized,
    sessionExpired,
    login,
    handleRequestGuestToken,
    handleVerifyGuestToken,
    logout,
    dismissSessionExpired,
    setAuthError,
  } = useAuth();

  const { settings, updateSettings } = useTheme();

  const {
    conversations,
    activeId,
    activeConversation,
    searchQuery,
    setSearchQuery,
    groupedConversations,
    handleNewChat,
    handleSelectChat,
    handleRenameChat,
    handleArchiveChat,
    handleDeleteChat,
    handleClearAll,
    saveActiveConversation,
    setConversations,
  } = useConversations(user);

  const {
    attachments,
    isDragging,
    handleFiles,
    removeAttachment,
    clearAttachments,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileUpload();

  const [selectedModelId, setSelectedModelId] = useState(settings.defaultModel || 'zenith-mikel');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal States
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('general');
  const [usageDashboardOpen, setUsageDashboardOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

  const {
    isGenerating,
    currentStreamingText,
    sendMessage,
    stopGenerating,
    regenerateResponse,
  } = useChat({
    activeConversation,
    onNewChat: handleNewChat,
    onSaveConversation: saveActiveConversation,
    selectedModelId,
    userSettings: settings,
    user,
  });

  const handleSendMessageWrapper = (promptText, attachedFiles) => {
    sendMessage(promptText, attachedFiles);
    clearAttachments();
  };

  // 1. Loading Splash Screen
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#080b11] flex flex-col items-center justify-center p-4">
        <Logo size="xl" showText={true} glow={true} className="mb-4" />
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mt-2">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    );
  }

  // 2. Unauthenticated User -> Login Screen
  if (!user) {
    return (
      <>
        {sessionExpired && (
          <SessionExpiredModal
            onSignInAgain={() => {
              dismissSessionExpired();
            }}
          />
        )}
        <LoginForm
          onLogin={login}
          onRequestGuestToken={handleRequestGuestToken}
          onVerifyGuestToken={handleVerifyGuestToken}
          loading={authLoading}
          authError={authError}
          setAuthError={setAuthError}
        />
      </>
    );
  }

  // 3. Authenticated but Unauthorized User -> Access Restricted Screen
  if (!isAuthorized) {
    return <AccessRestricted onReturnToLogin={logout} />;
  }

  // 4. Authenticated & Authorized Developer -> Zenith AI Workspace
  return (
    <div className="app-container">
      {/* Session Expired Handler */}
      {sessionExpired && (
        <SessionExpiredModal
          onSignInAgain={() => {
            dismissSessionExpired();
            logout();
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        groupedConversations={groupedConversations}
        activeId={activeId}
        onSelectChat={handleSelectChat}
        onNewChat={() => handleNewChat(selectedModelId)}
        onRenameChat={handleRenameChat}
        onArchiveChat={handleArchiveChat}
        onDeleteChat={handleDeleteChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={(tab) => {
          setSettingsInitialTab(tab);
          setSettingsModalOpen(true);
        }}
        onOpenUsage={() => setUsageDashboardOpen(true)}
        onOpenSignOutModal={() => setSignOutModalOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="main-workspace">
        {/* Workspace Top Navigation Header */}
        <ChatHeader
          selectedModelId={selectedModelId}
          onSelectModel={setSelectedModelId}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenUsage={() => setUsageDashboardOpen(true)}
          onOpenSettings={(tab) => {
            setSettingsInitialTab(tab);
            setSettingsModalOpen(true);
          }}
          onOpenSignOutModal={() => setSignOutModalOpen(true)}
          user={user}
        />

        {/* Scrollable Conversation Workspace */}
        <ChatContainer
          activeConversation={activeConversation}
          isGenerating={isGenerating}
          currentStreamingText={currentStreamingText}
          onSendMessage={handleSendMessageWrapper}
          onStopGenerating={stopGenerating}
          onRegenerateResponse={regenerateResponse}
          attachments={attachments}
          onAttachFiles={handleFiles}
          onRemoveAttachment={removeAttachment}
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          user={user}
          selectedModelId={selectedModelId}
          onSelectModel={setSelectedModelId}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        initialTab={settingsInitialTab}
        settings={settings}
        onUpdateSettings={updateSettings}
        onClearHistory={handleClearAll}
        user={user}
        onSignOut={() => {
          setSettingsModalOpen(false);
          setSignOutModalOpen(true);
        }}
      />

      {/* API Usage Telemetry Dashboard */}
      <UsageDashboard
        isOpen={usageDashboardOpen}
        onClose={() => setUsageDashboardOpen(false)}
        user={user}
      />

      {/* Sign Out Confirmation Modal (Section 21 of Zenith_AI_Prompt.md) */}
      {signOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#141b2d] border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Sign out of Zenith AI?
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              You will need to sign in again to access your developer workspace.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSignOutModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition border border-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSignOutModalOpen(false);
                  logout();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-red-600/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
