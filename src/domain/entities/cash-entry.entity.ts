export interface CashEntry {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  source: 'MANUAL' | 'CALCULATION' | 'DEBT_PAYMENT';
  referenceId: string | null;
  notes: string | null;
  date: string;
  createdAt: string;
}
