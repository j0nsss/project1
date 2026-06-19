import { Product } from '../../../domain/entities/product.entity';

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  selling_price: number | null;
  image_uri: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export function toDomain(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    sellingPrice: row.selling_price,
    imageUri: row.image_uri,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toRow(
  entity: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Omit<ProductRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: entity.name,
    description: entity.description,
    category: entity.category,
    selling_price: entity.sellingPrice ?? null,
    image_uri: entity.imageUri ?? null,
    is_active: entity.isActive ? 1 : 0,
  };
}
