import pool from '../utils/dbClient';

export const name = '1758300003000_create_shift_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shift (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      serial_number INT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')),
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uq_shift_school_name ON shift(school_id, name);
  `);
};


