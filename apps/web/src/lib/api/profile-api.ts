import { API_BASE_URL, parseApiResponse } from './base';
import { getAuthorizationHeaders } from '../auth/session';
import type { ProfileResponse, UpdateProfilePayload } from '../types/auth';

export async function getMyProfile() {
  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthorizationHeaders(),
    },
  });

  return parseApiResponse<ProfileResponse>(response);
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<ProfileResponse>(response);
}
