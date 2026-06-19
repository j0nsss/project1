import { ProfitAnalysisRepository } from '../../../domain/repositories/profit-analysis.repository';
import {
  ProfitAnalysisDTO,
  profitAnalysisSchema,
} from '../../dtos/calculation.dto';
import { AppError } from '../../errors/app-error';
import { ZodError } from 'zod';

export interface ProfitAnalysisResult {
  totalRevenue: number;
  totalHpp: number;
  grossProfit: number;
  operationalCost: number;
  netProfit: number;
  marginPercent: number;
}

export function calculateProfitAnalysisUseCase(
  data: ProfitAnalysisDTO
): ProfitAnalysisResult {
  try {
    const validated = profitAnalysisSchema.parse(data);
    const grossProfit = validated.totalRevenue - validated.totalHpp;
    const netProfit = grossProfit - validated.operationalCost;
    const marginPercent =
      validated.totalRevenue > 0
        ? (grossProfit / validated.totalRevenue) * 100
        : 0;

    return {
      totalRevenue: validated.totalRevenue,
      totalHpp: validated.totalHpp,
      grossProfit,
      operationalCost: validated.operationalCost,
      netProfit,
      marginPercent,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      throw new AppError('VALIDATION_ERROR', 'Data analisis tidak valid', {
        issues: err.errors,
      });
    }
    throw err;
  }
}

export async function saveProfitAnalysisUseCase(
  repo: ProfitAnalysisRepository,
  data: ProfitAnalysisDTO
) {
  const result = calculateProfitAnalysisUseCase(data);

  return await repo.create({
    productId: data.productId,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    totalRevenue: result.totalRevenue,
    totalHpp: result.totalHpp,
    grossProfit: result.grossProfit,
    operationalCost: result.operationalCost,
    netProfit: result.netProfit,
    marginPercent: result.marginPercent,
    notes: data.notes ?? null,
  });
}
