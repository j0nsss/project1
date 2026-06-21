import { create } from 'zustand';
import { CashEntry } from '../../domain/entities/cash-entry.entity';
import { CashEntryRepository } from '../../domain/repositories/cash-entry.repository';

interface CashBookState {
  items: CashEntry[];
  isLoading: boolean;
  error: string | null;

  setRepository: (repo: CashEntryRepository) => void;
  fetchAll: () => Promise<void>;
  createEntry: (data: Omit<CashEntry, 'id' | 'createdAt'>) => Promise<CashEntry | undefined>;
  removeEntry: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useCashBookStore = create<CashBookState>()((set, get) => {
  let repo: CashEntryRepository | null = null;

  return {
    items: [],
    isLoading: false,
    error: null,

    setRepository: (r) => {
      repo = r;
    },

    fetchAll: async () => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        const items = await repo.findAll();
        set({ items, isLoading: false });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    createEntry: async (data) => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        const newItem = await repo.create(data);
        set((state) => ({ items: [newItem, ...state.items], isLoading: false }));
        return newItem;
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    removeEntry: async (id) => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        await repo.delete(id);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          isLoading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    clearAll: async () => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        await repo.clearAll();
        set({ items: [], isLoading: false });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },
  };
});
