import { UnitType } from './raw-material.entity';

export interface Recipe {
  id: string;
  productId: string;
  rawMaterialId: string;
  quantity: number;
  unit: UnitType;
  createdAt: string;
}

export interface RecipeWithMaterial extends Recipe {
  materialName: string;
  materialUnit: string;
  materialPricePerUnit: number;
  subtotal: number;
}
