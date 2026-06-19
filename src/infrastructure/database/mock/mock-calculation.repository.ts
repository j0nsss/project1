import { Calculation } from '../../../domain/entities/calculation.entity';
import { CalculationRepository } from '../../../domain/repositories/calculation.repository';
import * as uuid from 'react-native-uuid';
import { seedCalculations } from '../seed-data';

export class MockCalculationRepository implements CalculationRepository {
  private items: Calculation[] = [...seedCalculations];

  async findAll(): Promise<Calculation[]> {
    return [...this.items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findByProductId(productId: string): Promise<Calculation[]> {
    return this.items
      .filter((c) => c.productId === productId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async findById(id: string): Promise<Calculation | null> {
    return this.items.find((c) => c.id === id) ?? null;
  }

  async create(
    data: Omit<Calculation, 'id' | 'createdAt'>
  ): Promise<Calculation> {
    const now = new Date().toISOString();
    const item: Calculation = {
      id: uuid.v4() as string,
      ...data,
      createdAt: now,
    };
    this.items.push(item);
    return item;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((c) => c.id === id);
    if (index !== -1) this.items.splice(index, 1);
  }
}
