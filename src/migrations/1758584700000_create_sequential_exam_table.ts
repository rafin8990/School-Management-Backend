import pool from '../utils/dbClient';

export const name = '1758584700000_create_sequential_exam_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sequential_exam (
      id SERIAL PRIMARY KEY,
      class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE CASCADE,
      exam_id INTEGER NOT NULL REFERENCES class_exam(id) ON DELETE CASCADE,
      sequence VARCHAR(40) NOT NULL CHECK (sequence IN (
        'Grade_TotalMark_Roll',
        'TotalMark_Grade_Roll',
        'TotalMark_Roll_Grade',
        'Roll_TotalMark_Grade'
      )),
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(class_id, exam_id, school_id)
    );
    CREATE INDEX IF NOT EXISTS idx_sequential_exam_class_id ON sequential_exam(class_id);
    CREATE INDEX IF NOT EXISTS idx_sequential_exam_exam_id ON sequential_exam(exam_id);
    CREATE INDEX IF NOT EXISTS idx_sequential_exam_school_id ON sequential_exam(school_id);
  `);
};


