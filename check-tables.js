const pool = require('./src/utils/dbClient');

async function checkTables() {
  try {
    // Check if short_codes table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'short_codes'
      );
    `);

    
    // Check if set_exam_marks table exists
    const result2 = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'set_exam_marks'
      );
    `);
    
    
    // Check if mark_input table exists
    const result3 = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'mark_input'
      );
    `);
    

    
    process.exit(0);
  } catch (error) {
    console.error('Error checking tables:', error);
    process.exit(1);
  }
}

checkTables();
