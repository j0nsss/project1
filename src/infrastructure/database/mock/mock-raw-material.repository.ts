import { RawMaterial } from '../../../domain/entities/raw-material.entity';
import { RawMaterialRepository } from '../../../domain/repositories/raw-material.repository';
import * as uuid from 'react-native-uuid';
import { seedRawMaterials } from '../seed-data';

export class MockRawMaterialRepository implements RawMaterialRepository {
  private items: RawMaterial[] = [...seedRawMaterials];

  async findAll(): Promise<RawMaterial[]> {
    return [...this.items].sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<RawMaterial | null> {
    return this.items.find((i) => i.id === id) ?? null;
  }

  async findByCategory(category: string): Promise<RawMaterial[]> {
    return this.items
      .filter((i) => i.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async create(
    data: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RawMaterial> {
    const now = new Date().toISOString();
    const item: RawMaterial = {
      id: uuid.v4() as string,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<RawMaterial>): Promise<RawMaterial> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('RawMaterial not found');
    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index !== -1) this.items.splice(index, 1);
  }
}
