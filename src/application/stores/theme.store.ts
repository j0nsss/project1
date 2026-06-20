import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AsyncStorage } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      setMode: (mode: ThemeMode) => set({ mode }),
      toggleMode: () => {
        const current = get().mode;
        set({ mode: current === 'light' ? 'dark' : 'light' });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
