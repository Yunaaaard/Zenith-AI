const AUTHORIZED_DEVELOPER_UIDS = [
  'dev-uid-zenith-001',
  'DPrqlm5kY3epq1xNz3x4ImYdPvd2',
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AUTHORIZED_DEVELOPER_UID) || ''
].filter(Boolean);

export const isAuthorizedDeveloper = (user) => {
  if (!user) return false;

  // Check UID match if configured
  if (user.uid && AUTHORIZED_DEVELOPER_UIDS.includes(user.uid)) {
    return true;
  }

  // Check email matching developer domain or developer keyword
  if (user.email) {
    const lowerEmail = user.email.toLowerCase();
    if (
      lowerEmail === 'developer@zenith.ai' ||
      lowerEmail === 'developer@example.com' ||
      lowerEmail.includes('developer')
    ) {
      return true;
    }
  }

  // Role tag check & Guest access
  if (user.role === 'developer' || user.role === 'guest' || user.uid?.startsWith('guest-')) {
    return true;
  }

  return false;
};
