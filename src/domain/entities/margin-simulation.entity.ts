export interface MarginSimulation {
  id: string;
  calculationId: string;
  productId: string;
  desiredMarginPercent: number;
  suggestedPrice: number;
  estimatedProfitPerUnit: number;
  estimatedTotalProfit: number;
  isActive: boolean;
  createdAt: string;
}
