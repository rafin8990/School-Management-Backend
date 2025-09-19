import pool from '../utils/dbClient';

export const name = '1758320000000_seed_sample_data';

export const run = async () => {
  try {
    // Get the first school ID
    const schoolResult = await pool.query('SELECT id FROM school LIMIT 1');
    if (schoolResult.rows.length === 0) {
      console.log('No school found, skipping sample data creation');
      return;
    }
    
    const schoolId = schoolResult.rows[0].id;
    console.log(`Creating sample data for school ${schoolId}`);

    // Create sample groups
    await pool.query(`
      INSERT INTO student_group (name, serial_number, status, school_id) VALUES 
      ('General', 1, 'active', $1),
      ('Science', 2, 'active', $1),
      ('Commerce', 3, 'active', $1),
      ('Arts', 4, 'active', $1)
      ON CONFLICT (school_id, name) DO NOTHING
    `, [schoolId]);

    // Create sample sections
    await pool.query(`
      INSERT INTO section (name, serial_number, status, school_id) VALUES 
      ('A', 1, 'active', $1),
      ('B', 2, 'active', $1),
      ('C', 3, 'active', $1)
      ON CONFLICT (school_id, name) DO NOTHING
    `, [schoolId]);

    // Create sample shifts
    await pool.query(`
      INSERT INTO shift (name, serial_number, status, school_id) VALUES 
      ('Day', 1, 'active', $1),
      ('Morning', 2, 'active', $1),
      ('Evening', 3, 'active', $1)
      ON CONFLICT (school_id, name) DO NOTHING
    `, [schoolId]);

    // Get the created IDs
    const groupsResult = await pool.query('SELECT id FROM student_group WHERE school_id = $1', [schoolId]);
    const sectionsResult = await pool.query('SELECT id FROM section WHERE school_id = $1', [schoolId]);
    const shiftsResult = await pool.query('SELECT id FROM shift WHERE school_id = $1', [schoolId]);
    const classesResult = await pool.query('SELECT id FROM class WHERE school_id = $1', [schoolId]);

    console.log(`Found ${groupsResult.rows.length} groups`);
    console.log(`Found ${sectionsResult.rows.length} sections`);
    console.log(`Found ${shiftsResult.rows.length} shifts`);
    console.log(`Found ${classesResult.rows.length} classes`);

    // Assign groups, sections, and shifts to all classes
    for (const classRow of classesResult.rows) {
      const classId = classRow.id;

      // Assign groups to class
      const groupIds = groupsResult.rows.map(g => g.id);
      await pool.query(`
        INSERT INTO class_group_assign (class_id, group_ids, school_id) 
        VALUES ($1, $2, $3)
        ON CONFLICT (school_id, class_id) DO UPDATE SET group_ids = EXCLUDED.group_ids
      `, [classId, groupIds, schoolId]);

      // Assign sections to class
      const sectionIds = sectionsResult.rows.map(s => s.id);
      await pool.query(`
        INSERT INTO class_section_assign (class_id, section_ids, school_id) 
        VALUES ($1, $2, $3)
        ON CONFLICT (school_id, class_id) DO UPDATE SET section_ids = EXCLUDED.section_ids
      `, [classId, sectionIds, schoolId]);

      // Assign shifts to class
      const shiftIds = shiftsResult.rows.map(s => s.id);
      await pool.query(`
        INSERT INTO class_shift_assign (class_id, shift_ids, school_id) 
        VALUES ($1, $2, $3)
        ON CONFLICT (school_id, class_id) DO UPDATE SET shift_ids = EXCLUDED.shift_ids
      `, [classId, shiftIds, schoolId]);

      console.log(`Assigned groups, sections, and shifts to class ${classId}`);
    }

    console.log('Sample data creation completed successfully');
  } catch (error) {
    console.error('Error creating sample data:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};
