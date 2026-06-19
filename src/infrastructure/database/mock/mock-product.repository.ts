import { Product } from '../../../domain/entities/product.entity';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import * as uuid from 'react-native-uuid';
import { seedProducts } from '../seed-data';

export class MockProductRepository implements ProductRepository {
  private items: Product[] = [...seedProducts];

  async findAll(): Promise<Product[]> {
    return [...this.items].sort((a, b) => a.name.localeCompare(b.name));
  }

  async findActive(): Promise<Product[]> {
    return this.items
      .filter((i) => i.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Product | null> {
    return this.items.find((i) => i.id === id) ?? null;
  }

  async create(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    const now = new Date().toISOString();
    const item: Product = {
      id: uuid.v4() as string,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Product not found');
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
