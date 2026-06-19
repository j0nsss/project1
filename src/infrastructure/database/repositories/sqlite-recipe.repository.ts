import * as SQLite from 'expo-sqlite';
import { Recipe, RecipeWithMaterial } from '../../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../../domain/repositories/recipe.repository';
import * as uuid from 'react-native-uuid';

export class SqliteRecipeRepository implements RecipeRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findByProductId(productId: string): Promise<RecipeWithMaterial[]> {
    const rows = await this.db.getAllAsync<any[]>(
      `SELECT r.id, r.product_id, r.raw_material_id, r.quantity, r.unit, r.created_at,
              rm.name as material_name, rm.unit as material_unit, rm.price_per_unit,
              (r.quantity * rm.price_per_unit) as subtotal
       FROM recipes r
       JOIN raw_materials rm ON rm.id = r.raw_material_id
       WHERE r.product_id = ?
       ORDER BY rm.name ASC`,
      productId
    );

    return rows.map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      rawMaterialId: row.raw_material_id,
      quantity: row.quantity,
      unit: row.unit,
      createdAt: row.created_at,
      materialName: row.material_name,
      materialUnit: row.material_unit,
      materialPricePerUnit: row.price_per_unit,
      subtotal: row.subtotal,
    }));
  }

  async create(
    data: Omit<Recipe, 'id' | 'createdAt'>
  ): Promise<Recipe> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO recipes (id, product_id, raw_material_id, quantity, unit, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      id, data.productId, data.rawMaterialId, data.quantity, data.unit, now
    );

    return {
      id,
      productId: data.productId,
      rawMaterialId: data.rawMaterialId,
      quantity: data.quantity,
      unit: data.unit as any,
      createdAt: now,
    };
  }

  async createBatch(
    items: Omit<Recipe, 'id' | 'createdAt'>[]
  ): Promise<Recipe[]> {
    const results: Recipe[] = [];
    for (const item of items) {
      results.push(await this.create(item));
    }
    return results;
  }

  async update(
    id: string,
    data: Partial<Recipe>
  ): Promise<Recipe> {
    const sets: string[] = [];
    const values: any[] = [];

    if (data.rawMaterialId !== undefined) {
      sets.push('raw_material_id = ?');
      values.push(data.rawMaterialId);
    }
    if (data.quantity !== undefined) {
      sets.push('quantity = ?');
      values.push(data.quantity);
    }
    if (data.unit !== undefined) {
      sets.push('unit = ?');
      values.push(data.unit);
    }

    if (sets.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    await this.db.runAsync(
      `UPDATE recipes SET ${sets.join(', ')} WHERE id = ?`,
      ...values
    );

    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM recipes WHERE id = ?', id
    );
    return {
      id: row.id,
      productId: row.product_id,
      rawMaterialId: row.raw_material_id,
      quantity: row.quantity,
      unit: row.unit,
      createdAt: row.created_at,
    };
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM recipes WHERE id = ?', id);
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.db.runAsync(
      'DELETE FROM recipes WHERE product_id = ?', productId
    );
  }
}
