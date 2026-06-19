import { ProfitAnalysis } from '../../../domain/entities/profit-analysis.entity';
import { ProfitAnalysisRepository } from '../../../domain/repositories/profit-analysis.repository';
import * as uuid from 'react-native-uuid';
import { seedProfitAnalyses } from '../seed-data';

export class MockProfitAnalysisRepository
  implements ProfitAnalysisRepository
{
  private items: ProfitAnalysis[] = [...seedProfitAnalyses];

  async findAll(): Promise<ProfitAnalysis[]> {
    return [...this.items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findByProductId(productId: string): Promise<ProfitAnalysis[]> {
    return this.items
      .filter((p) => p.productId === productId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async findById(id: string): Promise<ProfitAnalysis | null> {
    return this.items.find((p) => p.id === id) ?? null;
  }

  async create(
    data: Omit<ProfitAnalysis, 'id' | 'createdAt'>
  ): Promise<ProfitAnalysis> {
    const now = new Date().toISOString();
    const item: ProfitAnalysis = {
      id: uuid.v4() as string,
      ...data,
      createdAt: now,
    };
    this.items.push(item);
    return item;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((p) => p.id === id);
    if (index !== -1) this.items.splice(index, 1);
  }
}
