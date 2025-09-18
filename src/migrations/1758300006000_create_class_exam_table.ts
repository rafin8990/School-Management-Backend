import pool from '../utils/dbClient';

export const name = '1758300006000_create_class_exam_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS class_exam (
      id SERIAL PRIMARY KEY,
      class_exam_name VARCHAR(255) NOT NULL,
      position INT NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')),
      serial_number INT NULL,
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uq_class_exam_school_name ON class_exam(school_id, class_exam_name);
  `);
};


