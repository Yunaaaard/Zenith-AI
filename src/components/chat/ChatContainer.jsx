import React, { useRef, useEffect } from 'react';
import EmptyChat from './EmptyChat';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import DragDropOverlay from './DragDropOverlay';
import { getModelById } from '../../lib/ai/models';

export default function ChatContainer({
  activeConversation,
  isGenerating,
  currentStreamingText,
  onSendMessage,
  onStopGenerating,
  onRegenerateResponse,
  attachments,
  onAttachFiles,
  onRemoveAttachment,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  user,
  selectedModelId,
  onSelectModel,
}) {
  const bottomRef = useRef(null);

  const messages = activeConversation?.messages || [];

  // Scroll to bottom on new messages or streaming tokens
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, currentStreamingText, isGenerating]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex-1 w-full h-full flex flex-col overflow-hidden"
    >
      <DragDropOverlay isDragging={isDragging} />

      <div className="chat-container">
        <div className="chat-content-inner">
          {messages.length === 0 ? (
            <EmptyChat onSelectSuggestion={(prompt) => onSendMessage(prompt, attachments)} />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onRegenerate={onRegenerateResponse}
                  user={user}
                />
              ))}

              {/* Real-time Streaming AI Response Bubble */}
              {isGenerating && currentStreamingText && (
                <ChatMessage
                  message={{
                    id: 'streaming-live',
                    role: 'assistant',
                    content: currentStreamingText,
                    timestamp: 'Just now',
                    model: getModelById(selectedModelId)?.name || 'Mikel',
                  }}
                  user={user}
                />
              )}

              {/* Animated Thinking Indicator */}
              {isGenerating && !currentStreamingText && (
                <TypingIndicator onStop={onStopGenerating} />
              )}
            </>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Modern Composer Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        attachments={attachments}
        onAttachFiles={onAttachFiles}
        onRemoveAttachment={onRemoveAttachment}
        isGenerating={isGenerating}
        selectedModelId={selectedModelId}
        onSelectModel={onSelectModel}
        user={user}
      />
    </div>
  );
}
