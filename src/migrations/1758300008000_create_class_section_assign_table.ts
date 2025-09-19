import pool from '../utils/dbClient';

export const name = '1758300008000_create_class_section_assign_table';

export const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS class_section_assign (
      id SERIAL PRIMARY KEY,
      class_id INT NOT NULL REFERENCES class(id) ON DELETE CASCADE,
      section_ids INT[] NULL,
      school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (school_id, class_id)
    );
  `);
};
