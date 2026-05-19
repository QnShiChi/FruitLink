import type { ReactNode } from 'react';
import { Card } from './card';

export function AuthShell(props: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: 'mint' | 'saffron' | 'lavender';
  children: ReactNode;
}) {
  const accentMap = {
    mint: 'bg-[var(--color-card-mint)]',
    saffron: 'bg-[var(--color-card-saffron)]',
    lavender: 'bg-[var(--color-card-lavender)]',
  } as const;

  return (
    <main className="min-h-screen bg-[var(--gradient-sky-breeze)] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold">
            {props.eyebrow}
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.96px] sm:text-5xl">
              {props.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-black/75 sm:text-lg">
              {props.description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-white">
              <p className="text-sm font-semibold">Đăng ký minh bạch</p>
              <p className="mt-2 text-sm leading-6 text-black/75">Xác thực tài khoản qua email trước khi đăng nhập vào hệ thống.</p>
            </Card>
            <Card className="bg-[var(--color-card-saffron)]">
              <p className="text-sm font-semibold">Vai trò rõ ràng</p>
              <p className="mt-2 text-sm leading-6 text-black/75">Người dùng tự đăng ký là nhà đầu tư, quản trị viên được seed sẵn.</p>
            </Card>
            <Card className="bg-[var(--color-card-lavender)]">
              <p className="text-sm font-semibold">Giao diện nhất quán</p>
              <p className="mt-2 text-sm leading-6 text-black/75">Toàn bộ biểu mẫu tuân theo hệ thiết kế light theme của FruitLink.</p>
            </Card>
          </div>
        </section>
        <Card className={`${accentMap[props.accent ?? 'mint']} p-0`}>
          <div className="rounded-lg bg-white p-6 sm:p-8">{props.children}</div>
        </Card>
      </div>
    </main>
  );
}
