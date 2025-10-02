import pool from '../utils/dbClient';

export const name = '1758584500000_create_set_signature_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS set_signature (
      id SERIAL PRIMARY KEY,
      report_id INTEGER NOT NULL REFERENCES report(id) ON DELETE CASCADE,
      signature_id INTEGER NOT NULL REFERENCES signature(id) ON DELETE CASCADE,
      position VARCHAR(20) NULL CHECK (position IN ('left','middle','right')),
      status VARCHAR(20) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active','inactive')),
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(report_id, signature_id, school_id)
    );

    CREATE INDEX IF NOT EXISTS idx_set_signature_report_id ON set_signature(report_id);
    CREATE INDEX IF NOT EXISTS idx_set_signature_signature_id ON set_signature(signature_id);
    CREATE INDEX IF NOT EXISTS idx_set_signature_school_id ON set_signature(school_id);
    CREATE INDEX IF NOT EXISTS idx_set_signature_status ON set_signature(status);
  `);
};


