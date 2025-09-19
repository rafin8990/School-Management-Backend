import pool from '../utils/dbClient';

export const name = '1758310000000_create_board_exam_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS board_exam (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      serial_number INTEGER NULL,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
