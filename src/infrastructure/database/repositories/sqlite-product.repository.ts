import * as SQLite from 'expo-sqlite';
import { Product } from '../../../domain/entities/product.entity';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import * as uuid from 'react-native-uuid';
import { toDomain, toRow } from '../mappers/product.mapper';

export class SqliteProductRepository implements ProductRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findAll(): Promise<Product[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM products ORDER BY name ASC'
    );
    return rows.map(toDomain);
  }

  async findActive(): Promise<Product[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM products WHERE is_active = 1 ORDER BY name ASC'
    );
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM products WHERE id = ?', id
    );
    return row ? toDomain(row) : null;
  }

  async create(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();
    const row = { ...toRow(data), id, created_at: now, updated_at: now };

    await this.db.runAsync(
      `INSERT INTO products (id, name, description, category, selling_price, image_uri, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      row.id, row.name, row.description, row.category,
      row.selling_price, row.image_uri, row.is_active,
      row.created_at, row.updated_at
    );

    return toDomain(await this.db.getFirstAsync<any>(
      'SELECT * FROM products WHERE id = ?', id
    ));
  }

  async update(
    id: string,
    data: Partial<Product>
  ): Promise<Product> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Product not found');

    const merged = { ...existing, ...data, updatedAt: new Date().toISOString() };

    await this.db.runAsync(
      `UPDATE products SET name = ?, description = ?, category = ?, selling_price = ?,
       image_uri = ?, is_active = ?, updated_at = ? WHERE id = ?`,
      merged.name, merged.description, merged.category,
      merged.sellingPrice, merged.imageUri,
      merged.isActive ? 1 : 0, merged.updatedAt, id
    );

    return toDomain(await this.db.getFirstAsync<any>(
      'SELECT * FROM products WHERE id = ?', id
    ));
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM products WHERE id = ?', id);
  }
}
