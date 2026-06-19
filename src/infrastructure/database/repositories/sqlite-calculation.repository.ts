import * as SQLite from 'expo-sqlite';
import { Calculation } from '../../../domain/entities/calculation.entity';
import { CalculationRepository } from '../../../domain/repositories/calculation.repository';
import * as uuid from 'react-native-uuid';
import { toDomain } from '../mappers/calculation.mapper';

export class SqliteCalculationRepository implements CalculationRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findAll(): Promise<Calculation[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM calculations ORDER BY created_at DESC'
    );
    return rows.map(toDomain);
  }

  async findByProductId(productId: string): Promise<Calculation[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM calculations WHERE product_id = ? ORDER BY created_at DESC',
      productId
    );
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Calculation | null> {
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM calculations WHERE id = ?', id
    );
    return row ? toDomain(row) : null;
  }

  async create(
    data: Omit<Calculation, 'id' | 'createdAt'>
  ): Promise<Calculation> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO calculations (id, product_id, total_hpp, total_material_cost,
       overhead_cost, labor_cost, other_cost, quantity_produced, hpp_per_unit, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, data.productId, data.totalHpp, data.totalMaterialCost,
      data.overheadCost, data.laborCost, data.otherCost,
      data.quantityProduced, data.hppPerUnit, data.notes, now
    );

    return toDomain(await this.db.getFirstAsync<any>(
      'SELECT * FROM calculations WHERE id = ?', id
    ));
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM calculations WHERE id = ?', id);
  }
}
