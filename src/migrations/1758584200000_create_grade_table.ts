import pool from '../utils/dbClient';

export const name = '1758584200000_create_grade_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS grade (
      id SERIAL PRIMARY KEY,
      mark_point_first INTEGER NOT NULL,
      mark_point_second INTEGER NOT NULL,
      grade_point DECIMAL(3,1) NULL,
      letter_grade VARCHAR(10) NULL,
      note TEXT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_grade_school_id ON grade(school_id);
    CREATE INDEX IF NOT EXISTS idx_grade_status ON grade(status);
    CREATE INDEX IF NOT EXISTS idx_grade_mark_points ON grade(mark_point_first, mark_point_second);
  `);
};
