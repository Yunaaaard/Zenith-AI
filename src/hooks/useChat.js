import { useState, useRef, useCallback } from 'react';
import { streamAIResponse } from '../lib/ai/engine';
import { getModelById } from '../lib/ai/models';
import { getCurrentTimestamp } from '../lib/utils/formatting';
import { recordUsage } from '../lib/db/storage';
import { getGuestPromptCount, incrementGuestPromptCount, MAX_GUEST_PROMPTS } from '../lib/auth/guestLimits';

export function useChat({ activeConversation, onNewChat, onSaveConversation, selectedModelId, userSettings, user }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStreamingText, setCurrentStreamingText] = useState('');
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(
    async (promptText, attachments = []) => {
      if (!promptText.trim() && attachments.length === 0) return;

      const isGuest = user?.role === 'guest' || user?.uid?.startsWith('guest-');
      const tokenCode = user?.tokenCode || localStorage.getItem('zenith_guest_token');

      // Enforce 5-prompt limit for Guest accounts
      if (isGuest && tokenCode) {
        const usedPrompts = getGuestPromptCount(tokenCode);
        if (usedPrompts >= MAX_GUEST_PROMPTS) {
          let targetConversation = activeConversation;
          if (!targetConversation && onNewChat) {
            targetConversation = await onNewChat(selectedModelId);
          }
          if (targetConversation) {
            const limitMsg = {
              id: 'msg-limit-' + Date.now(),
              role: 'assistant',
              content: `⚠️ **Guest Prompt Limit Reached (5/5)**\n\nYou have used all 5 prompts allowed for this guest token. Please sign out and request a new guest access token from creator **yunard pogi** to continue using Zenith AI.`,
              timestamp: getCurrentTimestamp(),
              model: 'System',
            };
            targetConversation.messages = [...(targetConversation.messages || []), limitMsg];
            if (onSaveConversation) await onSaveConversation(targetConversation);
          }
          return;
        }

        // Increment guest prompt count
        await incrementGuestPromptCount(tokenCode);
      }
      
      let targetConversation = activeConversation;
      if (!targetConversation && onNewChat) {
        targetConversation = await onNewChat(selectedModelId);
      }
      if (!targetConversation) return;

      const userMsgId = 'msg-' + Date.now();
      const userMessage = {
        id: userMsgId,
        role: 'user',
        content: promptText,
        attachments: [...attachments],
        timestamp: getCurrentTimestamp(),
      };

      const updatedMessages = [...(targetConversation.messages || []), userMessage];
      targetConversation.messages = updatedMessages;

      // Auto-generate title if first message
      if (updatedMessages.length === 1 && (targetConversation.title === 'New Conversation' || !targetConversation.title)) {
        const autoTitle = promptText.length > 30 ? promptText.substring(0, 30) + '...' : promptText;
        targetConversation.title = autoTitle;
      }

      if (onSaveConversation) {
        onSaveConversation(targetConversation);
      }

      // Begin AI Generation State
      setIsGenerating(true);
      setCurrentStreamingText('');

      let fullText = '';
      abortControllerRef.current = new AbortController();

      try {
        const generator = streamAIResponse({
          prompt: promptText,
          modelId: selectedModelId || targetConversation.modelId || 'zenith-pro',
          files: attachments,
          messages: updatedMessages,
          apiKey: userSettings?.apiKey || '',
        });

        for await (const token of generator) {
          if (abortControllerRef.current?.signal?.aborted) {
            break;
          }
          fullText += token;
          setCurrentStreamingText(fullText);
        }

        const modelObj = getModelById(selectedModelId);
        const aiMsgId = 'msg-' + (Date.now() + 1);
        const aiMessage = {
          id: aiMsgId,
          role: 'assistant',
          content: fullText || 'No response generated.',
          timestamp: getCurrentTimestamp(),
          model: modelObj ? modelObj.name : 'Mikel',
        };

        targetConversation.messages.push(aiMessage);

        if (onSaveConversation) {
          await onSaveConversation(targetConversation);
        }

        // Record API Token usage stats
        recordUsage(promptText.length, fullText.length, selectedModelId);
      } catch (err) {
        console.error('Streaming error:', err);
      } finally {
        setIsGenerating(false);
        setCurrentStreamingText('');
        abortControllerRef.current = null;
      }
    },
    [activeConversation, onNewChat, onSaveConversation, selectedModelId, userSettings, user]
  );

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const regenerateResponse = useCallback(
    (messageId) => {
      if (!activeConversation || !activeConversation.messages) return;
      const messages = activeConversation.messages;
      const index = messages.findIndex((m) => m.id === messageId);
      if (index <= 0) return;

      const lastUserMsg = messages[index - 1];
      if (lastUserMsg && lastUserMsg.role === 'user') {
        activeConversation.messages = messages.slice(0, index);
        sendMessage(lastUserMsg.content, lastUserMsg.attachments || []);
      }
    },
    [activeConversation, sendMessage]
  );

  return {
    isGenerating,
    currentStreamingText,
    sendMessage,
    stopGenerating,
    regenerateResponse,
  };
}
