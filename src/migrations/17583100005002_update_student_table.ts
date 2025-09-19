import pool from '../utils/dbClient';

export const name = '17583100005002_update_student_table';

export const run = async () => {
  // Drop existing foreign key constraint
  await pool.query(`
    ALTER TABLE students 
    DROP CONSTRAINT IF EXISTS students_group_id_fkey;
  `);
  
  // Rename the "groups" table to student_group (avoiding reserved keyword)
  await pool.query(`
    ALTER TABLE groups RENAME TO student_group;
  `);
  
  // Re-add the foreign key constraint with the new table name
  await pool.query(`
    ALTER TABLE students 
    ADD CONSTRAINT students_group_id_fkey 
    FOREIGN KEY (group_id) REFERENCES student_group(id) ON DELETE RESTRICT;
  `);

  console.log('Successfully renamed groups table to student_group and updated foreign key');
};