import { Calculation } from '../entities/calculation.entity';

export interface CalculationRepository {
  findAll(): Promise<Calculation[]>;
  findByProductId(productId: string): Promise<Calculation[]>;
  findById(id: string): Promise<Calculation | null>;
  create(
    data: Omit<Calculation, 'id' | 'createdAt'>
  ): Promise<Calculation>;
  delete(id: string): Promise<void>;
}
