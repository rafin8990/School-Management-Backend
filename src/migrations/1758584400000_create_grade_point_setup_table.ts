import pool from '../utils/dbClient';

export const name = '1758584400000_create_grade_point_setup_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS grade_point_setup (
      id SERIAL PRIMARY KEY,
      grade_setup_id INTEGER NOT NULL REFERENCES grade_setup(id) ON DELETE CASCADE,
      mark_point_first INTEGER NOT NULL,
      mark_point_second INTEGER NOT NULL,
      grade_point DECIMAL(3,1) NULL,
      letter_grade VARCHAR(10) NULL,
      note TEXT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_grade_point_setup_grade_setup_id ON grade_point_setup(grade_setup_id);
    CREATE INDEX IF NOT EXISTS idx_grade_point_setup_status ON grade_point_setup(status);
    CREATE INDEX IF NOT EXISTS idx_grade_point_setup_mark_points ON grade_point_setup(mark_point_first, mark_point_second);
  `);
};
