export interface Debt {
  id: string;
  customerName: string;
  contactInfo: string | null;
  amount: number;
  paidAmount: number;
  type: 'DEBT' | 'RECEIVABLE';
  status: 'UNPAID' | 'PAID';
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
