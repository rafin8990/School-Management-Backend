import pool from '../utils/dbClient';

export const name = '1758300000000_create_class_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS class (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      serial_number INT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')),
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uq_class_school_name ON class(school_id, name);
  `);
};


