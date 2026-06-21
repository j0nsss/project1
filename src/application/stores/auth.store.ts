import { create } from 'zustand';

interface AuthState {
  role: 'OWNER' | 'KARYAWAN' | null;
  cloudBackupStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';
  lastBackupTime: string | null;

  login: (role: 'OWNER' | 'KARYAWAN') => void;
  logout: () => void;
  triggerBackup: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  role: 'OWNER', // default to Owner for immediate use, but let them change
  cloudBackupStatus: 'IDLE',
  lastBackupTime: new Date().toLocaleString(),

  login: (role) => set({ role }),
  logout: () => set({ role: null }),
  triggerBackup: async () => {
    set({ cloudBackupStatus: 'SYNCING' });
    // Simulate API delay for backup
    await new Promise((resolve) => setTimeout(resolve, 2500));
    set({
      cloudBackupStatus: 'SUCCESS',
      lastBackupTime: new Date().toLocaleString(),
    });
    setTimeout(() => {
      set({ cloudBackupStatus: 'IDLE' });
    }, 2000);
  },
}));
