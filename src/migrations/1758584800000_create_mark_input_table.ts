import pool from '../utils/dbClient';

export const name = '1758584800000_create_mark_input_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mark_input (
      id BIGSERIAL PRIMARY KEY,
      
      -- Foreign Keys
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES student_group(id) ON DELETE SET NULL,
      section_id INTEGER REFERENCES section(id) ON DELETE SET NULL,
      shift_id INTEGER REFERENCES shift(id) ON DELETE SET NULL,
      subject_id INTEGER NOT NULL REFERENCES subject(id) ON DELETE CASCADE,
      exam_id INTEGER NOT NULL REFERENCES class_exam(id) ON DELETE CASCADE,
      year_id INTEGER NOT NULL REFERENCES academic_year(id) ON DELETE CASCADE,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      
      -- Mark Details
      full_mark NUMERIC(5,2) NULL,
      total_mark NUMERIC(5,2) NULL,
      grade VARCHAR(10) NULL,
      gpa NUMERIC(3,2) NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('absent', 'present')),
      short_code_marks JSONB NOT NULL,
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      -- Constraints
      CONSTRAINT uq_mark_input_student_exam_subject UNIQUE (student_id, exam_id, subject_id, school_id)
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_mark_input_student_id ON mark_input(student_id);
    CREATE INDEX IF NOT EXISTS idx_mark_input_class_id ON mark_input(class_id);
    CREATE INDEX IF NOT EXISTS idx_mark_input_exam_id ON mark_input(exam_id);
    CREATE INDEX IF NOT EXISTS idx_mark_input_subject_id ON mark_input(subject_id);
    CREATE INDEX IF NOT EXISTS idx_mark_input_year_id ON mark_input(year_id);
    CREATE INDEX IF NOT EXISTS idx_mark_input_school_id ON mark_input(school_id);
    CREATE INDEX IF NOT EXISTS idx_mark_input_class_exam_subject ON mark_input(class_id, exam_id, subject_id);
  `);
};
