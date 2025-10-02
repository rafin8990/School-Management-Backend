import pool from '../../../../utils/dbClient';
import { IGradeSetup, IGradeSetupWithDetails, IGradePointSetup } from './grade-setup.interface';

const create = async (data: IGradeSetup): Promise<IGradeSetup> => {
  const query = `
    INSERT INTO grade_setup (exam_id, year_id, class_id, school_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [data.exam_id, data.year_id ?? null, data.class_id, data.school_id];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const getByExamAndYear = async (examId: number, yearId: number | null, schoolId: number): Promise<IGradeSetupWithDetails[]> => {
  const query = `
    SELECT 
      gs.*,
      ce.class_exam_name as exam_name,
      ay.name as year,
      c.name as class_name
    FROM grade_setup gs
    LEFT JOIN class_exam ce ON gs.exam_id = ce.id
    LEFT JOIN academic_year ay ON gs.year_id = ay.id
    LEFT JOIN class c ON gs.class_id = c.id
    WHERE gs.exam_id = $1 
      AND (gs.year_id = $2 OR (gs.year_id IS NULL AND $2 IS NULL))
      AND gs.school_id = $3
    ORDER BY c.serial_number ASC;
  `;
  const res = await pool.query(query, [examId, yearId, schoolId]);
  return res.rows;
};

const getById = async (id: number, schoolId: number): Promise<IGradeSetupWithDetails | null> => {
  const query = `
    SELECT 
      gs.*,
      ce.class_exam_name as exam_name,
      ay.name as year,
      c.name as class_name
    FROM grade_setup gs
    LEFT JOIN class_exam ce ON gs.exam_id = ce.id
    LEFT JOIN academic_year ay ON gs.year_id = ay.id
    LEFT JOIN class c ON gs.class_id = c.id
    WHERE gs.id = $1 AND gs.school_id = $2;
  `;
  const res = await pool.query(query, [id, schoolId]);
  return res.rows[0] || null;
};

const update = async (id: number, data: Partial<IGradeSetup>): Promise<IGradeSetup | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) { 
      fields.push(`${k} = $${idx++}`); 
      values.push(v); 
    }
  }
  if (fields.length === 0) return null;
  const res = await pool.query(`UPDATE grade_setup SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *;`, [...values, id]);
  return res.rows[0] || null;
};

const remove = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM grade_setup WHERE id = $1;', [id]);
};

const upsertGradeSetup = async (examId: number, yearId: number | null, classIds: number[], schoolId: number): Promise<IGradeSetup[]> => {
  const results: IGradeSetup[] = [];
  // Validate year exists if provided
  if (yearId !== null) {
    const yearCheck = await pool.query('SELECT id FROM academic_year WHERE id = $1', [yearId]);
    if (yearCheck.rows.length === 0) {
      throw new Error('Invalid academic year. Please select a valid year.');
    }
  }
  
  for (const classId of classIds) {
    // Check if grade setup already exists
    const existingQuery = `
      SELECT * FROM grade_setup 
      WHERE exam_id = $1 AND (year_id = $2 OR (year_id IS NULL AND $2 IS NULL)) 
      AND class_id = $3 AND school_id = $4;
    `;
    const existing = await pool.query(existingQuery, [examId, yearId, classId, schoolId]);
    
    if (existing.rows.length > 0) {
      results.push(existing.rows[0]);
    } else {
      // Create new grade setup
      const newGradeSetup = await create({
        exam_id: examId,
        year_id: yearId,
        class_id: classId,
        school_id: schoolId
      });
      results.push(newGradeSetup);
    }
  }
  
  return results;
};

// Grade Point Setup methods
const createGradePoint = async (data: IGradePointSetup): Promise<IGradePointSetup> => {
  const query = `
    INSERT INTO grade_point_setup (grade_setup_id, mark_point_first, mark_point_second, grade_point, letter_grade, note, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  const values = [
    data.grade_setup_id,
    data.mark_point_first,
    data.mark_point_second,
    data.grade_point ?? null,
    data.letter_grade ?? null,
    data.note ?? null,
    data.status
  ];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const getGradePointsBySetupId = async (gradeSetupId: number): Promise<IGradePointSetup[]> => {
  const query = `
    SELECT * FROM grade_point_setup 
    WHERE grade_setup_id = $1 
    ORDER BY mark_point_first DESC, mark_point_second DESC;
  `;
  const res = await pool.query(query, [gradeSetupId]);
  return res.rows;
};

const updateGradePoint = async (id: number, data: Partial<IGradePointSetup>): Promise<IGradePointSetup | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) { 
      fields.push(`${k} = $${idx++}`); 
      values.push(v); 
    }
  }
  if (fields.length === 0) return null;
  const res = await pool.query(`UPDATE grade_point_setup SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *;`, [...values, id]);
  return res.rows[0] || null;
};

const deleteGradePoint = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM grade_point_setup WHERE id = $1;', [id]);
};

const bulkUpsertGradePoints = async (gradeSetupId: number, gradePoints: Omit<IGradePointSetup, 'id' | 'grade_setup_id'>[]): Promise<IGradePointSetup[]> => {
  // First, delete existing grade points for this setup
  await pool.query('DELETE FROM grade_point_setup WHERE grade_setup_id = $1;', [gradeSetupId]);
  
  // Then insert new ones
  if (gradePoints.length === 0) return [];
  
  const values: any[] = [];
  const placeholders: string[] = [];
  let paramIndex = 1;
  
  gradePoints.forEach((gradePoint) => {
    placeholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5}, $${paramIndex + 6})`);
    values.push(
      gradeSetupId,
      gradePoint.mark_point_first,
      gradePoint.mark_point_second,
      gradePoint.grade_point ?? null,
      gradePoint.letter_grade ?? null,
      gradePoint.note ?? null,
      gradePoint.status
    );
    paramIndex += 7;
  });
  
  const query = `
    INSERT INTO grade_point_setup (grade_setup_id, mark_point_first, mark_point_second, grade_point, letter_grade, note, status)
    VALUES ${placeholders.join(', ')} RETURNING *;
  `;
  
  const res = await pool.query(query, values);
  return res.rows;
};

export const GradeSetupService = { 
  create, 
  getByExamAndYear, 
  getById, 
  update, 
  remove, 
  upsertGradeSetup,
  createGradePoint,
  getGradePointsBySetupId,
  updateGradePoint,
  deleteGradePoint,
  bulkUpsertGradePoints
};
