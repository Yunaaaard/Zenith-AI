const SESSION_STORAGE_KEY = 'zenith_ai_session_user';
const SESSION_EXPIRY_KEY = 'zenith_ai_session_expiry';

// Session duration: 12 hours
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

export const saveSessionUser = (user, rememberMe = true) => {
  if (!user) return;
  const expiryTime = Date.now() + SESSION_DURATION_MS;
  const payload = JSON.stringify(user);

  if (rememberMe) {
    localStorage.setItem(SESSION_STORAGE_KEY, payload);
    localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
  } else {
    sessionStorage.setItem(SESSION_STORAGE_KEY, payload);
  }
};

export const getStoredSessionUser = () => {
  try {
    const localUser = localStorage.getItem(SESSION_STORAGE_KEY);
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (localUser && expiry) {
      if (Date.now() > parseInt(expiry, 10)) {
        clearSessionUser();
        return { user: null, expired: true };
      }
      return { user: JSON.parse(localUser), expired: false };
    }

    const sessionUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionUser) {
      return { user: JSON.parse(sessionUser), expired: false };
    }
  } catch (e) {
    console.error('Session retrieval error:', e);
  }
  return { user: null, expired: false };
};

export const clearSessionUser = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
};
