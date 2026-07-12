import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme: Theme) => {
        set({ theme });
        const resolved = theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme;
        set({ resolvedTheme: resolved });
        document.documentElement.classList.toggle('dark', resolved === 'dark');
      },

      initializeTheme: () => {
        const { theme } = get();
        const resolved = theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme;
        set({ resolvedTheme: resolved });
        document.documentElement.classList.toggle('dark', resolved === 'dark');

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const { theme } = get();
          if (theme === 'system') {
            const newResolved = e.matches ? 'dark' : 'light';
            set({ resolvedTheme: newResolved });
            document.documentElement.classList.toggle('dark', newResolved === 'dark');
          }
        });
      },
    }),
    {
      name: 'assetflow-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);