import { Debt } from '../../../domain/entities/debt.entity';

interface DebtRow {
  id: string;
  customer_name: string;
  contact_info: string | null;
  amount: number;
  paid_amount: number;
  type: string;
  status: string;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function toDomain(row: DebtRow): Debt {
  return {
    id: row.id,
    customerName: row.customer_name,
    contactInfo: row.contact_info,
    amount: row.amount,
    paidAmount: row.paid_amount,
    type: row.type as 'DEBT' | 'RECEIVABLE',
    status: row.status as 'UNPAID' | 'PAID',
    dueDate: row.due_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toRow(
  entity: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DebtRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    customer_name: entity.customerName,
    contact_info: entity.contactInfo,
    amount: entity.amount,
    paid_amount: entity.paidAmount,
    type: entity.type,
    status: entity.status,
    due_date: entity.dueDate,
    notes: entity.notes,
  };
}
