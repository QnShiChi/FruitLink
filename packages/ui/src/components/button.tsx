import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded border px-6 py-3 text-sm font-semibold';
  const tone =
    variant === 'primary'
      ? 'border-black bg-[var(--color-accent-green)] text-black shadow-[var(--shadow-subtle)]'
      : 'border-black bg-white text-black shadow-[var(--shadow-subtle)]';

  return <button className={`${base} ${tone} ${className}`.trim()} {...props} />;
}
