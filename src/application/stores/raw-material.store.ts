import { create } from 'zustand';
import { RawMaterial } from '../../domain/entities/raw-material.entity';
import { RawMaterialRepository } from '../../domain/repositories/raw-material.repository';
import { CreateRawMaterialDTO, UpdateRawMaterialDTO } from '../dtos/raw-material.dto';

interface RawMaterialState {
  items: RawMaterial[];
  selectedItem: RawMaterial | null;
  isLoading: boolean;
  error: string | null;

  setRepository: (repo: RawMaterialRepository) => void;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: CreateRawMaterialDTO) => Promise<RawMaterial | undefined>;
  update: (id: string, data: UpdateRawMaterialDTO) => Promise<void>;
  remove: (id: string) => Promise<void>;
  select: (item: RawMaterial | null) => void;
  reset: () => void;
}

export const useRawMaterialStore = create<RawMaterialState>()((set, get) => {
  let repo: RawMaterialRepository | null = null;

  return {
    items: [],
    selectedItem: null,
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

    fetchById: async (id) => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        const item = await repo.findById(id);
        set({ selectedItem: item, isLoading: false });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    create: async (data) => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        const newItem = await repo.create({
          name: data.name,
          unit: data.unit,
          pricePerUnit: data.pricePerUnit,
          stockQuantity: data.stockQuantity ?? 0,
          category: data.category ?? null,
          notes: data.notes ?? null,
        });
        set((state) => ({
          items: [...state.items, newItem],
          isLoading: false,
        }));
        return newItem;
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    update: async (id, data) => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        const updated = await repo.update(id, data);
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? updated : i)),
          selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem,
          isLoading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    remove: async (id) => {
      if (!repo) return;
      set({ isLoading: true, error: null });
      try {
        await repo.delete(id);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
          isLoading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    select: (item) => set({ selectedItem: item }),
    reset: () =>
      set({ items: [], selectedItem: null, isLoading: false, error: null }),
  };
});
