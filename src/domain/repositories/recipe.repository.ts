import { Recipe, RecipeWithMaterial } from '../entities/recipe.entity';

export interface RecipeRepository {
  findByProductId(productId: string): Promise<RecipeWithMaterial[]>;
  create(
    data: Omit<Recipe, 'id' | 'createdAt'>
  ): Promise<Recipe>;
  createBatch(items: Omit<Recipe, 'id' | 'createdAt'>[]): Promise<Recipe[]>;
  update(id: string, data: Partial<Recipe>): Promise<Recipe>;
  delete(id: string): Promise<void>;
  deleteByProductId(productId: string): Promise<void>;
}
