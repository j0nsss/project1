import { z } from 'zod';

export const recipeItemSchema = z.object({
  rawMaterialId: z.string().min(1, 'Bahan baku harus dipilih'),
  quantity: z.number().positive('Jumlah harus lebih dari 0'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
});

export const createRecipeSchema = z.object({
  productId: z.string().min(1, 'Produk harus dipilih'),
  items: z.array(recipeItemSchema).min(1, 'Minimal 1 bahan baku'),
});

export type RecipeItemDTO = z.infer<typeof recipeItemSchema>;
export type CreateRecipeDTO = z.infer<typeof createRecipeSchema>;
