import { MarginSimulation } from '../../../domain/entities/margin-simulation.entity';
import { MarginSimulationRepository } from '../../../domain/repositories/margin-simulation.repository';
import * as uuid from 'react-native-uuid';
import { seedMarginSimulations } from '../seed-data';

export class MockMarginSimulationRepository
  implements MarginSimulationRepository
{
  private items: MarginSimulation[] = [...seedMarginSimulations];

  async findByProductId(productId: string): Promise<MarginSimulation[]> {
    return this.items
      .filter((m) => m.productId === productId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async findByCalculationId(
    calculationId: string
  ): Promise<MarginSimulation[]> {
    return this.items
      .filter((m) => m.calculationId === calculationId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async create(
    data: Omit<MarginSimulation, 'id' | 'createdAt'>
  ): Promise<MarginSimulation> {
    const now = new Date().toISOString();
    const item: MarginSimulation = {
      id: uuid.v4() as string,
      ...data,
      createdAt: now,
    };
    this.items.push(item);
    return item;
  }

  async deactivateByProductId(productId: string): Promise<void> {
    this.items.forEach((m) => {
      if (m.productId === productId) m.isActive = false;
    });
  }
}
