export interface ProfitAnalysis {
  id: string;
  productId: string;
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalHpp: number;
  grossProfit: number;
  operationalCost: number;
  netProfit: number;
  marginPercent: number;
  notes: string | null;
  createdAt: string;
}
