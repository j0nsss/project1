import { create } from 'zustand';

type Theme = 'light' | 'dark';
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UIState {
  theme: Theme;
  isAppReady: boolean;
  toasts: Toast[];

  setTheme: (theme: Theme) => void;
  setAppReady: (ready: boolean) => void;
  showToast: (type: ToastType, message: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  theme: 'light',
  isAppReady: false,
  toasts: [],

  setTheme: (theme) => set({ theme }),
  setAppReady: (ready) => set({ isAppReady: ready }),

  showToast: (type, message, duration = 3000) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
