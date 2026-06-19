import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama produk wajib diisi')
    .max(200, 'Nama maksimal 200 karakter'),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  sellingPrice: z.number().positive('Harga jual harus lebih dari 0').nullable().optional(),
  imageUri: z.string().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
