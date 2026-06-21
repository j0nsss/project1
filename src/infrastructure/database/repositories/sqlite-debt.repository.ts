import * as SQLite from 'expo-sqlite';
import { Debt } from '../../../domain/entities/debt.entity';
import { DebtRepository } from '../../../domain/repositories/debt.repository';
import * as uuid from 'react-native-uuid';
import { toDomain, toRow } from '../mappers/debt.mapper';

export class SqliteDebtRepository implements DebtRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findAll(): Promise<Debt[]> {
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM debts ORDER BY created_at DESC'
    );
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Debt | null> {
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM debts WHERE id = ?',
      id
    );
    return row ? toDomain(row) : null;
  }

  async create(data: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Debt> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();
    const row = { ...toRow(data), id, created_at: now, updated_at: now };

    await this.db.runAsync(
      `INSERT INTO debts (id, customer_name, contact_info, amount, paid_amount, type, status, due_date, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      row.id,
      row.customer_name,
      row.contact_info,
      row.amount,
      row.paid_amount,
      row.type,
      row.status,
      row.due_date,
      row.notes,
      row.created_at,
      row.updated_at
    );

    const inserted = await this.findById(id);
    if (!inserted) throw new Error('Failed to retrieve inserted debt');
    return inserted;
  }

  async update(id: string, data: Partial<Debt>): Promise<Debt> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Debt not found');

    const merged = { ...existing, ...data, updatedAt: new Date().toISOString() };

    await this.db.runAsync(
      `UPDATE debts SET customer_name = ?, contact_info = ?, amount = ?, paid_amount = ?,
       type = ?, status = ?, due_date = ?, notes = ?, updated_at = ? WHERE id = ?`,
      merged.customerName,
      merged.contactInfo,
      merged.amount,
      merged.paidAmount,
      merged.type,
      merged.status,
      merged.dueDate,
      merged.notes,
      merged.updatedAt,
      id
    );

    const updated = await this.findById(id);
    if (!updated) throw new Error('Failed to retrieve updated debt');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM debts WHERE id = ?', id);
  }
}
