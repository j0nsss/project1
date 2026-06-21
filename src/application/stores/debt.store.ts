import { create } from 'zustand';
import { Debt } from '../../domain/entities/debt.entity';
import { DebtRepository } from '../../domain/repositories/debt.repository';

interface DebtState {
  items: Debt[];
  isLoading: boolean;
  error: string | null;

  setRepository: (repo: DebtRepository) => void;
  fetchAll: () => Promise<void>;
  createDebt: (data: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Debt | undefined>;
  updateDebt: (id: string, data: Partial<Debt>) => Promise<void>;
  removeDebt: (id: string) => Promise<void>;
}

export const useDebtStore = create<DebtState>()((set, get) => {
  let repo: DebtRepository | null = null;

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

    createDebt: async (data) => {
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

    updateDebt: async (id, data) => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        const updated = await repo.update(id, data);
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? updated : i)),
          isLoading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    removeDebt: async (id) => {
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
  };
});
