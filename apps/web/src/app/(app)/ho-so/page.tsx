'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, FormMessage, Input } from '@fruitlink/ui';
import { getMyProfile, updateMyProfile } from '../../../lib/api/profile-api';
import { handleUnauthorized } from '../../../lib/auth/session';
import type { ProfileResponse } from '../../../lib/types/auth';

export default function HoSoPage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getMyProfile();
        setProfile(response.data);
      } catch (profileError) {
        if (profileError instanceof Error && profileError.message.includes('xác thực')) {
          handleUnauthorized();
          return;
        }
        setError(profileError instanceof Error ? profileError.message : 'Không thể tải hồ sơ cá nhân.');
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get('fullName') ?? ''),
      phoneNumber: String(formData.get('phoneNumber') ?? ''),
    };

    try {
      const response = await updateMyProfile(payload);
      setProfile(response.data);
      setSuccess(response.message);
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : 'Cập nhật hồ sơ thất bại.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="p-6">Đang tải hồ sơ cá nhân...</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--color-pale-ash)] p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
          <p className="mt-2 text-sm leading-6 text-black/70">Cập nhật thông tin cơ bản để chuẩn bị cho các giai đoạn đầu tư tiếp theo.</p>
        </div>
        <Card>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Họ và tên</label>
              <Input name="fullName" defaultValue={profile?.fullName ?? ''} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email</label>
              <Input name="email" defaultValue={profile?.email ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Số điện thoại</label>
              <Input name="phoneNumber" defaultValue={profile?.phoneNumber ?? ''} placeholder="Nhập số điện thoại liên hệ" />
            </div>
            {error ? <FormMessage type="error" message={error} /> : null}
            {success ? <FormMessage type="success" message={success} /> : null}
            <Button type="submit" disabled={saving}>
              {saving ? 'Đang lưu thay đổi...' : 'Lưu thay đổi hồ sơ'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
