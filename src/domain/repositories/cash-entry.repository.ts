import { CashEntry } from '../entities/cash-entry.entity';

export interface CashEntryRepository {
  findAll(): Promise<CashEntry[]>;
  findById(id: string): Promise<CashEntry | null>;
  create(
    data: Omit<CashEntry, 'id' | 'createdAt'>
  ): Promise<CashEntry>;
  delete(id: string): Promise<void>;
  clearAll(): Promise<void>;
}
