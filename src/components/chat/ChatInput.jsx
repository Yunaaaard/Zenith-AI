import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, MicOff, ArrowUp, Loader2, AlertTriangle } from 'lucide-react';
import FileAttachment from './FileAttachment';
import ModelSelector from '../model/ModelSelector';
import { getGuestPromptCount, MAX_GUEST_PROMPTS } from '../../lib/auth/guestLimits';

export default function ChatInput({
  onSendMessage,
  attachments = [],
  onAttachFiles,
  onRemoveAttachment,
  isGenerating,
  selectedModelId,
  onSelectModel,
  user,
}) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const isGuest = user?.role === 'guest' || user?.uid?.startsWith('guest-');
  const tokenCode = user?.tokenCode || (isGuest ? localStorage.getItem('zenith_guest_token') : null);
  const usedPrompts = isGuest && tokenCode ? getGuestPromptCount(tokenCode) : 0;
  const isLimitReached = isGuest && usedPrompts >= MAX_GUEST_PROMPTS;

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isLimitReached || (!text.trim() && attachments.length === 0) || isGenerating) return;
    onSendMessage(text, attachments);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAttachFiles(e.target.files);
    }
    e.target.value = '';
  };

  // Clipboard Image Paste (Ctrl+V) Handler
  const handlePaste = (e) => {
    if (isLimitReached) return;
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const ext = item.type.split('/')[1] || 'png';
          const namedFile = new File([file], `pasted-image-${Date.now()}.${ext}`, { type: item.type });
          imageFiles.push(namedFile);
        }
      }
    }

    if (imageFiles.length > 0) {
      onAttachFiles(imageFiles);
    }
  };

  // Voice Input (Speech Recognition)
  const toggleVoiceInput = () => {
    if (isLimitReached) return;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const canSend = !isLimitReached && (text.trim().length > 0 || attachments.length > 0) && !isGenerating;

  return (
    <div className="composer-wrapper">
      <div className="composer-box relative">

        {/* Guest Limit Warning Banner (when 5/5 reached) */}
        {isLimitReached && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-3 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <strong className="font-semibold text-white">Guest Limit Reached (5/5 prompts used):</strong>
              <span className="ml-1 opacity-90">You have reached the maximum allowed prompts for this guest token. Please sign out to request a new token.</span>
            </div>
          </div>
        )}

        {/* Attached Files Preview Row */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b border-white/5">
            {attachments.map((file) => (
              <FileAttachment
                key={file.id}
                file={file}
                onRemove={onRemoveAttachment}
              />
            ))}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          disabled={isLimitReached}
          className="hidden"
        />

        {/* Text Input Row */}
        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating || isLimitReached}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition disabled:opacity-40 shrink-0 flex items-center justify-center"
            title={isLimitReached ? 'Guest prompt limit reached' : 'Attach Files'}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={isGenerating || isLimitReached}
            placeholder={
              isLimitReached
                ? 'Prompt limit reached (5/5 prompts used). Sign out to enter a new token.'
                : 'Message Zenith AI...'
            }
            className="composer-textarea flex-1 max-h-[180px] bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none disabled:opacity-50 py-1.5 leading-6 my-auto"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isGenerating || isLimitReached}
            className={`w-9 h-9 rounded-xl transition disabled:opacity-40 shrink-0 flex items-center justify-center ${
              isListening
                ? 'text-red-400 bg-red-500/10 animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Voice Input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send / Stop Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSend}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition shadow-md shrink-0 ${
              canSend
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/25 active:scale-95'
                : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
            }`}
            title="Send Message"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Footer Subtext Bar & Model Selector */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/5 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 min-w-0">
            {/* Embedded Drop-Up Model Selector */}
            <ModelSelector
              selectedModelId={selectedModelId}
              onSelectModel={onSelectModel}
              dropUp={true}
            />

            {/* Guest Prompt Usage Badge */}
            {isGuest && (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium text-[10px] border ${
                isLimitReached
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLimitReached ? 'bg-red-400' : 'bg-indigo-400 animate-pulse'}`} />
                <span>Guest Prompts: <strong className="text-white font-mono">{usedPrompts} / {MAX_GUEST_PROMPTS}</strong></span>
              </div>
            )}
          </div>

          <div className="hidden sm:block text-slate-500 truncate">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-white/10 text-slate-300 font-mono text-[10px]">Enter ↵</kbd> to send
          </div>
        </div>

      </div>
    </div>
  );
}
