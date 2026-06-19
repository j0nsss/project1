import { z } from 'zod';

export const createCalculationSchema = z.object({
  productId: z.string().min(1, 'Produk harus dipilih'),
  overheadCost: z.number().min(0, 'Biaya overhead tidak boleh negatif').default(0),
  laborCost: z.number().min(0, 'Biaya tenaga kerja tidak boleh negatif').default(0),
  otherCost: z.number().min(0, 'Biaya lain tidak boleh negatif').default(0),
  quantityProduced: z
    .number()
    .positive('Jumlah produksi harus lebih dari 0')
    .default(1),
  notes: z.string().nullable().optional(),
});

export const marginSimulationSchema = z.object({
  calculationId: z.string().min(1),
  productId: z.string().min(1),
  desiredMarginPercent: z
    .number()
    .min(0, 'Margin minimal 0%')
    .max(1000, 'Margin maksimal 1000%'),
  quantitySold: z.number().positive('Jumlah terjual harus lebih dari 0').default(1),
});

export const profitAnalysisSchema = z.object({
  productId: z.string().min(1, 'Produk harus dipilih'),
  periodStart: z.string().min(1, 'Periode awal wajib diisi'),
  periodEnd: z.string().min(1, 'Periode akhir wajib diisi'),
  totalRevenue: z.number().min(0, 'Revenue tidak boleh negatif'),
  totalHpp: z.number().min(0, 'Total HPP tidak boleh negatif'),
  operationalCost: z.number().min(0, 'Biaya operasional tidak boleh negatif').default(0),
  notes: z.string().nullable().optional(),
});

export type CreateCalculationDTO = z.infer<typeof createCalculationSchema>;
export type MarginSimulationDTO = z.infer<typeof marginSimulationSchema>;
export type ProfitAnalysisDTO = z.infer<typeof profitAnalysisSchema>;
