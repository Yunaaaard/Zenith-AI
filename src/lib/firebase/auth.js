import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isFirebaseConfigured, db } from './client';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const mapAuthError = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Unable to connect. Check your internet connection and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in your Firebase Console.';
    default:
      return 'Something went wrong while signing you in. Please try again.';
  }
};

export const loginWithEmailPassword = async (email, password) => {
  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (err) {
      console.error('Firebase Authentication Error:', err.code, err.message);
      return { user: null, error: mapAuthError(err.code) };
    }
  }

  // Developer Sandbox Auth mode when Firebase keys are not provided
  await new Promise((res) => setTimeout(res, 600));

  if (email.toLowerCase().includes('developer') || email.toLowerCase().endsWith('@zenith.ai') || email.toLowerCase().endsWith('@example.com') || email === 'developer@zenith.ai') {
    if (password.length < 4) {
      return { user: null, error: 'Invalid email or password. Please try again.' };
    }
    const mockUser = {
      uid: 'dev-uid-zenith-001',
      email: email,
      displayName: 'Developer',
      photoURL: null,
      role: 'developer',
    };
    return { user: mockUser, error: null };
  }

  const mockUser = {
    uid: 'unauthorized-user-uid-999',
    email: email,
    displayName: 'External User',
    photoURL: null,
    role: 'guest',
  };
  return { user: mockUser, error: null };
};

/**
 * 1. Step 1: Guest Requests Access Token
 * Sends name to backend server -> creates token record in Firebase Firestore
 */
export const requestGuestToken = async (guestName) => {
  if (!guestName || !guestName.trim()) {
    return { success: false, error: 'Please enter your name.' };
  }

  const name = guestName.trim();

  try {
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
    const endpoint = isDev ? '/api/auth/request-guest-token' : 'http://localhost:5000/api/auth/request-guest-token';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName: name }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.token) {
        // Save to Firestore with name-prefixed doc ID: e.g. "zel-ZENITH-321312"
        if (isFirebaseConfigured && db) {
          try {
            const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
            const firestoreId = `${nameSlug}-${data.token}`;
            await setDoc(doc(db, 'guestTokens', firestoreId), {
              token: data.token,
              guestName: name,
              status: 'approved',
              createdAt: new Date().toISOString(),
            }, { merge: true });
          } catch (e) {}
        }
        return { success: true, token: data.token, guestName: name, message: data.message };
      }
    }
  } catch (err) {
    console.warn('Backend request guest token notice:', err.message);
  }

  // Client-side fallback token generator
  const num = Math.floor(100000 + Math.random() * 900000);
  const fallbackToken = `ZENITH-${num}`;

  if (isFirebaseConfigured && db) {
    try {
      const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
      const firestoreId = `${nameSlug}-${fallbackToken}`;
      await setDoc(doc(db, 'guestTokens', firestoreId), {
        token: fallbackToken,
        guestName: name,
        status: 'approved',
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {}
  }

  return {
    success: true,
    token: fallbackToken,
    guestName: name,
    message: `Your token request (${fallbackToken}) has been saved in Firebase! Ask creator (yunard pogi) for access.`,
  };
};

/**
 * 2. Step 2: Guest Verifies Token Provided by Creator (yunard pogi)
 */
export const verifyGuestToken = async (tokenInput) => {
  if (!tokenInput || !tokenInput.trim()) {
    return { user: null, error: 'Please enter your guest access token.' };
  }

  const cleanToken = tokenInput.trim().toUpperCase();

  try {
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
    const endpoint = isDev ? '/api/auth/verify-guest-token' : 'http://localhost:5000/api/auth/verify-guest-token';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: cleanToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        // Store the ZENITH-XXXXXX token code (not the JWT) so logout can find the Firestore document
        localStorage.setItem('zenith_guest_token', data.tokenCode || cleanToken);
        return { user: data.user, error: null };
      }
    } else {
      const errData = await response.json().catch(() => ({}));
      if (errData.error) {
        return { user: null, error: errData.error };
      }
    }
  } catch (err) {
    console.warn('Backend verification notice (checking Firestore client directly):', err.message);
  }

  // Direct Firestore Verification Fallback — query by token field (doc ID is now name-prefixed)
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'guestTokens'), where('token', '==', cleanToken));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const data = querySnap.docs[0].data();

        // Reject if token has been expired (guest logged out)
        if (data.status === 'expired') {
          return {
            user: null,
            error: 'This token has expired (guest logged out). Please request a new token from creator (yunard pogi).',
          };
        }

        const nameSlug = (data.guestName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
        const tokenNum = cleanToken.replace('ZENITH-', '');
        const guestUid = data.uid || `guest-${nameSlug}-${tokenNum}`;

        const guestUser = {
          uid: guestUid,
          displayName: data.guestName || 'Guest User',
          email: `${(data.guestName || 'guest').toLowerCase().replace(/\s+/g, '')}@guest.zenith.ai`,
          role: 'guest',
          photoURL: null,
          tokenCode: cleanToken,
        };
        localStorage.setItem('zenith_guest_token', cleanToken);
        return { user: guestUser, error: null };
      }
    } catch (e) {
      console.warn('Firestore fallback query error:', e);
    }
  }

  return {
    user: null,
    error: 'Invalid or expired guest access token. Please ask creator (yunard pogi) for a valid token.',
  };
};

export const logoutUser = async (user) => {
  // Prefer token code from user object; fall back to localStorage
  const guestToken =
    (user?.tokenCode) ||
    (user?.role === 'guest' ? localStorage.getItem('zenith_guest_token') : null) ||
    localStorage.getItem('zenith_guest_token');

  // Only expire if it looks like a ZENITH- token code (not a JWT)
  const tokenCode = guestToken && guestToken.startsWith('ZENITH-') ? guestToken : null;

  if (tokenCode) {
    const now = new Date();
    const deleteAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day from now

    // 1. Notify backend to mark token as expired
    try {
      const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
      const endpoint = isDev
        ? '/api/auth/expire-guest-token'
        : 'http://localhost:5000/api/auth/expire-guest-token';

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenCode }),
      });
    } catch (e) {
      console.warn('Could not reach backend to expire token:', e.message);
    }

    // 2. Mark as expired in Firestore with deleteAt timestamp
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'guestTokens', tokenCode), {
          status: 'expired',
          expiredAt: now.toISOString(),
          deleteAt: deleteAt.toISOString(),
        }, { merge: true });
        console.log(`[ZENITH AUTH] Token ${tokenCode} marked as expired in Firestore.`);
      } catch (e) {
        console.warn('Could not update Firestore token status:', e.message);
      }
    }
  }

  localStorage.removeItem('zenith_guest_token');

  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    }
  }
};
