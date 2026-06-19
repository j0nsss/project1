import { RawMaterial } from '../entities/raw-material.entity';

export interface RawMaterialRepository {
  findAll(): Promise<RawMaterial[]>;
  findById(id: string): Promise<RawMaterial | null>;
  findByCategory(category: string): Promise<RawMaterial[]>;
  create(
    data: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RawMaterial>;
  update(id: string, data: Partial<RawMaterial>): Promise<RawMaterial>;
  delete(id: string): Promise<void>;
}
