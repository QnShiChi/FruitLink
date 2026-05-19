'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AuthShell, Button, FormMessage, Input } from '@fruitlink/ui';
import { login } from '../../../lib/api/auth-api';
import { saveSession } from '../../../lib/auth/token-storage';

export default function DangNhapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    try {
      const response = await login(payload);
      saveSession(response.data.accessToken, response.data.user.role);
      router.push(response.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Đăng nhập hệ thống"
      title="Đăng nhập để theo dõi khoản đầu tư của bạn"
      description="Chỉ những tài khoản đã xác thực email mới có thể truy cập hệ thống FruitLink ở giai đoạn này."
      accent="saffron"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Email</label>
          <Input name="email" type="email" placeholder="Nhập địa chỉ email" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Mật khẩu</label>
          <Input name="password" type="password" placeholder="Nhập mật khẩu của bạn" required />
        </div>
        {error ? <FormMessage type="error" message={error} /> : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập vào hệ thống'}
        </Button>
        <p className="text-sm text-black/70">
          Chưa có tài khoản?{' '}
          <Link className="font-semibold underline" href="/dang-ky">
            Tạo tài khoản ngay
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
