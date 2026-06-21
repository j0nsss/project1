import { CashEntry } from '../../../domain/entities/cash-entry.entity';

interface CashEntryRow {
  id: string;
  type: string;
  amount: number;
  source: string;
  reference_id: string | null;
  notes: string | null;
  date: string;
  created_at: string;
}

export function toDomain(row: CashEntryRow): CashEntry {
  return {
    id: row.id,
    type: row.type as 'INCOME' | 'EXPENSE',
    amount: row.amount,
    source: row.source as 'MANUAL' | 'CALCULATION' | 'DEBT_PAYMENT',
    referenceId: row.reference_id,
    notes: row.notes,
    date: row.date,
    createdAt: row.created_at,
  };
}

export function toRow(
  entity: Omit<CashEntry, 'id' | 'createdAt'>
): Omit<CashEntryRow, 'id' | 'created_at'> {
  return {
    type: entity.type,
    amount: entity.amount,
    source: entity.source,
    reference_id: entity.referenceId,
    notes: entity.notes,
    date: entity.date,
  };
}
