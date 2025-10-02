import httpStatus from 'http-status';

import { 
  IMarkInput, 
  IMarkInputFilters, 
  IMarkInputSearchParams, 
  IMarkInputStudentData, 
  IMarkInputBulkSave,
  IGradeSetup,
  IMarkInputDeleteBySubjectWise,
  IMarkInputDeleteResult
} from './markInput.interface';
import pool from '../../../../utils/dbClient';
import ApiError from '../../../../errors/ApiError';
import { paginationHelpers } from '../../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';

// Search students for mark input based on filters
const searchStudentsForMarkInput = async (params: IMarkInputSearchParams): Promise<IMarkInputStudentData[]> => {
  const { class_id, subject_id, exam_id, year_id, group_id, section_id, shift_id, category_id, school_id } = params;
  
  // Build conditions for student search
  const conditions: string[] = [
    's.school_id = $1',
    's.class_id = $2', 
    's.academic_year_id = $3',
    's.status = \'active\'',
    's.disabled = false'
  ];
  
  const values: any[] = [school_id, class_id, year_id];
  let paramIndex = 4;
  
  if (group_id) {
    conditions.push(`s.group_id = $${paramIndex++}`);
    values.push(group_id);
  }
  
  if (section_id) {
    conditions.push(`s.section_id = $${paramIndex++}`);
    values.push(section_id);
  }
  
  if (shift_id) {
    conditions.push(`s.shift_id = $${paramIndex++}`);
    values.push(shift_id);
  }
  
  if (category_id) {
    conditions.push(`s.category_id = $${paramIndex++}`);
    values.push(category_id);
  }
  
  // Get short codes for the exam and subject
  const shortCodesQuery = `
    SELECT 
      sc.id as short_code_id,
      sc.name as short_code_name,
      sem.total_marks,
      sem.pass_mark,
      sem.acceptance
    FROM set_exam_marks sem
    JOIN short_codes sc ON sem.short_code_id = sc.id
    WHERE sem.class_id = $1 
      AND sem.class_exam_id = $2 
      AND sem.subject_id = $3 
      AND sem.year_id = $4 
      AND sem.school_id = $5
      AND sem.status = 'active'
    ORDER BY sc.name
  `;
  
  const shortCodesResult = await pool.query(shortCodesQuery, [class_id, exam_id, subject_id, year_id, school_id]);
  
  if (shortCodesResult.rows.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No short codes found for the selected exam and subject'
    );
  }
  
  // Get students with their existing marks
  const studentsQuery = `
    SELECT 
      s.id as student_id,
      s.student_name_en,
      s.student_id as student_id_code,
      s.roll,
      s.group_id,
      s.section_id,
      s.shift_id,
      c.name as class_name,
      sub.name as subject_name,
      mi.id as existing_mark_id,
      mi.short_code_marks,
      mi.status as existing_status,
      mi.total_mark,
      mi.grade,
      mi.gpa
    FROM students s
    JOIN class c ON s.class_id = c.id
    JOIN subject sub ON sub.id = $${paramIndex++}
    LEFT JOIN mark_input mi ON mi.student_id = s.id 
      AND mi.exam_id = $${paramIndex++} 
      AND mi.subject_id = $${paramIndex++}
      AND mi.school_id = s.school_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY s.roll ASC, s.id ASC
  `;
  
  values.push(subject_id, exam_id, subject_id);
  
  const studentsResult = await pool.query(studentsQuery, values);
  
  return studentsResult.rows.map((row: any) => ({
    student_id: row.student_id,
    student_name_en: row.student_name_en,
    student_id_code: row.student_id_code,
    roll: row.roll,
    group_id: row.group_id,
    section_id: row.section_id,
    shift_id: row.shift_id,
    class_name: row.class_name,
    subject_name: row.subject_name,
    short_codes: shortCodesResult.rows,
    existing_marks: row.existing_mark_id ? {
      id: row.existing_mark_id,
      student_id: row.student_id,
      class_id,
      subject_id,
      exam_id,
      year_id,
      school_id,
      short_code_marks: row.short_code_marks || {},
      status: row.existing_status || 'present',
      total_mark: row.total_mark,
      grade: row.grade,
      gpa: row.gpa
    } : undefined
  }));
};

// Get or create default grade setup
const getOrCreateDefaultGradeSetup = async (class_id: number, exam_id: number, school_id: number): Promise<IGradeSetup> => {
  // Check if grade setup exists
  const existingQuery = `
    SELECT gs.id, gs.class_id, gs.exam_id, gs.school_id
    FROM grade_setup gs
    WHERE gs.class_id = $1 AND gs.exam_id = $2 AND gs.school_id = $3
  `;
  
  const existingResult = await pool.query(existingQuery, [class_id, exam_id, school_id]);
  
  if (existingResult.rows.length > 0) {
    // Get grade points for existing setup
    const gradePointsQuery = `
      SELECT mark_point_first, mark_point_second, letter_grade, grade_point
      FROM grade_point_setup
      WHERE grade_setup_id = $1
      ORDER BY mark_point_first DESC
    `;
    
    const gradePointsResult = await pool.query(gradePointsQuery, [existingResult.rows[0].id]);
    
    return {
      id: existingResult.rows[0].id,
      class_id,
      exam_id,
      school_id,
      grade_points: gradePointsResult.rows.map(row => ({
        mark_point_first: row.mark_point_first,
        mark_point_second: row.mark_point_second,
        grade: row.letter_grade,
        gpa: row.grade_point
      }))
    };
  }
  
  // Create default grade setup
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert grade setup
    const gradeSetupQuery = `
      INSERT INTO grade_setup (class_id, exam_id, school_id, status)
      VALUES ($1, $2, $3, 'active')
      RETURNING id
    `;
    
    const gradeSetupResult = await client.query(gradeSetupQuery, [class_id, exam_id, school_id]);
    const gradeSetupId = gradeSetupResult.rows[0].id;
    
    // Insert default grade points
    const defaultGradePoints = [
      { mark_point_first: 80, mark_point_second: 100, grade: 'A+', gpa: 5.0 },
      { mark_point_first: 70, mark_point_second: 79, grade: 'A', gpa: 4.0 },
      { mark_point_first: 60, mark_point_second: 69, grade: 'A-', gpa: 3.5 },
      { mark_point_first: 50, mark_point_second: 59, grade: 'B', gpa: 3.0 },
      { mark_point_first: 40, mark_point_second: 49, grade: 'C', gpa: 2.0 },
      { mark_point_first: 33, mark_point_second: 39, grade: 'D', gpa: 1.0 },
      { mark_point_first: 0, mark_point_second: 32, grade: 'F', gpa: 0.0 }
    ];
    
    for (const point of defaultGradePoints) {
      await client.query(`
        INSERT INTO grade_point_setup (grade_setup_id, mark_point_first, mark_point_second, letter_grade, grade_point)
        VALUES ($1, $2, $3, $4, $5)
      `, [gradeSetupId, point.mark_point_first, point.mark_point_second, point.grade, point.gpa]);
    }
    
    await client.query('COMMIT');
    
    return {
      id: gradeSetupId,
      class_id,
      exam_id,
      school_id,
      grade_points: defaultGradePoints
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Calculate grade and GPA based on marks
const calculateGradeAndGPA = async (
  totalMark: number, 
  class_id: number, 
  exam_id: number, 
  school_id: number
): Promise<{ grade: string; gpa: number }> => {
  const gradeSetup = await getOrCreateDefaultGradeSetup(class_id, exam_id, school_id);
  
  for (const point of gradeSetup.grade_points) {
    if (totalMark >= point.mark_point_first && totalMark <= point.mark_point_second) {
      return { grade: point.grade, gpa: point.gpa };
    }
  }
  
  // Default to F if no match found
  return { grade: 'F', gpa: 0.0 };
};

// Save mark input data
const saveMarkInput = async (data: IMarkInputBulkSave): Promise<IMarkInput[]> => {
  const { class_id, subject_id, exam_id, year_id, school_id, marks_data } = data;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const savedMarks: IMarkInput[] = [];
    
    for (const markData of marks_data) {
      const { student_id, group_id, section_id, shift_id, full_mark, short_code_marks, status } = markData;
      
      // Calculate total marks
      const totalMark = Object.values(short_code_marks).reduce((sum, mark) => sum + (mark || 0), 0);
      
      // Get short codes to calculate weighted total and check pass marks
      const shortCodesQuery = `
        SELECT sc.id, sem.acceptance, sem.pass_mark
        FROM set_exam_marks sem
        JOIN short_codes sc ON sem.short_code_id = sc.id
        WHERE sem.class_id = $1 
          AND sem.class_exam_id = $2 
          AND sem.subject_id = $3 
          AND sem.year_id = $4 
          AND sem.school_id = $5
          AND sem.status = 'active'
      `;
      
      const shortCodesResult = await pool.query(shortCodesQuery, [class_id, exam_id, subject_id, year_id, school_id]);
      
      // Check if student has failed any short code
      let hasFailedShortCode = false;
      for (const shortCode of shortCodesResult.rows) {
        const mark = short_code_marks[shortCode.id] || 0;
        if (mark < shortCode.pass_mark) {
          hasFailedShortCode = true;
          break;
        }
      }
      
      // Calculate weighted total for grade calculation
      let weightedTotal = 0;
      for (const shortCode of shortCodesResult.rows) {
        const mark = short_code_marks[shortCode.id] || 0;
        weightedTotal += mark * shortCode.acceptance;
      }
      
      // Calculate grade and GPA - if failed any short code, grade is F and GPA is 0
      let grade, gpa;
      if (hasFailedShortCode) {
        grade = 'F';
        gpa = 0;
      } else {
        const gradeResult = await calculateGradeAndGPA(weightedTotal, class_id, exam_id, school_id);
        grade = gradeResult.grade;
        gpa = gradeResult.gpa;
      }
      
      // Check if marks already exist
      const existingQuery = `
        SELECT id FROM mark_input 
        WHERE student_id = $1 AND exam_id = $2 AND subject_id = $3 AND school_id = $4
      `;
      
      const existingResult = await client.query(existingQuery, [student_id, exam_id, subject_id, school_id]);
      
      if (existingResult.rows.length > 0) {
        // Update existing marks
        const updateQuery = `
          UPDATE mark_input 
          SET short_code_marks = $1, 
              total_mark = $2, 
              full_mark = $3,
              grade = $4, 
              gpa = $5, 
              status = $6,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $7
          RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
          JSON.stringify(short_code_marks),
          totalMark,
          full_mark,
          grade,
          gpa,
          status,
          existingResult.rows[0].id
        ]);
        
        savedMarks.push(updateResult.rows[0]);
      } else {
        // Insert new marks
        const insertQuery = `
          INSERT INTO mark_input (
            student_id, class_id, group_id, section_id, shift_id, 
            subject_id, exam_id, year_id, school_id, 
            total_mark, full_mark, grade, gpa, status, short_code_marks
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          )
          RETURNING *
        `;
        
        const insertResult = await client.query(insertQuery, [
          student_id, class_id, group_id, section_id, shift_id,
          subject_id, exam_id, year_id, school_id,
          totalMark, full_mark, grade, gpa, status, JSON.stringify(short_code_marks)
        ]);
        
        savedMarks.push(insertResult.rows[0]);
      }
    }
    
    await client.query('COMMIT');
    return savedMarks;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Get all mark inputs with pagination
const getAllMarkInputs = async (
  filters: IMarkInputFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IMarkInput[]>> => {
  const { searchTerm, ...filterFields } = filters;
  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder = 'desc',
  } = paginationHelpers.calculatePagination({
    ...paginationOptions,
    sortBy: paginationOptions.sortBy || 'id',
  });

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (searchTerm) {
    conditions.push(
      `(s.student_name_en ILIKE $${paramIndex} OR s.student_id ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex} OR sub.name ILIKE $${paramIndex})`
    );
    values.push(`%${searchTerm}%`);
    paramIndex++;
  }

  for (const [field, value] of Object.entries(filterFields)) {
    if (value !== undefined && value !== null) {
      conditions.push(`mi.${field} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT mi.*,
           s.student_name_en,
           s.student_id as student_id_code,
           s.roll,
           c.name as class_name,
           g.name as group_name,
           sec.name as section_name,
           sh.name as shift_name,
           sub.name as subject_name,
           ce.class_exam_name as exam_name,
           ay.name as academic_year_name
    FROM mark_input mi
    LEFT JOIN students s ON mi.student_id = s.id
    LEFT JOIN class c ON mi.class_id = c.id
    LEFT JOIN student_group g ON mi.group_id = g.id
    LEFT JOIN section sec ON mi.section_id = sec.id
    LEFT JOIN shift sh ON mi.shift_id = sh.id
    LEFT JOIN subject sub ON mi.subject_id = sub.id
    LEFT JOIN class_exam ce ON mi.exam_id = ce.id
    LEFT JOIN academic_year ay ON mi.year_id = ay.id
    ${whereClause}
    ORDER BY mi.${sortBy} ${sortOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex};
  `;

  values.push(limit, skip);

  const result = await pool.query(query, values);

  const countQuery = `SELECT COUNT(*) FROM mark_input mi ${whereClause};`;
  const countResult = await pool.query(
    countQuery,
    values.slice(0, paramIndex - 2)
  );
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
    data: result.rows,
  };
};

// Get single mark input
const getSingleMarkInput = async (id: number): Promise<IMarkInput | null> => {
  const query = `
    SELECT mi.*,
           s.student_name_en,
           s.student_id as student_id_code,
           s.roll,
           c.name as class_name,
           g.name as group_name,
           sec.name as section_name,
           sh.name as shift_name,
           sub.name as subject_name,
           ce.class_exam_name as exam_name,
           ay.name as academic_year_name
    FROM mark_input mi
    LEFT JOIN students s ON mi.student_id = s.id
    LEFT JOIN class c ON mi.class_id = c.id
    LEFT JOIN student_group g ON mi.group_id = g.id
    LEFT JOIN section sec ON mi.section_id = sec.id
    LEFT JOIN shift sh ON mi.shift_id = sh.id
    LEFT JOIN subject sub ON mi.subject_id = sub.id
    LEFT JOIN class_exam ce ON mi.exam_id = ce.id
    LEFT JOIN academic_year ay ON mi.year_id = ay.id
    WHERE mi.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// Delete mark input
const deleteMarkInput = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = 'DELETE FROM mark_input WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Mark input not found');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Bulk upload mark input from Excel data
const bulkUploadMarkInput = async (data: any): Promise<IMarkInput[]> => {
  const { class_id, subject_id, exam_id, year_id, school_id, marks_data } = data;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const savedMarks: IMarkInput[] = [];
    
    for (const markData of marks_data) {
      const { student_id, group_id, section_id, shift_id, full_mark, short_code_marks, status } = markData;
      
      // Calculate total marks
      const totalMark = Object.values(short_code_marks).reduce((sum: number, mark: any) => sum + (mark || 0), 0);
      
      // Get short codes to calculate weighted total and check pass marks
      const shortCodesQuery = `
        SELECT sc.id, sem.acceptance, sem.pass_mark
        FROM set_exam_marks sem
        JOIN short_codes sc ON sem.short_code_id = sc.id
        WHERE sem.class_id = $1 
          AND sem.class_exam_id = $2 
          AND sem.subject_id = $3 
          AND sem.year_id = $4 
          AND sem.school_id = $5
          AND sem.status = 'active'
      `;
      
      const shortCodesResult = await pool.query(shortCodesQuery, [class_id, exam_id, subject_id, year_id, school_id]);
      
      // Check if student has failed any short code
      let hasFailedShortCode = false;
      for (const shortCode of shortCodesResult.rows) {
        const mark = short_code_marks[shortCode.id] || 0;
        if (mark < shortCode.pass_mark) {
          hasFailedShortCode = true;
          break;
        }
      }
      
      // Calculate weighted total for grade calculation
      let weightedTotal = 0;
      for (const shortCode of shortCodesResult.rows) {
        const mark = short_code_marks[shortCode.id] || 0;
        weightedTotal += mark * shortCode.acceptance;
      }
      
      // Calculate grade and GPA - if failed any short code, grade is F and GPA is 0
      let grade, gpa;
      if (hasFailedShortCode) {
        grade = 'F';
        gpa = 0;
      } else {
        const gradeResult = await calculateGradeAndGPA(weightedTotal, class_id, exam_id, school_id);
        grade = gradeResult.grade;
        gpa = gradeResult.gpa;
      }
      
      // Check if marks already exist
      const existingQuery = `
        SELECT id FROM mark_input 
        WHERE student_id = $1 AND exam_id = $2 AND subject_id = $3 AND school_id = $4
      `;
      
      const existingResult = await client.query(existingQuery, [student_id, exam_id, subject_id, school_id]);
      
      if (existingResult.rows.length > 0) {
        // Update existing marks
        const updateQuery = `
          UPDATE mark_input 
          SET short_code_marks = $1, 
              total_mark = $2, 
              full_mark = $3,
              grade = $4, 
              gpa = $5, 
              status = $6,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $7
          RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
          JSON.stringify(short_code_marks),
          totalMark,
          full_mark,
          grade,
          gpa,
          status,
          existingResult.rows[0].id
        ]);
        
        savedMarks.push(updateResult.rows[0]);
      } else {
        // Insert new marks
        const insertQuery = `
          INSERT INTO mark_input (
            student_id, class_id, group_id, section_id, shift_id, 
            subject_id, exam_id, year_id, school_id, 
            total_mark, full_mark, grade, gpa, status, short_code_marks
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          )
          RETURNING *
        `;
        
        const insertResult = await client.query(insertQuery, [
          student_id, class_id, group_id, section_id, shift_id,
          subject_id, exam_id, year_id, school_id,
          totalMark, full_mark, grade, gpa, status, JSON.stringify(short_code_marks)
        ]);
        
        savedMarks.push(insertResult.rows[0]);
      }
    }
    
    await client.query('COMMIT');
    return savedMarks;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Delete mark input records by subject-wise criteria
const deleteMarkInputBySubjectWise = async (params: IMarkInputDeleteBySubjectWise): Promise<IMarkInputDeleteResult> => {
  const { class_id, subject_id, exam_id, year_id, school_id, group_id, section_id, shift_id } = params;
  
  const client = await pool.connect();
  
  try {
    // Build conditions for deletion
    const conditions: string[] = [
      'school_id = $1',
      'class_id = $2',
      'subject_id = $3',
      'exam_id = $4',
      'year_id = $5'
    ];
    
    const values: any[] = [school_id, class_id, subject_id, exam_id, year_id];
    let paramIndex = 6;
    
    if (group_id) {
      conditions.push(`group_id = $${paramIndex++}`);
      values.push(group_id);
    }
    
    if (section_id) {
      conditions.push(`section_id = $${paramIndex++}`);
      values.push(section_id);
    }
    
    if (shift_id) {
      conditions.push(`shift_id = $${paramIndex++}`);
      values.push(shift_id);
    }
    
    const whereClause = conditions.join(' AND ');
    
    // First, get count of records to be deleted
    const countQuery = `SELECT COUNT(*) as count FROM mark_input WHERE ${whereClause}`;
    const countResult = await client.query(countQuery, values);
    const recordCount = parseInt(countResult.rows[0].count);
    
    if (recordCount === 0) {
      return {
        deleted_count: 0,
        message: 'No records found matching the criteria'
      };
    }
    
    // Delete the records
    const deleteQuery = `DELETE FROM mark_input WHERE ${whereClause}`;
    await client.query(deleteQuery, values);
    
    return {
      deleted_count: recordCount,
      message: `Successfully deleted ${recordCount} mark input record(s)`
    };
    
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const MarkInputService = {
  searchStudentsForMarkInput,
  saveMarkInput,
  getAllMarkInputs,
  getSingleMarkInput,
  deleteMarkInput,
  getOrCreateDefaultGradeSetup,
  calculateGradeAndGPA,
  bulkUploadMarkInput,
  deleteMarkInputBySubjectWise,
};
