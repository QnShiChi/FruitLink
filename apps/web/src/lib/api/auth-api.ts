import { API_BASE_URL, parseApiResponse } from './base';
import { getAuthorizationHeaders } from '../auth/session';
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOtpPayload,
} from '../types/auth';

export async function registerInvestor(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<RegisterResponse>(response);
}

export async function verifyRegisterOtp(payload: VerifyOtpPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-register-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<RegisterResponse>(response);
}

export async function resendRegisterOtp(email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/resend-register-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return parseApiResponse<RegisterResponse>(response);
}

export async function login(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<LoginResponse>(response);
}

export async function getMe() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthorizationHeaders(),
    },
  });

  return parseApiResponse<LoginResponse['user']>(response);
}
