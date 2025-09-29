import pool from '../utils/dbClient';

export const name = '1758583900000_create_fourth_subject_tables';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fourth_subjects (
      id SERIAL PRIMARY KEY,
      subject_id INTEGER NOT NULL REFERENCES subject(id) ON DELETE CASCADE,
      school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (school_id, subject_id)
    );

    CREATE TABLE IF NOT EXISTS fourth_subject_students (
      id SERIAL PRIMARY KEY,
      fourth_subject_id INTEGER NOT NULL REFERENCES fourth_subjects(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (fourth_subject_id, student_id)
    );
  `);
};


