import { create } from 'zustand';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RecipeItemDTO } from '../dtos/recipe.dto';
import * as uuid from 'react-native-uuid';

interface RecipeState {
  setRepository: (repo: RecipeRepository) => void;
  saveRecipe: (productId: string, items: RecipeItemDTO[]) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>()((set, get) => {
  let repo: RecipeRepository | null = null;

  return {
    setRepository: (r) => {
      repo = r;
    },

    saveRecipe: async (productId, items) => {
      if (!repo) return;

      await repo.deleteByProductId(productId);

      await repo.createBatch(
        items.map((item) => ({
          productId,
          rawMaterialId: item.rawMaterialId,
          quantity: item.quantity,
          unit: item.unit,
        }))
      );
    },
  };
});
