import { MarginSimulation } from '../entities/margin-simulation.entity';

export interface MarginSimulationRepository {
  findByProductId(productId: string): Promise<MarginSimulation[]>;
  findByCalculationId(calculationId: string): Promise<MarginSimulation[]>;
  create(
    data: Omit<MarginSimulation, 'id' | 'createdAt'>
  ): Promise<MarginSimulation>;
  deactivateByProductId(productId: string): Promise<void>;
}
