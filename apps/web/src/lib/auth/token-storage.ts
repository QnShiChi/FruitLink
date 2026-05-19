const ACCESS_TOKEN_KEY = 'fruitlink_access_token';
const USER_ROLE_KEY = 'fruitlink_user_role';

export function saveSession(accessToken: string, role: string) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_ROLE_KEY, role);
  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=86400; samesite=lax`;
  document.cookie = `${USER_ROLE_KEY}=${role}; path=/; max-age=86400; samesite=lax`;
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${USER_ROLE_KEY}=; path=/; max-age=0; samesite=lax`;
}

export function getAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getUserRole() {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(USER_ROLE_KEY);
}
