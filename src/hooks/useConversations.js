import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getStoredConversations,
  fetchUserConversations,
  saveConversation,
  createNewConversation,
  updateConversationTitle,
  toggleArchiveConversation,
  deleteConversation,
  clearAllConversations,
} from '../lib/db/conversations';

export function useConversations(user) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load & sync from Firestore when user authenticates
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoadingHistory(true);
      const userId = user?.uid;
      const loaded = await fetchUserConversations(userId);

      if (isMounted) {
        setConversations(loaded);
        setActiveId(loaded.length > 0 ? loaded[0].id : null);
        setLoadingHistory(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeId) || null;
  }, [conversations, activeId]);

  const handleNewChat = useCallback(async (modelId = 'zenith-pro') => {
    const userId = user?.uid;
    const newConv = await createNewConversation(userId, 'New Conversation', modelId);
    setConversations(getStoredConversations(userId));
    setActiveId(newConv.id);
    return newConv;
  }, [user?.uid]);

  const handleSelectChat = useCallback((id) => {
    setActiveId(id);
  }, []);

  const handleRenameChat = useCallback(async (id, newTitle) => {
    const userId = user?.uid;
    const updated = await updateConversationTitle(userId, id, newTitle);
    setConversations(updated);
  }, [user?.uid]);

  const handleArchiveChat = useCallback(async (id) => {
    const userId = user?.uid;
    const updated = await toggleArchiveConversation(userId, id);
    setConversations(updated);
  }, [user?.uid]);

  const handleDeleteChat = useCallback(async (id) => {
    const userId = user?.uid;
    const updated = await deleteConversation(userId, id);
    setConversations(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  }, [activeId, user?.uid]);

  const handleClearAll = useCallback(async () => {
    const userId = user?.uid;
    const updated = await clearAllConversations(userId);
    setConversations(updated);
    setActiveId(null);
  }, [user?.uid]);

  const saveActiveConversation = useCallback(async (conversation) => {
    const userId = user?.uid;
    const updated = await saveConversation(userId, conversation);
    if (updated) {
      setConversations(updated);
    }
  }, [user?.uid]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations.filter(c => !c.archived);
    const q = searchQuery.toLowerCase();
    return conversations.filter(c => 
      !c.archived && (
        c.title.toLowerCase().includes(q) ||
        c.messages?.some(m => m.content?.toLowerCase().includes(q))
      )
    );
  }, [conversations, searchQuery]);

  const groupedConversations = useMemo(() => {
    const groups = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: [],
    };

    filteredConversations.forEach((c) => {
      const date = new Date(c.createdAt || Date.now());
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 && date.getDate() === now.getDate()) {
        groups['Today'].push(c);
      } else if (diffDays <= 1) {
        groups['Yesterday'].push(c);
      } else if (diffDays <= 7) {
        groups['Previous 7 Days'].push(c);
      } else {
        groups['Older'].push(c);
      }
    });

    return groups;
  }, [filteredConversations]);

  return {
    conversations,
    activeId,
    activeConversation,
    searchQuery,
    setSearchQuery,
    groupedConversations,
    loadingHistory,
    handleNewChat,
    handleSelectChat,
    handleRenameChat,
    handleArchiveChat,
    handleDeleteChat,
    handleClearAll,
    saveActiveConversation,
    setConversations,
  };
}
