import pool from '../utils/dbClient';

export const name = '1758584600000_create_exam_publish_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS exam_publish (
      id SERIAL PRIMARY KEY,
      exam_id INTEGER NOT NULL REFERENCES class_exam(id) ON DELETE CASCADE,
      year_id INTEGER NOT NULL REFERENCES academic_year(id) ON DELETE CASCADE,
      publish_status VARCHAR(20) NOT NULL DEFAULT 'editable' CHECK (publish_status IN ('publish','editable')),
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(exam_id, year_id, school_id)
    );
    CREATE INDEX IF NOT EXISTS idx_exam_publish_exam_id ON exam_publish(exam_id);
    CREATE INDEX IF NOT EXISTS idx_exam_publish_year_id ON exam_publish(year_id);
    CREATE INDEX IF NOT EXISTS idx_exam_publish_school_id ON exam_publish(school_id);
  `);
};


