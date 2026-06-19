import { MarginSimulationRepository } from '../../../domain/repositories/margin-simulation.repository';
import {
  MarginSimulationDTO,
  marginSimulationSchema,
} from '../../dtos/calculation.dto';
import { AppError } from '../../errors/app-error';
import { ZodError } from 'zod';

export interface MarginSimulationResult {
  hppPerUnit: number;
  desiredMarginPercent: number;
  markupFactor: number;
  suggestedPrice: number;
  profitPerUnit: number;
  quantitySold: number;
  totalProfit: number;
}

export function simulateMarginUseCase(
  hppPerUnit: number,
  data: MarginSimulationDTO
): MarginSimulationResult {
  try {
    const validated = marginSimulationSchema.parse(data);
    const decimalMargin = validated.desiredMarginPercent / 100;
    const markupFactor = 1 / (1 - decimalMargin);
    const suggestedPrice = hppPerUnit * markupFactor;
    const profitPerUnit = suggestedPrice - hppPerUnit;
    const totalProfit = profitPerUnit * validated.quantitySold;

    return {
      hppPerUnit,
      desiredMarginPercent: validated.desiredMarginPercent,
      markupFactor,
      suggestedPrice,
      profitPerUnit,
      quantitySold: validated.quantitySold,
      totalProfit,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      throw new AppError('VALIDATION_ERROR', 'Data simulasi margin tidak valid', {
        issues: err.errors,
      });
    }
    throw err;
  }
}

export async function saveMarginSimulationUseCase(
  repo: MarginSimulationRepository,
  data: MarginSimulationDTO,
  hppPerUnit: number
) {
  const result = simulateMarginUseCase(hppPerUnit, data);

  await repo.deactivateByProductId(data.productId);

  return await repo.create({
    calculationId: data.calculationId,
    productId: data.productId,
    desiredMarginPercent: data.desiredMarginPercent,
    suggestedPrice: result.suggestedPrice,
    estimatedProfitPerUnit: result.profitPerUnit,
    estimatedTotalProfit: result.totalProfit,
    isActive: true,
  });
}
