import type { HTMLAttributes } from 'react';

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex rounded-full border border-black px-3 py-1 text-sm ${className}`.trim()} {...props} />;
}
