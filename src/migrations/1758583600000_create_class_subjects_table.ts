import pool from '../utils/dbClient';

export const name = '1758583600000_create_class_subjects_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS class_subjects (
      id SERIAL PRIMARY KEY,
      class_wise_subject_id INTEGER NOT NULL REFERENCES class_wise_subject(id) ON DELETE CASCADE,
      subject_id INTEGER NOT NULL REFERENCES subject(id) ON DELETE CASCADE,
      serial_no INTEGER NOT NULL,
      type VARCHAR(20) CHECK (type IN ('choosable', 'uncountable')),
      merge_no INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER REFERENCES school_user(id),
      updated_by INTEGER REFERENCES school_user(id)
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_class_subjects_class_wise_subject_id ON class_subjects(class_wise_subject_id);
    CREATE INDEX IF NOT EXISTS idx_class_subjects_subject_id ON class_subjects(subject_id);
    CREATE INDEX IF NOT EXISTS idx_class_subjects_serial_no ON class_subjects(serial_no);
    CREATE INDEX IF NOT EXISTS idx_class_subjects_type ON class_subjects(type);
    CREATE INDEX IF NOT EXISTS idx_class_subjects_created_at ON class_subjects(created_at);

    -- Create unique constraint to prevent duplicate subject assignments within the same class-group combination
    CREATE UNIQUE INDEX IF NOT EXISTS uq_class_subjects_class_wise_subject_serial ON class_subjects(class_wise_subject_id, serial_no);

    -- Add comments for documentation
    COMMENT ON TABLE class_subjects IS 'Stores subject assignments for specific class-group combinations';
    COMMENT ON COLUMN class_subjects.class_wise_subject_id IS 'Reference to the class-wise subject combination';
    COMMENT ON COLUMN class_subjects.subject_id IS 'Reference to the subject';
    COMMENT ON COLUMN class_subjects.serial_no IS 'Serial number for the subject (unique within class-group)';
    COMMENT ON COLUMN class_subjects.type IS 'Type of subject (choosable/uncountable)';
    COMMENT ON COLUMN class_subjects.merge_no IS 'Merge number for the subject (default 0)';
  `);
};
