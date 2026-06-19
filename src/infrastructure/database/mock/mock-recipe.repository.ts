import { Recipe, RecipeWithMaterial } from '../../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../../domain/repositories/recipe.repository';
import * as uuid from 'react-native-uuid';
import { seedRecipes, seedRawMaterials } from '../seed-data';

export class MockRecipeRepository implements RecipeRepository {
  private items: Recipe[] = [...seedRecipes];

  async findByProductId(productId: string): Promise<RecipeWithMaterial[]> {
    return this.items
      .filter((r) => r.productId === productId)
      .map((r) => {
        const material = seedRawMaterials.find((rm) => rm.id === r.rawMaterialId);
        return {
          id: r.id,
          productId: r.productId,
          rawMaterialId: r.rawMaterialId,
          quantity: r.quantity,
          unit: r.unit as any,
          createdAt: r.createdAt,
          materialName: material?.name ?? 'Unknown',
          materialUnit: material?.unit ?? r.unit,
          materialPricePerUnit: material?.pricePerUnit ?? 0,
          subtotal: r.quantity * (material?.pricePerUnit ?? 0),
        };
      });
  }

  async create(
    data: Omit<Recipe, 'id' | 'createdAt'>
  ): Promise<Recipe> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();
    const item: Recipe = { id, ...data, createdAt: now };
    this.items.push(item);
    return item;
  }

  async createBatch(
    items: Omit<Recipe, 'id' | 'createdAt'>[]
  ): Promise<Recipe[]> {
    return Promise.all(items.map((item) => this.create(item)));
  }

  async update(id: string, data: Partial<Recipe>): Promise<Recipe> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Recipe not found');
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index !== -1) this.items.splice(index, 1);
  }

  async deleteByProductId(productId: string): Promise<void> {
    this.items = this.items.filter((r) => r.productId !== productId);
  }
}
