'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge, Button, Card } from '@fruitlink/ui';
import { getMe } from '../../../lib/api/auth-api';
import { clearSession } from '../../../lib/auth/token-storage';
import type { LoginResponse } from '../../../lib/types/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getMe();
        setUser(response.data);
      } catch {
        clearSession();
        window.location.href = '/dang-nhap';
      }
    }

    void loadUser();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-pale-ash)] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-black bg-white p-6 shadow-[var(--shadow-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge>Tài khoản nhà đầu tư</Badge>
            <h1 className="text-3xl font-bold">{user ? `Xin chào, ${user.email}` : 'Đang tải thông tin tài khoản...'}</h1>
            <p className="text-sm leading-6 text-black/70">Bạn đang ở Giai đoạn 1 của FruitLink: hoàn tất hồ sơ, xác thực tài khoản và chuẩn bị tham gia các mùa vụ đầu tư.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/ho-so">
              <Button>Đi tới hồ sơ cá nhân</Button>
            </Link>
            <Button type="button" variant="ghost" onClick={() => { clearSession(); window.location.href = '/dang-nhap'; }}>
              Đăng xuất
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-black/70">Trạng thái tài khoản</p>
            <p className="mt-2 text-2xl font-bold">{user?.status === 'active' ? 'Đang hoạt động' : 'Chờ xác thực'}</p>
          </Card>
          <Card className="bg-[var(--color-card-saffron)]">
            <p className="text-sm text-black/70">Vai trò hiện tại</p>
            <p className="mt-2 text-2xl font-bold">{user?.role === 'admin' ? 'Quản trị viên' : 'Nhà đầu tư'}</p>
          </Card>
          <Card className="bg-[var(--color-card-lavender)]">
            <p className="text-sm text-black/70">Xác thực email</p>
            <p className="mt-2 text-2xl font-bold">{user?.emailVerifiedAt ? 'Đã xác thực' : 'Chưa xác thực'}</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
