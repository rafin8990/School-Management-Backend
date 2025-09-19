import pool from '../utils/dbClient';

export const name = '1758310003000_create_academic_year_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS academic_year (
      id SERIAL PRIMARY KEY,
      name INTEGER NOT NULL,
      serial_number INTEGER NULL,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
