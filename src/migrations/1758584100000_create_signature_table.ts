import pool from '../utils/dbClient';

export const name = '1758584100000_create_signature_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS signature (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image TEXT NULL,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_signature_school_id ON signature(school_id);
    CREATE INDEX IF NOT EXISTS idx_signature_status ON signature(status);
  `);
};
