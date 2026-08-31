import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/client';

export const MAX_GUEST_PROMPTS = 5;

/**
 * Gets local prompt count used by the guest token
 */
export const getGuestPromptCount = (tokenCode) => {
  if (!tokenCode) return 0;
  try {
    const raw = localStorage.getItem(`zenith_guest_prompts_${tokenCode}`);
    return raw ? parseInt(raw, 10) : 0;
  } catch (e) {
    return 0;
  }
};

/**
 * Increments prompt count for the guest token (in LocalStorage + Firestore)
 */
export const incrementGuestPromptCount = async (tokenCode) => {
  if (!tokenCode) return 0;
  const current = getGuestPromptCount(tokenCode);
  const next = current + 1;
  try {
    localStorage.setItem(`zenith_guest_prompts_${tokenCode}`, next.toString());
  } catch (e) {}

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'guestTokens', tokenCode);
      await setDoc(docRef, {
        promptCount: next,
        lastPromptAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not update promptCount in Firestore:', e);
    }
  }
  return next;
};

/**
 * Checks if a guest has reached their prompt limit (5 prompts)
 */
export const isGuestLimitReached = (user) => {
  const isGuest = user?.role === 'guest' || user?.uid?.startsWith('guest-');
  if (!isGuest) return false;

  const tokenCode = user?.tokenCode || localStorage.getItem('zenith_guest_token');
  if (!tokenCode) return false;

  const count = getGuestPromptCount(tokenCode);
  return count >= MAX_GUEST_PROMPTS;
};
