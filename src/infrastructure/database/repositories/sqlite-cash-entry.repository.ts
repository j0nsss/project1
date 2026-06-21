import * as SQLite from 'expo-sqlite';
import { CashEntry } from '../../../domain/entities/cash-entry.entity';
import { CashEntryRepository } from '../../../domain/repositories/cash-entry.repository';
import * as uuid from 'react-native-uuid';
import { toDomain, toRow } from '../mappers/cash-entry.mapper';

export class SqliteCashEntryRepository implements CashEntryRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findAll(): Promise<CashEntry[]> {
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM cash_entries ORDER BY date DESC, created_at DESC'
    );
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<CashEntry | null> {
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM cash_entries WHERE id = ?',
      id
    );
    return row ? toDomain(row) : null;
  }

  async create(data: Omit<CashEntry, 'id' | 'createdAt'>): Promise<CashEntry> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();
    const row = { ...toRow(data), id, created_at: now };

    await this.db.runAsync(
      `INSERT INTO cash_entries (id, type, amount, source, reference_id, notes, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      row.id,
      row.type,
      row.amount,
      row.source,
      row.reference_id,
      row.notes,
      row.date,
      row.created_at
    );

    const inserted = await this.findById(id);
    if (!inserted) throw new Error('Failed to retrieve inserted cash entry');
    return inserted;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM cash_entries WHERE id = ?', id);
  }

  async clearAll(): Promise<void> {
    await this.db.runAsync('DELETE FROM cash_entries');
  }
}
