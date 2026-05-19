import { Badge, Button, Card } from '@fruitlink/ui';

const quyTrinh = [
  {
    tieuDe: 'Chọn mùa vụ phù hợp',
    moTa: 'Theo dõi vùng trồng, sản lượng kỳ vọng và kế hoạch canh tác minh bạch trước khi đầu tư.',
  },
  {
    tieuDe: 'Đầu tư và nhận mã theo dõi',
    moTa: 'Mỗi khoản đầu tư được ghi nhận rõ ràng để bạn theo dõi tiến độ, thanh toán và quyền lợi.',
  },
  {
    tieuDe: 'Theo dõi đến ngày thu hoạch',
    moTa: 'Nhật ký canh tác, cập nhật hình ảnh và truy xuất nguồn gốc luôn sẵn sàng trên hệ thống.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="bg-[var(--gradient-sky-breeze)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <Badge>Hệ sinh thái đầu tư nông sản</Badge>
            <h1 className="text-5xl font-bold leading-tight tracking-[-0.96px]">
              Đầu tư nông sản minh bạch, theo dõi đến ngày thu hoạch.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-black/80">
              FruitLink kết nối nhà đầu tư, nông dân và hệ thống truy xuất nguồn gốc trong một nền tảng duy nhất.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button>Khám phá dự án</Button>
              <Button variant="ghost">Xem cách hoạt động</Button>
            </div>
          </div>
          <Card className="max-w-md bg-[var(--color-card-mint)]">
            <p className="text-sm font-semibold uppercase tracking-wide">Chu kỳ 3 bước</p>
            <div className="mt-4 space-y-4">
              {quyTrinh.map((item, index) => (
                <div key={item.tieuDe} className="rounded-lg border border-black bg-white p-4">
                  <p className="text-sm font-semibold">Bước {index + 1}</p>
                  <h2 className="mt-1 text-xl font-bold">{item.tieuDe}</h2>
                  <p className="mt-2 text-sm leading-6 text-black/80">{item.moTa}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
