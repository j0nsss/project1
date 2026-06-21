import * as SQLite from 'expo-sqlite';
import { SqliteRawMaterialRepository } from './repositories/sqlite-raw-material.repository';
import { SqliteProductRepository } from './repositories/sqlite-product.repository';
import { SqliteRecipeRepository } from './repositories/sqlite-recipe.repository';
import { SqliteCalculationRepository } from './repositories/sqlite-calculation.repository';
import { SqliteMarginSimulationRepository } from './repositories/sqlite-margin-simulation.repository';
import { SqliteProfitAnalysisRepository } from './repositories/sqlite-profit-analysis.repository';
import { SqliteCashEntryRepository } from './repositories/sqlite-cash-entry.repository';
import { SqliteDebtRepository } from './repositories/sqlite-debt.repository';
import { MockRawMaterialRepository } from './mock/mock-raw-material.repository';
import { MockProductRepository } from './mock/mock-product.repository';
import { MockRecipeRepository } from './mock/mock-recipe.repository';
import { MockCalculationRepository } from './mock/mock-calculation.repository';
import { MockMarginSimulationRepository } from './mock/mock-margin-simulation.repository';
import { MockProfitAnalysisRepository } from './mock/mock-profit-analysis.repository';

export interface RepositoryCollection {
  rawMaterialRepository:
    | SqliteRawMaterialRepository
    | MockRawMaterialRepository;
  productRepository: SqliteProductRepository | MockProductRepository;
  recipeRepository: SqliteRecipeRepository | MockRecipeRepository;
  calculationRepository:
    | SqliteCalculationRepository
    | MockCalculationRepository;
  marginSimulationRepository:
    | SqliteMarginSimulationRepository
    | MockMarginSimulationRepository;
  profitAnalysisRepository:
    | SqliteProfitAnalysisRepository
    | MockProfitAnalysisRepository;
  cashEntryRepository: SqliteCashEntryRepository;
  debtRepository: SqliteDebtRepository;
}

export function initializeRepositories(
  db: SQLite.SQLiteDatabase
): RepositoryCollection {
  return {
    rawMaterialRepository: new SqliteRawMaterialRepository(db),
    productRepository: new SqliteProductRepository(db),
    recipeRepository: new SqliteRecipeRepository(db),
    calculationRepository: new SqliteCalculationRepository(db),
    marginSimulationRepository: new SqliteMarginSimulationRepository(db),
    profitAnalysisRepository: new SqliteProfitAnalysisRepository(db),
    cashEntryRepository: new SqliteCashEntryRepository(db),
    debtRepository: new SqliteDebtRepository(db),
  };
}

export function initializeMockRepositories(): RepositoryCollection {
  throw new Error('Mocks not supported for new repositories yet');
}
