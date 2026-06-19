export type UnitType =
  | 'kg'
  | 'gram'
  | 'liter'
  | 'ml'
  | 'pcs'
  | 'pack'
  | 'box'
  | 'sack'
  | 'unit';

export interface RawMaterial {
  id: string;
  name: string;
  unit: UnitType;
  pricePerUnit: number;
  stockQuantity: number;
  category: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
