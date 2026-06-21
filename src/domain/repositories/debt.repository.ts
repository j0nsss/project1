import { Debt } from '../entities/debt.entity';

export interface DebtRepository {
  findAll(): Promise<Debt[]>;
  findById(id: string): Promise<Debt | null>;
  create(
    data: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Debt>;
  update(id: string, data: Partial<Debt>): Promise<Debt>;
  delete(id: string): Promise<void>;
}
