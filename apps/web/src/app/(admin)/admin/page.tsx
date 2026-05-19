import { Card } from '@fruitlink/ui';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold">Cổng quản trị hệ thống</h1>
        <Card>
          <p className="text-lg font-semibold">Tổng quan vận hành</p>
          <p className="mt-2 text-sm leading-6 text-black/80">
            Quản lý người dùng, dự án, nhật ký canh tác và trạng thái thanh toán trong một màn hình tập trung.
          </p>
        </Card>
      </div>
    </main>
  );
}
