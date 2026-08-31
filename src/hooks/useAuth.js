import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase/client';
import { loginWithEmailPassword, requestGuestToken, verifyGuestToken, logoutUser } from '../lib/firebase/auth';
import { isAuthorizedDeveloper } from '../lib/auth/permissions';
import { saveSessionUser, getStoredSessionUser, clearSessionUser } from '../lib/auth/session';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Initialize auth state
  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const authUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Developer',
            photoURL: firebaseUser.photoURL,
          };
          const authorized = isAuthorizedDeveloper(authUser);
          setUser(authUser);
          setIsAuthorized(authorized);
          saveSessionUser(authUser, true);
        } else {
          setUser(null);
          setIsAuthorized(false);
        }
        setLoading(false);
      });
    } else {
      // Check stored session for sandbox mode
      const { user: storedUser, expired } = getStoredSessionUser();
      if (expired) {
        setSessionExpired(true);
      } else if (storedUser) {
        setUser(storedUser);
        setIsAuthorized(isAuthorizedDeveloper(storedUser));
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    setLoading(true);
    setAuthError(null);
    setSessionExpired(false);

    if (!email || !email.trim()) {
      setLoading(false);
      setAuthError('Please enter your email.');
      return { success: false, error: 'Please enter your email.' };
    }

    if (!email.includes('@') || !email.includes('.')) {
      setLoading(false);
      setAuthError('Please enter a valid email address.');
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password) {
      setLoading(false);
      setAuthError('Please enter your password.');
      return { success: false, error: 'Please enter your password.' };
    }

    const { user: authUser, error } = await loginWithEmailPassword(email, password);

    setLoading(false);

    if (error) {
      setAuthError(error);
      return { success: false, error };
    }

    if (authUser) {
      const authorized = isAuthorizedDeveloper(authUser);
      setUser(authUser);
      setIsAuthorized(authorized);
      saveSessionUser(authUser, rememberMe);
      return { success: true, user: authUser, isAuthorized: authorized };
    }

    return { success: false, error: 'Something went wrong while signing you in. Please try again.' };
  }, []);

  const handleRequestGuestToken = useCallback(async (guestName) => {
    setLoading(true);
    setAuthError(null);
    const res = await requestGuestToken(guestName);
    setLoading(false);
    if (!res.success && res.error) {
      setAuthError(res.error);
    }
    return res;
  }, []);

  const handleVerifyGuestToken = useCallback(async (tokenInput) => {
    setLoading(true);
    setAuthError(null);
    setSessionExpired(false);

    const { user: authUser, error } = await verifyGuestToken(tokenInput);
    setLoading(false);

    if (error) {
      setAuthError(error);
      return { success: false, error };
    }

    if (authUser) {
      setUser(authUser);
      setIsAuthorized(true);
      saveSessionUser(authUser, true);
      return { success: true, user: authUser, isAuthorized: true };
    }

    return { success: false, error: 'Failed to verify guest token.' };
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await logoutUser(user);
    clearSessionUser();
    setUser(null);
    setIsAuthorized(false);
    setSessionExpired(false);
    setLoading(false);
  }, [user]);

  const dismissSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  return {
    user,
    loading,
    authError,
    isAuthorized,
    sessionExpired,
    login,
    handleRequestGuestToken,
    handleVerifyGuestToken,
    logout,
    dismissSessionExpired,
    setAuthError,
  };
}
