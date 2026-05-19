'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AuthShell, Button, FormMessage, Input } from '@fruitlink/ui';
import { registerInvestor } from '../../../lib/api/auth-api';

export default function DangKyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };

    try {
      const response = await registerInvestor(payload);
      setSuccess(response.message);
      router.push(`/xac-thuc-otp?email=${encodeURIComponent(payload.email)}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Đăng ký tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Bắt đầu hành trình đầu tư"
      title="Tạo tài khoản nhà đầu tư FruitLink"
      description="Đăng ký bằng email để theo dõi mùa vụ, xác thực bằng mã OTP và bắt đầu hành trình đầu tư nông sản minh bạch."
      accent="mint"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Họ và tên</label>
          <Input name="fullName" placeholder="Nhập họ và tên của bạn" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Email</label>
          <Input name="email" type="email" placeholder="Nhập địa chỉ email" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Mật khẩu</label>
          <Input name="password" type="password" placeholder="Tạo mật khẩu từ 8 ký tự trở lên" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Xác nhận mật khẩu</label>
          <Input name="confirmPassword" type="password" placeholder="Nhập lại mật khẩu để xác nhận" required />
        </div>
        {error ? <FormMessage type="error" message={error} /> : null}
        {success ? <FormMessage type="success" message={success} /> : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản nhà đầu tư'}
        </Button>
        <p className="text-sm text-black/70">
          Bạn đã có tài khoản?{' '}
          <Link className="font-semibold underline" href="/dang-nhap">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
