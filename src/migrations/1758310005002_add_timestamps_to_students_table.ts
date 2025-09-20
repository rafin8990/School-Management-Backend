import pool from '../utils/dbClient';

export const name = '1758310005002_add_timestamps_to_students_table';

export const run = async () => {
  // Add created_at and updated_at columns to students table
  await pool.query(`
    ALTER TABLE students 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `);
};
