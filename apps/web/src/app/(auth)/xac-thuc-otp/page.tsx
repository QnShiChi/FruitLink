'use client';

import { useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { AuthShell, Button, FormMessage, Input } from '@fruitlink/ui';
import { resendRegisterOtp, verifyRegisterOtp } from '../../../lib/api/auth-api';

export default function XacThucOtpPage() {
  const searchParams = useSearchParams();
  const defaultEmail = useMemo(() => searchParams.get('email') ?? '', [searchParams]);
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get('email') ?? ''),
      otpCode: String(formData.get('otpCode') ?? ''),
    };

    try {
      const response = await verifyRegisterOtp(payload);
      setSuccess(response.message);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Xác thực đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await resendRegisterOtp(email);
      setSuccess(response.message);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Gửi lại mã OTP thất bại.');
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Xác thực email"
      title="Nhập mã OTP để kích hoạt tài khoản"
      description="FruitLink đã gửi mã OTP đến email của bạn. Hãy nhập đúng mã để hoàn tất đăng ký tài khoản nhà đầu tư."
      accent="lavender"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Email</label>
          <Input name="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Nhập lại địa chỉ email" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Mã OTP</label>
          <Input name="otpCode" placeholder="Nhập mã OTP gồm 6 chữ số" required />
        </div>
        {error ? <FormMessage type="error" message={error} /> : null}
        {success ? <FormMessage type="success" message={success} /> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" type="submit" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Xác thực đăng ký'}
          </Button>
          <Button className="flex-1" type="button" variant="ghost" disabled={sending} onClick={onResend}>
            {sending ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
