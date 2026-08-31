import React, { useState } from 'react';
import { X, Sliders, Cpu, MessageSquare, Code, User, Trash2, Key, Check } from 'lucide-react';
import { ZENITH_MODELS } from '../../lib/ai/models';

export default function SettingsModal({
  isOpen,
  onClose,
  initialTab = 'general',
  settings,
  onUpdateSettings,
  onClearHistory,
  user,
  onSignOut,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    onUpdateSettings({ apiKey: apiKeyInput });
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e131f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[480px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Navigation Sidebar */}
        <div className="w-full md:w-52 bg-[#141b2d] border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-1">
          <div className="text-xs font-bold text-white uppercase tracking-wider px-3 mb-3">
            Settings
          </div>

          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'general'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>General</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'ai'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'chat'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat & History</span>
          </button>

          <button
            onClick={() => setActiveTab('developer')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'developer'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Developer API</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'account'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">General Preferences</h3>
                <p className="text-xs text-slate-400">Customize interface density.</p>
              </div>

              {/* Density Option */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Interface Density</label>
                <div className="grid grid-cols-2 gap-2">
                  {['comfortable', 'compact'].map((d) => (
                    <button
                      key={d}
                      onClick={() => onUpdateSettings({ density: d })}
                      className={`capitalize py-2 px-3 rounded-xl border text-xs font-medium transition ${
                        settings.density === d
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI PREFERENCES TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">AI Model Preferences</h3>
                <p className="text-xs text-slate-400">Configure default execution model and creativity parameters.</p>
              </div>

              {/* Default Model */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Default Model</label>
                <select
                  value={settings.defaultModel}
                  onChange={(e) => onUpdateSettings({ defaultModel: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                >
                  {ZENITH_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Response Style */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Response Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['concise', 'balanced', 'detailed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => onUpdateSettings({ responseStyle: s })}
                      className={`capitalize py-2 px-3 rounded-xl border text-xs font-medium transition ${
                        settings.responseStyle === s
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streaming Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-xs font-semibold text-white">Streaming Responses</div>
                  <div className="text-[11px] text-slate-400">Stream tokens in real-time as they generate.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.streaming}
                  onChange={(e) => onUpdateSettings({ streaming: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-white/20 text-indigo-600"
                />
              </div>
            </div>
          )}

          {/* CHAT & HISTORY TAB */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Chat & History</h3>
                <p className="text-xs text-slate-400">Manage conversation retention and storage.</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Save Conversation History</div>
                  <div className="text-[11px] text-slate-400">Store active chats in encrypted local persistence.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={(e) => onUpdateSettings({ saveHistory: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-white/20 text-indigo-600"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all conversation history?')) {
                      onClearHistory();
                    }
                  }}
                  className="flex items-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Conversation History</span>
                </button>
              </div>
            </div>
          )}

          {/* DEVELOPER API TAB */}
          {activeTab === 'developer' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Developer API Configuration</h3>
                <p className="text-xs text-slate-400">Configure optional live AI provider keys (Gemini / OpenAI).</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Custom AI API Key (Optional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter custom Gemini or OpenAI key..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    {apiKeySaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : 'Save'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  API keys stay secure on your client and are never sent to external third parties.
                </p>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Developer Account</h3>
                <p className="text-xs text-slate-400">Authenticated session details.</p>
              </div>

              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white font-semibold">{user?.email || 'developer@zenith.ai'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role:</span>
                  <span className="text-indigo-400 font-semibold uppercase">Developer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Session Status:</span>
                  <span className="text-emerald-400 font-semibold">Active & Authorized</span>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium text-xs rounded-xl transition"
              >
                Sign Out of Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
