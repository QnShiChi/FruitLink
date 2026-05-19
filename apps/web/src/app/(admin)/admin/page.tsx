'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Card } from '@fruitlink/ui';
import { getMe } from '../../../lib/api/auth-api';
import { clearSession } from '../../../lib/auth/token-storage';
import type { LoginResponse } from '../../../lib/types/auth';

export default function AdminPage() {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getMe();
        if (response.data.role !== 'admin') {
          window.location.href = '/dashboard';
          return;
        }
        setUser(response.data);
      } catch {
        clearSession();
        window.location.href = '/dang-nhap';
      }
    }

    void loadUser();
  }, []);

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-3">
          <Badge>Khu vực quản trị viên</Badge>
          <h1 className="text-3xl font-bold">Cổng quản trị hệ thống</h1>
          <p className="text-sm leading-6 text-black/70">Tài khoản seed sẵn đang đăng nhập: {user?.email ?? 'Đang tải...'}</p>
        </div>
        <Card>
          <p className="text-lg font-semibold">Tổng quan vận hành Giai đoạn 1</p>
          <p className="mt-2 text-sm leading-6 text-black/80">Từ màn hình này, quản trị viên có thể kiểm tra việc seed tài khoản, xác thực quyền truy cập và chuẩn bị cho các phân hệ quản lý dự án ở sprint tiếp theo.</p>
          <div className="mt-4">
            <Button type="button" variant="ghost" onClick={() => { clearSession(); window.location.href = '/dang-nhap'; }}>
              Đăng xuất tài khoản quản trị viên
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
