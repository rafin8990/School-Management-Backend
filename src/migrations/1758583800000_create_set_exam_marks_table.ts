import pool from '../utils/dbClient';

export const name = '1758583800000_create_set_exam_marks_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS set_exam_marks (
      id SERIAL PRIMARY KEY,
      class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE CASCADE,
      class_exam_id INTEGER NOT NULL REFERENCES class_exam(id) ON DELETE CASCADE,
      year_id INTEGER NOT NULL REFERENCES academic_year(id) ON DELETE CASCADE,
      subject_id INTEGER NOT NULL REFERENCES subject(id) ON DELETE CASCADE,
      short_code_id INTEGER NOT NULL REFERENCES short_codes(id) ON DELETE CASCADE,
      total_marks INTEGER NOT NULL,
      countable_marks INTEGER NOT NULL,
      pass_mark INTEGER NOT NULL,
      acceptance NUMERIC(6,3) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER REFERENCES school_user(id),
      updated_by INTEGER REFERENCES school_user(id)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS uq_set_exam_marks ON set_exam_marks (school_id, class_id, class_exam_id, year_id, subject_id, short_code_id);
    CREATE INDEX IF NOT EXISTS idx_set_exam_marks_filters ON set_exam_marks (school_id, class_id, class_exam_id, year_id, subject_id);
  `);
};


