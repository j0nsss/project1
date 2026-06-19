import { Calculation } from '../../../domain/entities/calculation.entity';

interface CalculationRow {
  id: string;
  product_id: string;
  total_hpp: number;
  total_material_cost: number;
  overhead_cost: number;
  labor_cost: number;
  other_cost: number;
  quantity_produced: number;
  hpp_per_unit: number;
  notes: string | null;
  created_at: string;
}

export function toDomain(row: CalculationRow): Calculation {
  return {
    id: row.id,
    productId: row.product_id,
    totalHpp: row.total_hpp,
    totalMaterialCost: row.total_material_cost,
    overheadCost: row.overhead_cost,
    laborCost: row.labor_cost,
    otherCost: row.other_cost,
    quantityProduced: row.quantity_produced,
    hppPerUnit: row.hpp_per_unit,
    notes: row.notes,
    createdAt: row.created_at,
  };
}
