import pool from '../utils/dbClient';

export const name = '1758310006000_add_disabled_column_to_students_table';

export const run = async () => {
  await pool.query(`
    ALTER TABLE students
    ADD COLUMN IF NOT EXISTS disabled BOOLEAN NOT NULL DEFAULT FALSE;
  `);
};


