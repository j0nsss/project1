import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  mode: 'light',
  setMode: (mode: ThemeMode) => set({ mode }),
  toggleMode: () => {
    const current = get().mode;
    set({ mode: current === 'light' ? 'dark' : 'light' });
  },
}));
