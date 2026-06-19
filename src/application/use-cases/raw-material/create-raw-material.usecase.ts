import { RawMaterialRepository } from '../../../domain/repositories/raw-material.repository';
import {
  CreateRawMaterialDTO,
  createRawMaterialSchema,
} from '../../dtos/raw-material.dto';
import { AppError } from '../../errors/app-error';
import { ZodError } from 'zod';

export async function createRawMaterialUseCase(
  repo: RawMaterialRepository,
  data: CreateRawMaterialDTO
) {
  try {
    const validated = createRawMaterialSchema.parse(data);
    return await repo.create({
      name: validated.name,
      unit: validated.unit,
      pricePerUnit: validated.pricePerUnit,
      stockQuantity: validated.stockQuantity ?? 0,
      category: validated.category ?? null,
      notes: validated.notes ?? null,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Data bahan baku tidak valid',
        { issues: err.errors }
      );
    }
    throw err;
  }
}
