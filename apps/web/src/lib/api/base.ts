export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function parseApiResponse<T>(response: Response): Promise<{ message: string; data: T }> {
  const payload = (await response.json()) as { message?: string; data?: T };

  if (!response.ok) {
    throw new Error(payload.message ?? 'Yêu cầu không thành công.');
  }

  return {
    message: payload.message ?? 'Thành công.',
    data: payload.data as T,
  };
}
