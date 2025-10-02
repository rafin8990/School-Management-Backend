import pool from '../utils/dbClient';

export const name = '1758584300000_create_grade_setup_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS grade_setup (
      id SERIAL PRIMARY KEY,
      exam_id INTEGER NOT NULL REFERENCES class_exam(id) ON DELETE CASCADE,
      year_id INTEGER NULL REFERENCES academic_year(id) ON DELETE SET NULL,
      class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE CASCADE,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(exam_id, year_id, class_id, school_id)
    );

    CREATE INDEX IF NOT EXISTS idx_grade_setup_exam_id ON grade_setup(exam_id);
    CREATE INDEX IF NOT EXISTS idx_grade_setup_year_id ON grade_setup(year_id);
    CREATE INDEX IF NOT EXISTS idx_grade_setup_class_id ON grade_setup(class_id);
    CREATE INDEX IF NOT EXISTS idx_grade_setup_school_id ON grade_setup(school_id);
  `);
};
