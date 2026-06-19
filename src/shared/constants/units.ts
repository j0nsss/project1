import { UnitType } from '../../domain/entities/raw-material.entity';

export const UNIT_LABELS: Record<UnitType, string> = {
  kg: 'Kilogram',
  gram: 'Gram',
  liter: 'Liter',
  ml: 'Mililiter',
  pcs: 'Pieces',
  pack: 'Pack',
  box: 'Box',
  sack: 'Karung',
  unit: 'Unit',
};

export const UNIT_OPTIONS = Object.entries(UNIT_LABELS).map(([value, label]) => ({
  value: value as UnitType,
  label,
}));

export const PRODUCT_CATEGORIES = [
  'Makanan',
  'Minuman',
  'Kue',
  'Kerajinan',
  'Fashion',
  'Lainnya',
] as const;

export const RAW_MATERIAL_CATEGORIES = [
  'Bahan Pokok',
  'Bumbu',
  'Kemasan',
  'Bahan Tambahan',
  'Lainnya',
] as const;
