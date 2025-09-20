import httpStatus from 'http-status';
import { IStudent, IStudentFilters } from './student.interface';
import pool from '../../../utils/dbClient';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import ApiError from '../../../errors/ApiError';

// Generate next student ID for a school
const generateStudentId = async (schoolId: number): Promise<string> => {
  const query = `
    SELECT student_id 
    FROM students 
    WHERE school_id = $1 AND student_id IS NOT NULL 
    ORDER BY student_id DESC 
    LIMIT 1;
  `;

  const result = await pool.query(query, [schoolId]);

  if (result.rows.length === 0) {
    // First student for this school
    return '2025001';
  }

  const lastStudentId = result.rows[0].student_id;
  const lastNumber = parseInt(lastStudentId);
  const nextNumber = lastNumber + 1;

  return nextNumber.toString();
};

// Get classes with their assigned groups, sections, and shifts
const getClassesWithAssignments = async (schoolId: number) => {
  const query = `
    SELECT 
      c.id,
      c.name,
      c.status,
      g.id as group_id,
      g.name as group_name,
      s.id as section_id,
      s.name as section_name,
      sh.id as shift_id,
      sh.name as shift_name
    FROM class c
    LEFT JOIN class_group_assign cga ON c.id = cga.class_id AND c.school_id = cga.school_id
    LEFT JOIN student_group g ON g.id = ANY(cga.group_ids) AND g.status = 'active'
    LEFT JOIN class_section_assign csa ON c.id = csa.class_id AND c.school_id = csa.school_id
    LEFT JOIN section s ON s.id = ANY(csa.section_ids) AND s.status = 'active'
    LEFT JOIN class_shift_assign csh ON c.id = csh.class_id AND c.school_id = csh.school_id
    LEFT JOIN shift sh ON sh.id = ANY(csh.shift_ids) AND sh.status = 'active'
    WHERE c.school_id = $1 AND c.status = 'active'
    ORDER BY c.name, g.name, s.name, sh.name;
  `;

  const result = await pool.query(query, [schoolId]);
  return result.rows;
};

const createStudent = async (data: IStudent): Promise<IStudent | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Generate student ID if not provided
    let studentId = data.student_id;
    if (!studentId) {
      studentId = await generateStudentId(data.school_id);
    }

    // Check if student_id already exists for this school
    if (studentId) {
      const checkQuery = `
        SELECT id FROM students 
        WHERE student_id = $1 AND school_id = $2;
      `;
      const existingStudent = await client.query(checkQuery, [studentId, data.school_id]);

      if (existingStudent.rows.length > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'Student ID already exists for this school');
      }
    }

    const insertQuery = `
      INSERT INTO students (
        student_name_en, student_name_bn, student_id, mobile, group_id, section_id, class_id, shift_id,
        date_of_birth_en, date_of_birth_bn, roll, category_id, blood_group, gender, national_id,
        nationality, religion, session_id, academic_year_id, admission_date,
        student_photo, father_name_en, father_name_bn, father_nid, father_mobile, father_dob_en, father_dob_bn,
        father_occupation_en, father_occupation_bn, father_income, mother_name_en, mother_name_bn, mother_nid, mother_mobile,
        mother_dob_en, mother_dob_bn, mother_occupation_en, mother_occupation_bn, mother_income, current_village_en, current_village_bn,
        current_post_office_en, current_post_office_bn, current_post_code, current_district, current_thana,
        permanent_village_en, permanent_village_bn, permanent_post_office_en, permanent_post_office_bn, permanent_post_code,
        permanent_district, permanent_thana, guardian_name_en, guardian_name_bn, guardian_address_en, guardian_address_bn,
        last_institution, last_class, registration_number, result, year_passed,
        status, password, school_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34,
        $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
        $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65
      )
      RETURNING *;
    `;

    const values = [
      data.student_name_en,
      data.student_name_bn || null,
      studentId,
      data.mobile || null,
      data.group_id,
      data.section_id || null,
      data.class_id,
      data.shift_id,
      data.date_of_birth_en || null,
      data.date_of_birth_bn || null,
      data.roll || null,
      data.category_id || null,
      data.blood_group || null,
      data.gender || null,
      data.national_id || null,
      data.nationality || 'Bangladeshi',
      data.religion || null,
      data.session_id || null,
      data.academic_year_id,
      data.admission_date || null,
      data.student_photo || null,
      data.father_name_en || null,
      data.father_name_bn || null,
      data.father_nid || null,
      data.father_mobile || null,
      data.father_dob_en || null,
      data.father_dob_bn || null,
      data.father_occupation_en || null,
      data.father_occupation_bn || null,
      data.father_income || null,
      data.mother_name_en || null,
      data.mother_name_bn || null,
      data.mother_nid || null,
      data.mother_mobile || null,
      data.mother_dob_en || null,
      data.mother_dob_bn || null,
      data.mother_occupation_en || null,
      data.mother_occupation_bn || null,
      data.mother_income || null,
      data.current_village_en || null,
      data.current_village_bn || null,
      data.current_post_office_en || null,
      data.current_post_office_bn || null,
      data.current_post_code || null,
      data.current_district || null,
      data.current_thana || null,
      data.permanent_village_en || null,
      data.permanent_village_bn || null,
      data.permanent_post_office_en || null,
      data.permanent_post_office_bn || null,
      data.permanent_post_code || null,
      data.permanent_district || null,
      data.permanent_thana || null,
      data.guardian_name_en || null,
      data.guardian_name_bn || null,
      data.guardian_address_en || null,
      data.guardian_address_bn || null,
      data.last_institution || null,
      data.last_class || null,
      data.registration_number || null,
      data.result || null,
      data.year_passed || null,
      data.status || 'active',
      data.password || '123456',
      data.school_id,
    ];

    const result = await client.query(insertQuery, values);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filterFields } = filters;
  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder = 'desc',
  } = paginationHelpers.calculatePagination({
    ...paginationOptions,
    sortBy: paginationOptions.sortBy || 'id'
  });

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (searchTerm) {
    conditions.push(`(s.student_name_en ILIKE $${paramIndex} OR s.student_id ILIKE $${paramIndex} OR s.mobile ILIKE $${paramIndex} OR s.roll::text ILIKE $${paramIndex} OR s.date_of_birth_en::text ILIKE $${paramIndex})`);
    values.push(`%${searchTerm}%`);
    paramIndex++;
  }

  for (const [field, value] of Object.entries(filterFields)) {
    if (value !== undefined && value !== null) {
      conditions.push(`s.${field} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT s.*,
           c.name as class_name,
           g.name as group_name,
           sec.name as section_name,
           cat.name as category_name,
           ay.name as academic_year_name,
           asess.name as session_name
    FROM students s
    LEFT JOIN class c ON s.class_id = c.id
    LEFT JOIN student_group g ON s.group_id = g.id
    LEFT JOIN section sec ON s.section_id = sec.id
    LEFT JOIN category cat ON s.category_id = cat.id
    LEFT JOIN academic_year ay ON s.academic_year_id = ay.id
    LEFT JOIN academic_session asess ON s.session_id = asess.id
    ${whereClause}
    ORDER BY s.${sortBy} ${sortOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex};
  `;

  values.push(limit, skip);

  const result = await pool.query(query, values);

  const countQuery = `SELECT COUNT(*) FROM students s ${whereClause};`;
  const countResult = await pool.query(countQuery, values.slice(0, paramIndex - 2));
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

const getSingleStudent = async (id: number): Promise<IStudent | null> => {
  const query = `
    SELECT s.*,
           c.name as class_name,
           g.name as group_name,
           sec.name as section_name,
           cat.name as category_name,
           ay.name as academic_year_name,
           asess.name as session_name
    FROM students s
    LEFT JOIN class c ON s.class_id = c.id
    LEFT JOIN student_group g ON s.group_id = g.id
    LEFT JOIN section sec ON s.section_id = sec.id
    LEFT JOIN category cat ON s.category_id = cat.id
    LEFT JOIN academic_year ay ON s.academic_year_id = ay.id
    LEFT JOIN academic_session asess ON s.session_id = asess.id
    WHERE s.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const updateStudent = async (id: number, data: Partial<IStudent>): Promise<IStudent | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // If updating student_id, check for uniqueness
    if (data.student_id) {
      const checkQuery = `
        SELECT id FROM students 
        WHERE student_id = $1 AND school_id = $2 AND id != $3;
      `;
      const existingStudent = await client.query(checkQuery, [data.student_id, data.school_id, id]);

      if (existingStudent.rows.length > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'Student ID already exists for this school');
      }
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No fields to update');
    }

    const query = `
      UPDATE students 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteStudent = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = 'DELETE FROM students WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Type for student patch
type StudentPatch = { id: number } & Record<string, any>;

// Check if value is a plain object (not array)
const isPlainObject = (v: unknown) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Allowed fields whitelist - snake_case columns
const ALLOWED = new Set<string>([
  // basic
  'student_name_en', 'student_name_bn', 'mobile', 'gender', 'religion', 'blood_group', 'roll',
  'national_id', 'nationality', 'student_photo',
  // academic/assignment
  'class_id', 'group_id', 'section_id', 'shift_id', 'session_id', 'academic_year_id',
  // dates
  'date_of_birth_en', 'date_of_birth_bn', 'admission_date',
  // father
  'father_name_en', 'father_name_bn', 'father_nid', 'father_mobile', 'father_dob_en', 'father_dob_bn',
  'father_occupation_en', 'father_occupation_bn', 'father_income',
  // mother
  'mother_name_en', 'mother_name_bn', 'mother_nid', 'mother_mobile', 'mother_dob_en', 'mother_dob_bn',
  'mother_occupation_en', 'mother_occupation_bn', 'mother_income',
  // current address
  'current_village_en', 'current_village_bn', 'current_post_office_en', 'current_post_office_bn',
  'current_post_code', 'current_district', 'current_thana',
  // permanent address
  'permanent_village_en', 'permanent_village_bn', 'permanent_post_office_en', 'permanent_post_office_bn',
  'permanent_post_code', 'permanent_district', 'permanent_thana',
  // guardian & prev edu
  'guardian_name_en', 'guardian_name_bn', 'guardian_address_en', 'guardian_address_bn',
  'last_institution', 'last_class', 'registration_number', 'result', 'year_passed',
  // student code (varchar, unique per school)
  'student_id'
]);

// Safe identifier regex - only allows valid column names
const SAFE_IDENTIFIER = /^[a-z_][a-z0-9_]*$/;

const bulkUpdateStudents = async (patches: StudentPatch[], schoolId: number): Promise<{
  rows: IStudent[];
  updatedCount: number;
  failed: Array<{ id: number; error: string }>;
}> => {
  console.log('=== STUDENT SERVICE BULK UPDATE START ===');
  console.log('Service received patches:', JSON.stringify(patches, null, 2));
  console.log('School ID:', schoolId);
  
  const client = await pool.connect();
  const rows: IStudent[] = [];
  const failed: Array<{ id: number; error: string }> = [];

  try {
    await client.query('BEGIN');

    for (const patch of patches) {
      try {
        // 1) patch shape check
        if (!isPlainObject(patch)) {
          failed.push({ id: 0, error: 'Each patch must be an object' });
          continue;
        }

        const id = Number(patch.id);
        if (!Number.isFinite(id) || id <= 0) {
          failed.push({ id: 0, error: 'Each patch must include a positive numeric id' });
          continue;
        }

        // 2) build entries (skip forbidden/unknown/numeric keys)
        console.log(`\n=== Processing student ${id} ===`);
        console.log(`Raw patch:`, JSON.stringify(patch, null, 2));
        console.log(`Object.keys:`, Object.keys(patch));
        
        const entries = Object.entries(patch).filter(([k, v]) => {
          // Skip if key is numeric (like "0", "1", etc.)
          if (/^\d+$/.test(k)) {
            console.log(`❌ SKIPPING numeric key: "${k}"`);
            return false;
          }
          
          const isValid = k !== 'id' &&
            v !== undefined &&
            ALLOWED.has(k) &&
            SAFE_IDENTIFIER.test(k);
          
          if (!isValid) {
            console.log(`❌ SKIPPING key "${k}": value="${v}", ALLOWED=${ALLOWED.has(k)}, SAFE=${SAFE_IDENTIFIER.test(k)}`);
          } else {
            console.log(`✅ KEEPING key "${k}": value="${v}"`);
          }
          return isValid;
        });

        console.log(`Final entries for student ${id}:`, entries.map(([k]) => k));
        
        // Double check - ensure no numeric keys in entries
        const hasNumericKeys = entries.some(([k]) => /^\d+$/.test(k));
        if (hasNumericKeys) {
          console.log(`❌ ERROR: Found numeric keys in entries for student ${id}`);
          failed.push({ id, error: 'Invalid data structure - numeric keys detected' });
          continue;
        }

        if (entries.length === 0) {
          // nothing to update; optionally return current row
          const cur = await client.query(
            'SELECT * FROM students WHERE id=$1 AND school_id=$2 AND status = $3',
            [id, schoolId, 'active']
          );
          if (cur.rowCount === 0) {
            failed.push({ id, error: 'Not found for this school or not active' });
            continue;
          }
          rows.push(cur.rows[0]);
          continue;
        }

        // 3) unique guard for varchar student_id
        const newStudentCode = entries.find(([k]) => k === 'student_id')?.[1];
        if (newStudentCode) {
          const dup = await client.query(
            'SELECT 1 FROM students WHERE student_id=$1 AND school_id=$2 AND id<>$3',
            [newStudentCode, schoolId, id]
          );
          if (dup.rowCount) {
            failed.push({ id, error: `Student ID ${newStudentCode} already exists` });
            continue;
          }
        }

        // 4) ensure active/existing
        const ok = await client.query(
          'SELECT 1 FROM students WHERE id=$1 AND school_id=$2 AND status=$3',
          [id, schoolId, 'active']
        );
        if (ok.rowCount === 0) {
          failed.push({ id, error: 'Not found for this school or not active' });
          continue;
        }

        // 5) build SET ... WHERE with safe param indexes
        const setParts: string[] = [];
        const values: any[] = [];
        let p = 1;

        for (const [k, v] of entries) {
          const setPart = `${k} = $${p}`;
          setParts.push(setPart);
          values.push(v);
          p++;
        }
        setParts.push('updated_at = NOW()');

        const idIndex = p;      // next
        const schoolIndex = p + 1;

        const sql = `
          UPDATE students
          SET ${setParts.join(', ')}
          WHERE id = $${idIndex} AND school_id = $${schoolIndex} AND status = 'active'
          RETURNING *;
        `;
        values.push(id, schoolId);

        console.log(`🔧 SQL for student ${id}:`, sql);
        console.log(`📊 Values:`, values);

        const r = await client.query(sql, values);
        if (r.rowCount === 0) {
          failed.push({ id, error: 'Update matched 0 rows' });
          continue;
        }
        rows.push(r.rows[0]);
        console.log(`Successfully updated student ${id}`);

      } catch (error) {
        console.log(`Error processing student ${patch.id}:`, error);
        failed.push({ id: patch.id || 0, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    await client.query('COMMIT');
    console.log('Transaction committed successfully');
    console.log('Final results count:', rows.length);
    console.log('Failed count:', failed.length);
    console.log('=== STUDENT SERVICE BULK UPDATE END ===');
    
    return { rows, updatedCount: rows.length, failed };
  } catch (error) {
    console.log('ERROR in bulk update:', error);
    await client.query('ROLLBACK');
    console.log('Transaction rolled back');
    throw error;
  } finally {
    client.release();
  }
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  generateStudentId,
  getClassesWithAssignments,
  bulkUpdateStudents,
};
