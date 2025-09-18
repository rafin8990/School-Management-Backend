import pool from '../utils/dbClient';

export const name = '1758200000000_create_school_user_table';

export const run = async () => {
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'school_user_role') THEN
        CREATE TYPE school_user_role AS ENUM ('school_super_admin', 'school_admin', 'admin', 'user');
      END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS school_user (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      username VARCHAR(100) NOT NULL UNIQUE,
      mobile_no VARCHAR(20) NOT NULL,
      photo VARCHAR(255),
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      address TEXT,
      role school_user_role NOT NULL DEFAULT 'school_admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_school_user_school_id ON school_user(school_id);
    CREATE INDEX IF NOT EXISTS idx_school_user_mobile_no ON school_user(mobile_no);
  `);
};


