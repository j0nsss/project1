import * as SQLite from 'expo-sqlite';
import { ProfitAnalysis } from '../../../domain/entities/profit-analysis.entity';
import { ProfitAnalysisRepository } from '../../../domain/repositories/profit-analysis.repository';
import * as uuid from 'react-native-uuid';

export class SqliteProfitAnalysisRepository
  implements ProfitAnalysisRepository
{
  constructor(private db: SQLite.SQLiteDatabase) {}

  async findAll(): Promise<ProfitAnalysis[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM profit_analyses ORDER BY created_at DESC'
    );
    return rows.map(this.toDomain);
  }

  async findByProductId(productId: string): Promise<ProfitAnalysis[]> {
    const rows = await this.db.getAllAsync<any[]>(
      'SELECT * FROM profit_analyses WHERE product_id = ? ORDER BY created_at DESC',
      productId
    );
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<ProfitAnalysis | null> {
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM profit_analyses WHERE id = ?', id
    );
    return row ? this.toDomain(row) : null;
  }

  async create(
    data: Omit<ProfitAnalysis, 'id' | 'createdAt'>
  ): Promise<ProfitAnalysis> {
    const id = uuid.v4() as string;
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO profit_analyses (id, product_id, period_start, period_end,
       total_revenue, total_hpp, gross_profit, operational_cost, net_profit,
       margin_percent, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, data.productId, data.periodStart, data.periodEnd,
      data.totalRevenue, data.totalHpp, data.grossProfit,
      data.operationalCost, data.netProfit, data.marginPercent,
      data.notes, now
    );

    return this.toDomain(await this.db.getFirstAsync<any>(
      'SELECT * FROM profit_analyses WHERE id = ?', id
    ));
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM profit_analyses WHERE id = ?', id);
  }

  private toDomain(row: any): ProfitAnalysis {
    return {
      id: row.id,
      productId: row.product_id,
      periodStart: row.period_start,
      periodEnd: row.period_end,
      totalRevenue: row.total_revenue,
      totalHpp: row.total_hpp,
      grossProfit: row.gross_profit,
      operationalCost: row.operational_cost,
      netProfit: row.net_profit,
      marginPercent: row.margin_percent,
      notes: row.notes,
      createdAt: row.created_at,
    };
  }
}
