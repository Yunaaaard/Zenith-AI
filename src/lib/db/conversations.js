import { doc, setDoc, getDocs, collection, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/client';

// Key is per-user so different accounts never share conversation history
const getStorageKey = (userId) => `zenith_ai_conversations_${userId || 'anonymous'}`;

// --- LOCAL STORAGE CACHE HELPERS (per-user-uid) ---
export const getStoredConversations = (userId) => {
  const key = getStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Filter out any leftover legacy sample chats
      const cleaned = parsed.filter(
        (c) => c.id !== 'conv-001' && c.id !== 'conv-002' && c.id !== 'conv-003'
      );
      if (cleaned.length !== parsed.length) {
        saveStoredConversations(userId, cleaned);
      }
      return cleaned;
    }
  } catch (e) {}

  saveStoredConversations(userId, []);
  return [];
};

export const saveStoredConversations = (userId, conversations) => {
  const key = getStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations locally:', e);
  }
};

// --- FIREBASE FIRESTORE DB OPERATIONS ---

/**
 * Sync and fetch all conversations for a user from Firestore
 */
export const fetchUserConversations = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      const convRef = collection(db, 'users', userId, 'conversations');
      const q = query(convRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const firestoreConvs = [];
      querySnapshot.forEach((docSnap) => {
        firestoreConvs.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (firestoreConvs.length > 0) {
        saveStoredConversations(userId, firestoreConvs);
        return firestoreConvs;
      }
    } catch (err) {
      console.warn('Firestore fetch notice (using cache):', err.message);
    }
  }
  return getStoredConversations(userId);
};

/**
 * Save or update a conversation in Firestore and Local Storage
 */
export const saveConversation = async (userId, conversation) => {
  if (!conversation) return;

  const currentLocal = getStoredConversations(userId);
  const existingIdx = currentLocal.findIndex((c) => c.id === conversation.id);
  
  let updatedLocal;
  if (existingIdx >= 0) {
    updatedLocal = [...currentLocal];
    updatedLocal[existingIdx] = { ...conversation, updatedAt: new Date().toISOString() };
  } else {
    updatedLocal = [{ ...conversation, updatedAt: new Date().toISOString() }, ...currentLocal];
  }

  saveStoredConversations(userId, updatedLocal);

  // Firestore Sync
  if (isFirebaseConfigured && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'conversations', conversation.id);
      await setDoc(docRef, {
        title: conversation.title || 'New Conversation',
        modelId: conversation.modelId || 'zenith-pro',
        createdAt: conversation.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archived: Boolean(conversation.archived),
        messages: conversation.messages || [],
      }, { merge: true });
    } catch (err) {
      console.error('Firestore save error:', err);
    }
  }

  return updatedLocal;
};

/**
 * Create a new conversation
 */
export const createNewConversation = async (userId, initialTitle = 'New Conversation', modelId = 'zenith-mikel') => {
  const newConv = {
    id: 'conv-' + Date.now(),
    title: initialTitle,
    modelId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
    group: 'Today',
    messages: [],
  };

  await saveConversation(userId, newConv);
  return newConv;
};

/**
 * Update conversation title
 */
export const updateConversationTitle = async (userId, id, newTitle) => {
  const conversations = getStoredConversations(userId);
  const target = conversations.find((c) => c.id === id);
  if (target) {
    target.title = newTitle;
    await saveConversation(userId, target);
  }
  return getStoredConversations(userId);
};

/**
 * Toggle archive status
 */
export const toggleArchiveConversation = async (userId, id) => {
  const conversations = getStoredConversations(userId);
  const target = conversations.find((c) => c.id === id);
  if (target) {
    target.archived = !target.archived;
    await saveConversation(userId, target);
  }
  return getStoredConversations(userId);
};

/**
 * Delete a conversation from Firestore & Local Storage
 */
export const deleteConversation = async (userId, id) => {
  const conversations = getStoredConversations(userId);
  const updatedLocal = conversations.filter((c) => c.id !== id);
  saveStoredConversations(userId, updatedLocal);

  if (isFirebaseConfigured && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'conversations', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Firestore delete error:', err);
    }
  }

  return updatedLocal;
};

/**
 * Clear all conversations
 */
export const clearAllConversations = async (userId) => {
  const conversations = getStoredConversations(userId);
  saveStoredConversations(userId, []);

  if (isFirebaseConfigured && db && userId) {
    for (const c of conversations) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'conversations', c.id));
      } catch (e) {}
    }
  }

  return [];
};
