import { RawMaterial, UnitType } from '../../../domain/entities/raw-material.entity';

interface RawMaterialRow {
  id: string;
  name: string;
  unit: string;
  price_per_unit: number;
  stock_quantity: number;
  category: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function toDomain(row: RawMaterialRow): RawMaterial {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit as UnitType,
    pricePerUnit: row.price_per_unit,
    stockQuantity: row.stock_quantity,
    category: row.category,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toRow(
  entity: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>
): Omit<RawMaterialRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: entity.name,
    unit: entity.unit,
    price_per_unit: entity.pricePerUnit,
    stock_quantity: entity.stockQuantity,
    category: entity.category,
    notes: entity.notes,
  };
}
