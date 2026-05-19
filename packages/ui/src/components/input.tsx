import type { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        'w-full rounded border border-neutral-500 bg-white px-3 py-3 text-sm text-black outline-none transition',
        'placeholder:text-black/50 focus:border-black focus:shadow-[var(--shadow-subtle)]',
        className,
      ]
        .join(' ')
        .trim()}
      {...props}
    />
  );
}
