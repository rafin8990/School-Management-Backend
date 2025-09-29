import pool from '../utils/dbClient';

export const name = '1758583700000_create_short_codes_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS short_codes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      mark_position INTEGER NOT NULL,
      view_position INTEGER NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER REFERENCES school_user(id),
      updated_by INTEGER REFERENCES school_user(id)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS uq_short_codes_school_name ON short_codes(school_id, name);
    CREATE INDEX IF NOT EXISTS idx_short_codes_school ON short_codes(school_id);
    CREATE INDEX IF NOT EXISTS idx_short_codes_status ON short_codes(status);

    COMMENT ON TABLE short_codes IS 'Exam short codes and their positions';
  `);
};


