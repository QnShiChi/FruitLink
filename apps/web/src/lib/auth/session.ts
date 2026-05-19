import { clearSession, getAccessToken } from './token-storage';

export function getAuthorizationHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function handleUnauthorized() {
  clearSession();
  if (typeof window !== 'undefined') {
    window.location.href = '/dang-nhap';
  }
}
