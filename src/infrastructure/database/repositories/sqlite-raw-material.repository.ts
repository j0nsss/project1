import * as SQLite from 'expo-sqlite';
import { RawMaterial } from '../../../domain/entities/raw-material.entity';
import { RawMaterialRepository } from '../../../domain/repositories/raw-material.repository';
import * as uuid from 'react-native-uuid';
import { toDomain, toRow } from '../mappers/raw-material.mapper';

export class SqliteRawMaterialRepository implements RawMaterialRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findAll(): Promise<RawMaterial[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM raw_materials ORDER BY name ASC'
    );
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<RawMaterial | null> {
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM raw_materials WHERE id = ?',
      id
    );
    return row ? toDomain(row) : null;
  }

  async findByCategory(category: string): Promise<RawMaterial[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM raw_materials WHERE category = ? ORDER BY name ASC',
      category
    );
    return rows.map(toDomain);
  }

  async create(
    data: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RawMaterial> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();
    const row = { ...toRow(data), id, created_at: now, updated_at: now };

    await this.db.runAsync(
      `INSERT INTO raw_materials (id, name, unit, price_per_unit, stock_quantity, category, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      row.id,
      row.name,
      row.unit,
      row.price_per_unit,
      row.stock_quantity,
      row.category,
      row.notes,
      row.created_at,
      row.updated_at
    );

    return toDomain(await this.db.getFirstAsync<any>(
      'SELECT * FROM raw_materials WHERE id = ?', id
    ));
  }

  async update(
    id: string,
    data: Partial<RawMaterial>
  ): Promise<RawMaterial> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('RawMaterial not found');

    const merged = { ...existing, ...data, updatedAt: new Date().toISOString() };

    await this.db.runAsync(
      `UPDATE raw_materials SET name = ?, unit = ?, price_per_unit = ?, stock_quantity = ?,
       category = ?, notes = ?, updated_at = ? WHERE id = ?`,
      merged.name,
      merged.unit,
      merged.pricePerUnit,
      merged.stockQuantity,
      merged.category,
      merged.notes,
      merged.updatedAt,
      id
    );

    return toDomain(await this.db.getFirstAsync<any>(
      'SELECT * FROM raw_materials WHERE id = ?', id
    ));
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM raw_materials WHERE id = ?', id);
  }
}
