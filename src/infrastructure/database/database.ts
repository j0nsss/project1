import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

let databaseInstance: SQLite.SQLiteDatabase | null = null;

export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (databaseInstance) return databaseInstance;

  const db = await SQLite.openDatabaseAsync('umkm_profit_calculator.db');

  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await runMigrations(db);

  databaseInstance = db;
  return db;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!databaseInstance) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.'
    );
  }
  return databaseInstance;
}
