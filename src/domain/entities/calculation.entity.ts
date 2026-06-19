export interface Calculation {
  id: string;
  productId: string;
  totalHpp: number;
  totalMaterialCost: number;
  overheadCost: number;
  laborCost: number;
  otherCost: number;
  quantityProduced: number;
  hppPerUnit: number;
  notes: string | null;
  createdAt: string;
}
