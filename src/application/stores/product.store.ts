import { create } from 'zustand';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';

interface ProductState {
  items: Product[];
  selectedItem: Product | null;
  isLoading: boolean;
  error: string | null;

  setRepository: (repo: ProductRepository) => void;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: CreateProductDTO) => Promise<Product | undefined>;
  update: (id: string, data: UpdateProductDTO) => Promise<void>;
  remove: (id: string) => Promise<void>;
  select: (item: Product | null) => void;
  reset: () => void;
}

export const useProductStore = create<ProductState>()((set, get) => {
  let repo: ProductRepository | null = null;

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
          description: data.description ?? null,
          category: data.category ?? null,
          sellingPrice: data.sellingPrice ?? null,
          imageUri: data.imageUri ?? null,
          isActive: true,
        });
        set((state) => ({ items: [...state.items, newItem], isLoading: false }));
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
