import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-midnight-ink)',
        accent: 'var(--color-accent-green)',
        canvas: 'var(--color-canvas-white)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
      },
    },
  },
  plugins: [],
};

export default config;
