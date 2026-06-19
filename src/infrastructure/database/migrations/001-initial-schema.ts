import * as SQLite from 'expo-sqlite';

export async function migration001(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS raw_materials (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      price_per_unit REAL NOT NULL,
      stock_quantity REAL NOT NULL DEFAULT 0,
      category TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      selling_price REAL,
      image_uri TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL,
      raw_material_id TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS calculations (
      id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL,
      total_hpp REAL NOT NULL,
      total_material_cost REAL NOT NULL,
      overhead_cost REAL DEFAULT 0,
      labor_cost REAL DEFAULT 0,
      other_cost REAL DEFAULT 0,
      quantity_produced REAL NOT NULL DEFAULT 1,
      hpp_per_unit REAL NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS margin_simulations (
      id TEXT PRIMARY KEY NOT NULL,
      calculation_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      desired_margin_percent REAL NOT NULL,
      suggested_price REAL NOT NULL,
      estimated_profit_per_unit REAL NOT NULL,
      estimated_total_profit REAL NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (calculation_id) REFERENCES calculations(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS profit_analyses (
      id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL,
      period_start TEXT NOT NULL,
      period_end TEXT NOT NULL,
      total_revenue REAL NOT NULL,
      total_hpp REAL NOT NULL,
      gross_profit REAL NOT NULL,
      operational_cost REAL DEFAULT 0,
      net_profit REAL DEFAULT 0,
      margin_percent REAL NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_recipes_product_id ON recipes(product_id);
    CREATE INDEX IF NOT EXISTS idx_recipes_raw_material_id ON recipes(raw_material_id);
    CREATE INDEX IF NOT EXISTS idx_calculations_product_id ON calculations(product_id);
    CREATE INDEX IF NOT EXISTS idx_margin_simulations_product_id ON margin_simulations(product_id);
    CREATE INDEX IF NOT EXISTS idx_margin_simulations_calculation_id ON margin_simulations(calculation_id);
    CREATE INDEX IF NOT EXISTS idx_profit_analyses_product_id ON profit_analyses(product_id);
  `);
}
