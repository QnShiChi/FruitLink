import { Card } from '@fruitlink/ui';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--color-pale-ash)] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold">Bảng điều khiển nhà đầu tư và nông dân</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-black/70">Dự án đang theo dõi</p>
            <p className="mt-2 text-3xl font-bold">03</p>
          </Card>
          <Card className="bg-[var(--color-card-saffron)]">
            <p className="text-sm text-black/70">Khoản đầu tư đang hoạt động</p>
            <p className="mt-2 text-3xl font-bold">12</p>
          </Card>
          <Card className="bg-[var(--color-card-lavender)]">
            <p className="text-sm text-black/70">Thông báo mới</p>
            <p className="mt-2 text-3xl font-bold">05</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
