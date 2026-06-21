import * as SQLite from 'expo-sqlite';

export async function migration002(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cash_entries (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL, -- 'INCOME' or 'EXPENSE'
      amount REAL NOT NULL,
      source TEXT NOT NULL, -- 'MANUAL', 'CALCULATION', 'DEBT_PAYMENT'
      reference_id TEXT,
      notes TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS debts (
      id TEXT PRIMARY KEY NOT NULL,
      customer_name TEXT NOT NULL,
      contact_info TEXT,
      amount REAL NOT NULL,
      paid_amount REAL NOT NULL DEFAULT 0,
      type TEXT NOT NULL, -- 'DEBT' (we owe) or 'RECEIVABLE' (they owe)
      status TEXT NOT NULL, -- 'UNPAID', 'PAID'
      due_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
