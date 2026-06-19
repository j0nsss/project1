import { z } from 'zod';
import { UnitType } from '../../domain/entities/raw-material.entity';

const unitTypes = [
  'kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'box', 'sack', 'unit',
] as const;

export const createRawMaterialSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama bahan baku wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  unit: z.enum(unitTypes, { message: 'Satuan tidak valid' }),
  pricePerUnit: z
    .number({ required_error: 'Harga wajib diisi' })
    .positive('Harga harus lebih dari 0'),
  stockQuantity: z
    .number()
    .min(0, 'Stok tidak boleh negatif')
    .default(0),
  category: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const updateRawMaterialSchema = createRawMaterialSchema.partial();

export type CreateRawMaterialDTO = z.infer<typeof createRawMaterialSchema>;
export type UpdateRawMaterialDTO = z.infer<typeof updateRawMaterialSchema>;
