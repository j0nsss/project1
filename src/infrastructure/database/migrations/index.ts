import * as SQLite from 'expo-sqlite';
import { migration001 } from './001-initial-schema';

interface Migration {
  version: number;
  name: string;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
}

const migrations: Migration[] = [
  { version: 1, name: 'initial-schema', up: migration001 },
];

export async function runMigrations(
  db: SQLite.SQLiteDatabase
): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  for (const migration of migrations) {
    const row = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM _migrations WHERE version = ?',
      migration.version
    );

    if (!row) {
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO _migrations (version, name) VALUES (?, ?)',
        migration.version,
        migration.name
      );
    }
  }
}
