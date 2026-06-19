import * as SQLite from 'expo-sqlite';
import { MarginSimulation } from '../../../domain/entities/margin-simulation.entity';
import { MarginSimulationRepository } from '../../../domain/repositories/margin-simulation.repository';
import * as uuid from 'react-native-uuid';

export class SqliteMarginSimulationRepository
  implements MarginSimulationRepository
{
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findByProductId(productId: string): Promise<MarginSimulation[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM margin_simulations WHERE product_id = ? ORDER BY created_at DESC',
      productId
    );
    return rows.map(this.toDomain);
  }

  async findByCalculationId(
    calculationId: string
  ): Promise<MarginSimulation[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM margin_simulations WHERE calculation_id = ? ORDER BY created_at DESC',
      calculationId
    );
    return rows.map(this.toDomain);
  }

  async create(
    data: Omit<MarginSimulation, 'id' | 'createdAt'>
  ): Promise<MarginSimulation> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO margin_simulations (id, calculation_id, product_id, desired_margin_percent,
       suggested_price, estimated_profit_per_unit, estimated_total_profit, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, data.calculationId, data.productId, data.desiredMarginPercent,
      data.suggestedPrice, data.estimatedProfitPerUnit, data.estimatedTotalProfit,
      data.isActive ? 1 : 0, now
    );

    return this.toDomain(await this.db.getFirstAsync<any>(
      'SELECT * FROM margin_simulations WHERE id = ?', id
    ));
  }

  async deactivateByProductId(productId: string): Promise<void> {
    await this.db.runAsync(
      'UPDATE margin_simulations SET is_active = 0 WHERE product_id = ?',
      productId
    );
  }

  private toDomain(row: any): MarginSimulation {
    return {
      id: row.id,
      calculationId: row.calculation_id,
      productId: row.product_id,
      desiredMarginPercent: row.desired_margin_percent,
      suggestedPrice: row.suggested_price,
      estimatedProfitPerUnit: row.estimated_profit_per_unit,
      estimatedTotalProfit: row.estimated_total_profit,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
    };
  }
}
