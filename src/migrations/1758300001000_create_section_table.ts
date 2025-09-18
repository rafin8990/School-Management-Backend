import pool from '../utils/dbClient';

export const name = '1758300001000_create_section_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS section (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      serial_number INT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')),
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uq_section_school_name ON section(school_id, name);
  `);
};


