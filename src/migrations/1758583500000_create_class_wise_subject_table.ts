import pool from '../utils/dbClient';

export const name = '1758583500000_create_class_wise_subject_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS class_wise_subject (
      id SERIAL PRIMARY KEY,
      class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE CASCADE,
      group_id INTEGER NOT NULL REFERENCES student_group(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER REFERENCES school_user(id),
      updated_by INTEGER REFERENCES school_user(id)
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_class_wise_subject_class_id ON class_wise_subject(class_id);
    CREATE INDEX IF NOT EXISTS idx_class_wise_subject_group_id ON class_wise_subject(group_id);
    CREATE INDEX IF NOT EXISTS idx_class_wise_subject_school_id ON class_wise_subject(school_id);
    CREATE INDEX IF NOT EXISTS idx_class_wise_subject_status ON class_wise_subject(status);
    CREATE INDEX IF NOT EXISTS idx_class_wise_subject_created_at ON class_wise_subject(created_at);

    -- Create unique constraint to prevent duplicate class-group combinations
    CREATE UNIQUE INDEX IF NOT EXISTS uq_class_wise_subject_class_group_school ON class_wise_subject(class_id, group_id, school_id);

    -- Add comments for documentation
    COMMENT ON TABLE class_wise_subject IS 'Stores class and group combinations for subject assignment';
    COMMENT ON COLUMN class_wise_subject.class_id IS 'Reference to the class';
    COMMENT ON COLUMN class_wise_subject.group_id IS 'Reference to the student group';
    COMMENT ON COLUMN class_wise_subject.status IS 'Status of the class-group combination (active/inactive)';
    COMMENT ON COLUMN class_wise_subject.school_id IS 'Reference to the school';
  `);
};
