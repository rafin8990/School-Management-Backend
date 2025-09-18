import pool from '../utils/dbClient';

export const name = '1758300005000_create_category_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS category (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')),
      serial_number INT NULL,
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uq_category_school_name ON category(school_id, name);
  `);
};


