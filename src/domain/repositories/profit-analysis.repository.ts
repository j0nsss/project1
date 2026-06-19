import { ProfitAnalysis } from '../entities/profit-analysis.entity';

export interface ProfitAnalysisRepository {
  findAll(): Promise<ProfitAnalysis[]>;
  findByProductId(productId: string): Promise<ProfitAnalysis[]>;
  findById(id: string): Promise<ProfitAnalysis | null>;
  create(
    data: Omit<ProfitAnalysis, 'id' | 'createdAt'>
  ): Promise<ProfitAnalysis>;
  delete(id: string): Promise<void>;
}
