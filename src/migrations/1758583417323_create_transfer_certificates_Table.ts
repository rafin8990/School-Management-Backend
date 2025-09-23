import pool from '../utils/dbClient';

export const name = '1758583417323_create_transfer_certificates_Table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transfer_certificates (
      id SERIAL PRIMARY KEY,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      exam_name VARCHAR(255),
      appeared_exam VARCHAR(255),
      appeared_year INTEGER NOT NULL,
      last_payment_month VARCHAR(50),
      promoted_class VARCHAR(100),
      detained_class VARCHAR(100),
      reason_for_leave TEXT,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER REFERENCES school_user(id),
      updated_by INTEGER REFERENCES school_user(id)
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_transfer_certificates_school_id ON transfer_certificates(school_id);
    CREATE INDEX IF NOT EXISTS idx_transfer_certificates_class_id ON transfer_certificates(class_id);
    CREATE INDEX IF NOT EXISTS idx_transfer_certificates_student_id ON transfer_certificates(student_id);
    CREATE INDEX IF NOT EXISTS idx_transfer_certificates_status ON transfer_certificates(status);
    CREATE INDEX IF NOT EXISTS idx_transfer_certificates_created_at ON transfer_certificates(created_at);

    -- Add comments for documentation
    COMMENT ON TABLE transfer_certificates IS 'Stores transfer certificate information for students';
    COMMENT ON COLUMN transfer_certificates.school_id IS 'Reference to the school';
    COMMENT ON COLUMN transfer_certificates.class_id IS 'Reference to the class (mandatory)';
    COMMENT ON COLUMN transfer_certificates.student_id IS 'Reference to the student (mandatory)';
    COMMENT ON COLUMN transfer_certificates.appeared_year IS 'Year when exam was appeared (mandatory)';
    COMMENT ON COLUMN transfer_certificates.status IS 'Status of the transfer certificate (active/inactive/archived)';
  `);
};