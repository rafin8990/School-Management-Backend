import pool from '../utils/dbClient';

export const name = '1758584000000_create_report_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS report (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      position INTEGER NULL,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_report_school_id ON report(school_id);
    CREATE INDEX IF NOT EXISTS idx_report_status ON report(status);
  `);
};
