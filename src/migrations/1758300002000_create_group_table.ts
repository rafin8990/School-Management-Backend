import pool from '../utils/dbClient';

export const name = '1758300002000_create_group_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_group (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      serial_number INT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')),
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uq_group_school_name ON student_group(school_id, name);
  `);
};


