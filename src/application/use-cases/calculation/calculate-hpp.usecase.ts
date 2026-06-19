import { RecipeRepository } from '../../../domain/repositories/recipe.repository';
import { CalculationRepository } from '../../../domain/repositories/calculation.repository';
import {
  CreateCalculationDTO,
  createCalculationSchema,
} from '../../dtos/calculation.dto';
import { AppError } from '../../errors/app-error';
import { ZodError } from 'zod';

export interface CalculateHppInput {
  calculationData: CreateCalculationDTO;
}

export interface CalculateHppResult {
  materialCost: number;
  overheadCost: number;
  laborCost: number;
  otherCost: number;
  totalCost: number;
  quantityProduced: number;
  hppPerUnit: number;
}

export async function calculateHppUseCase(
  recipeRepo: RecipeRepository,
  calculationRepo: CalculationRepository,
  productId: string
): Promise<CalculateHppResult> {
  const recipes = await recipeRepo.findByProductId(productId);

  if (recipes.length === 0) {
    throw new AppError(
      'BUSINESS_RULE_ERROR',
      'Produk belum memiliki resep. Tambahkan bahan baku terlebih dahulu.'
    );
  }

  const materialCost = recipes.reduce((sum, r) => sum + r.subtotal, 0);

  return {
    materialCost,
    overheadCost: 0,
    laborCost: 0,
    otherCost: 0,
    totalCost: materialCost,
    quantityProduced: 1,
    hppPerUnit: materialCost,
  };
}

export async function saveCalculationUseCase(
  calculationRepo: CalculationRepository,
  data: CreateCalculationDTO,
  materialCost: number
) {
  try {
    const validated = createCalculationSchema.parse(data);
    const totalHpp =
      materialCost + validated.overheadCost + validated.laborCost + validated.otherCost;
    const hppPerUnit = totalHpp / validated.quantityProduced;

    return await calculationRepo.create({
      productId: validated.productId,
      totalHpp,
      totalMaterialCost: materialCost,
      overheadCost: validated.overheadCost,
      laborCost: validated.laborCost,
      otherCost: validated.otherCost,
      quantityProduced: validated.quantityProduced,
      hppPerUnit,
      notes: validated.notes ?? null,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      throw new AppError('VALIDATION_ERROR', 'Data perhitungan tidak valid', {
        issues: err.errors,
      });
    }
    if (err instanceof AppError) throw err;
    throw new AppError('UNKNOWN_ERROR', 'Gagal menyimpan perhitungan');
  }
}
