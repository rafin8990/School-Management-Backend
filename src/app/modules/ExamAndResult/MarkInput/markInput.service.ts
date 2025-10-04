// import httpStatus from 'http-status';

// import { 
//   IMarkInput, 
//   IMarkInputFilters, 
//   IMarkInputSearchParams, 
//   IMarkInputStudentData, 
//   IMarkInputBulkSave,
//   IGradeSetup,
//   IMarkInputDeleteBySubjectWise,
//   IMarkInputDeleteResult
// } from './markInput.interface';
// import pool from '../../../../utils/dbClient';
// import ApiError from '../../../../errors/ApiError';
// import { paginationHelpers } from '../../../../helpers/paginationHelper';
// import { IPaginationOptions } from '../../../../interfaces/pagination';
// import { IGenericResponse } from '../../../../interfaces/common';

// // Search students for mark input based on filters
// const searchStudentsForMarkInput = async (params: IMarkInputSearchParams): Promise<IMarkInputStudentData[]> => {
//   const { class_id, subject_id, exam_id, year_id, group_id, section_id, shift_id, category_id, school_id } = params;
  
//   // Build conditions for student search
//   const conditions: string[] = [
//     's.school_id = $1',
//     's.class_id = $2', 
//     's.academic_year_id = $3',
//     's.status = \'active\'',
//     's.disabled = false'
//   ];
  
//   const values: any[] = [school_id, class_id, year_id];
//   let paramIndex = 4;
  
//   if (group_id) {
//     conditions.push(`s.group_id = $${paramIndex++}`);
//     values.push(group_id);
//   }
  
//   if (section_id) {
//     conditions.push(`s.section_id = $${paramIndex++}`);
//     values.push(section_id);
//   }
  
//   if (shift_id) {
//     conditions.push(`s.shift_id = $${paramIndex++}`);
//     values.push(shift_id);
//   }
  
//   if (category_id) {
//     conditions.push(`s.category_id = $${paramIndex++}`);
//     values.push(category_id);
//   }
  
//   // Get short codes for the exam and subject
//   const shortCodesQuery = `
//     SELECT 
//       sc.id as short_code_id,
//       sc.name as short_code_name,
//       sem.total_marks,
//       sem.pass_mark,
//       sem.acceptance
//     FROM set_exam_marks sem
//     JOIN short_codes sc ON sem.short_code_id = sc.id
//     WHERE sem.class_id = $1 
//       AND sem.class_exam_id = $2 
//       AND sem.subject_id = $3 
//       AND sem.year_id = $4 
//       AND sem.school_id = $5
//       AND sem.status = 'active'
//     ORDER BY sc.name
//   `;
  
//   const shortCodesResult = await pool.query(shortCodesQuery, [class_id, exam_id, subject_id, year_id, school_id]);
  
//   if (shortCodesResult.rows.length === 0) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'No short codes found for the selected exam and subject'
//     );
//   }
  
//   // Get students with their existing marks
//   const studentsQuery = `
//     SELECT 
//       s.id as student_id,
//       s.student_name_en,
//       s.student_id as student_id_code,
//       s.roll,
//       s.group_id,
//       s.section_id,
//       s.shift_id,
//       c.name as class_name,
//       sub.name as subject_name,
//       mi.id as existing_mark_id,
//       mi.short_code_marks,
//       mi.status as existing_status,
//       mi.total_mark,
//       mi.grade,
//       mi.gpa
//     FROM students s
//     JOIN class c ON s.class_id = c.id
//     JOIN subject sub ON sub.id = $${paramIndex++}
//     LEFT JOIN mark_input mi ON mi.student_id = s.id 
//       AND mi.exam_id = $${paramIndex++} 
//       AND mi.subject_id = $${paramIndex++}
//       AND mi.school_id = s.school_id
//     WHERE ${conditions.join(' AND ')}
//     ORDER BY s.roll ASC, s.id ASC
//   `;
  
//   values.push(subject_id, exam_id, subject_id);
  
//   const studentsResult = await pool.query(studentsQuery, values);
  
//   return studentsResult.rows.map((row: any) => ({
//     student_id: row.student_id,
//     student_name_en: row.student_name_en,
//     student_id_code: row.student_id_code,
//     roll: row.roll,
//     group_id: row.group_id,
//     section_id: row.section_id,
//     shift_id: row.shift_id,
//     class_name: row.class_name,
//     subject_name: row.subject_name,
//     short_codes: shortCodesResult.rows,
//     existing_marks: row.existing_mark_id ? {
//       id: row.existing_mark_id,
//       student_id: row.student_id,
//       class_id,
//       subject_id,
//       exam_id,
//       year_id,
//       school_id,
//       short_code_marks: row.short_code_marks || {},
//       status: row.existing_status || 'present',
//       total_mark: row.total_mark,
//       grade: row.grade,
//       gpa: row.gpa
//     } : undefined
//   }));
// };

// // Get or create default grade setup - PERCENTAGE BASED
// const getOrCreateDefaultGradeSetup = async (class_id: number, exam_id: number, school_id: number): Promise<IGradeSetup> => {
//   // Check if grade setup exists
//   const existingQuery = `
//     SELECT gs.id, gs.class_id, gs.exam_id, gs.school_id
//     FROM grade_setup gs
//     WHERE gs.class_id = $1 AND gs.exam_id = $2 AND gs.school_id = $3
//   `;
  
//   const existingResult = await pool.query(existingQuery, [class_id, exam_id, school_id]);
  
//   if (existingResult.rows.length > 0) {
//     // Get grade points for existing setup
//     const gradePointsQuery = `
//       SELECT mark_point_first, mark_point_second, letter_grade, grade_point
//       FROM grade_point_setup
//       WHERE grade_setup_id = $1
//       ORDER BY mark_point_first DESC
//     `;
    
//     const gradePointsResult = await pool.query(gradePointsQuery, [existingResult.rows[0].id]);
    
//     return {
//       id: existingResult.rows[0].id,
//       class_id,
//       exam_id,
//       school_id,
//       grade_points: gradePointsResult.rows.map(row => ({
//         mark_point_first: row.mark_point_first,
//         mark_point_second: row.mark_point_second,
//         grade: row.letter_grade,
//         gpa: row.grade_point
//       }))
//     };
//   }
  
//   // Return default percentage-based grade setup (no database creation)
//   return {
//     id: 0, // No database ID for default setup
//     class_id,
//     exam_id,
//     school_id,
//     grade_points: [
//       { mark_point_first: 80, mark_point_second: 100, grade: 'A+', gpa: 5.0 },
//       { mark_point_first: 70, mark_point_second: 79, grade: 'A', gpa: 4.0 },
//       { mark_point_first: 60, mark_point_second: 69, grade: 'A-', gpa: 3.5 },
//       { mark_point_first: 50, mark_point_second: 59, grade: 'B', gpa: 3.0 },
//       { mark_point_first: 40, mark_point_second: 49, grade: 'C', gpa: 2.0 },
//       { mark_point_first: 33, mark_point_second: 39, grade: 'D', gpa: 1.0 },
//       { mark_point_first: 0, mark_point_second: 32, grade: 'F', gpa: 0.0 }
//     ]
//   };
// };

// // Calculate grade and GPA based on marks - PERCENTAGE BASED
// const calculateGradeAndGPA = async (
//   totalMark: number, 
//   fullMark: number,
//   class_id: number, 
//   exam_id: number, 
//   school_id: number
// ): Promise<{ grade: string; gpa: number }> => {
//   const gradeSetup = await getOrCreateDefaultGradeSetup(class_id, exam_id, school_id);
  
//   // Calculate percentage
//   const percentage = fullMark > 0 ? (totalMark / fullMark) * 100 : 0;
  
//   for (const point of gradeSetup.grade_points) {
//     if (percentage >= point.mark_point_first && percentage <= point.mark_point_second) {
//       return { grade: point.grade, gpa: Number(point.gpa) };
//     }
//   }
  
//   // Default to F if no match found
//   return { grade: 'F', gpa: 0.0 };
// };

// // Save mark input data - OPTIMIZED VERSION
// const saveMarkInput = async (data: IMarkInputBulkSave): Promise<IMarkInput[]> => {
//   const { class_id, subject_id, exam_id, year_id, school_id, marks_data } = data;
  
  
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
    
//     // 🚀 OPTIMIZATION 1: Get short codes once for all students
//     const shortCodesQuery = `
//       SELECT sc.id, sem.acceptance, sem.pass_mark
//       FROM set_exam_marks sem
//       JOIN short_codes sc ON sem.short_code_id = sc.id
//       WHERE sem.class_id = $1 
//         AND sem.class_exam_id = $2 
//         AND sem.subject_id = $3 
//         AND sem.year_id = $4 
//         AND sem.school_id = $5
//         AND sem.status = 'active'
//     `;
    
//     const shortCodesResult = await client.query(shortCodesQuery, [class_id, exam_id, subject_id, year_id, school_id]);
//     const shortCodesMap = new Map(shortCodesResult.rows.map(row => [row.id, row]));
    
//     // 🚀 OPTIMIZATION 2: Get grade setup once
//     const gradeSetup = await getOrCreateDefaultGradeSetup(class_id, exam_id, school_id);
    
//     // 🚀 OPTIMIZATION 3: Get all existing marks in one query
//     const studentIds = marks_data.map(m => m.student_id);
//     const existingMarksQuery = `
//       SELECT id, student_id FROM mark_input 
//       WHERE student_id = ANY($1::bigint[]) AND exam_id = $2 AND subject_id = $3 AND school_id = $4
//     `;
//     const existingMarksResult = await client.query(existingMarksQuery, [studentIds, exam_id, subject_id, school_id]);
//     const existingMarksMap = new Map(existingMarksResult.rows.map(row => [row.student_id, row.id]));
    
//     const savedMarks: IMarkInput[] = [];
//     const updateQueries: any[] = [];
//     const insertQueries: any[] = [];
    
//     // 🚀 OPTIMIZATION 4: Process all students in memory first
//     for (const markData of marks_data) {
//       const { student_id, group_id, section_id, shift_id, full_mark, short_code_marks, status, total_mark, grade, gpa } = markData;
      
//       // Use frontend calculated values if available, otherwise calculate
//       const finalTotalMark = total_mark || Object.values(short_code_marks).reduce((sum, mark) => sum + (mark || 0), 0);
//       const finalGrade = grade || 'F';
//       const finalGpa = gpa || 0;
      
//       // If frontend didn't provide calculated values, calculate them
//       let calculatedGrade = finalGrade;
//       let calculatedGpa = finalGpa;
      
//       if (!grade || !gpa) {
//         // Check if student has failed any short code
//         let hasFailedShortCode = false;
//         let weightedTotal = 0;
        
//         for (const [shortCodeId, shortCode] of shortCodesMap) {
//           const mark = short_code_marks[shortCodeId] || 0;
//           if (mark < shortCode.pass_mark) {
//             hasFailedShortCode = true;
//           }
//           weightedTotal += mark * shortCode.acceptance;
//         }
        
//         // Calculate grade and GPA - if failed any short code, grade is F and GPA is 0
//         if (hasFailedShortCode) {
//           calculatedGrade = 'F';
//           calculatedGpa = 0;
//         } else {
//           // Calculate percentage-based grade
//           const percentage = full_mark > 0 ? (weightedTotal / full_mark) * 100 : 0;
          
//           for (const point of gradeSetup.grade_points) {
//             if (percentage >= point.mark_point_first && percentage <= point.mark_point_second) {
//               calculatedGrade = point.grade;
//               calculatedGpa = Number(point.gpa); // Ensure gpa is a number
//               break;
//             }
//           }
//           if (!calculatedGrade) {
//             calculatedGrade = 'F';
//             calculatedGpa = 0.0;
//           }
//         }
//       }
      
//       const existingId = existingMarksMap.get(student_id);
      
//       if (existingId) {
//         // Prepare update query
//         updateQueries.push({
//           id: existingId,
//           short_code_marks: JSON.stringify(short_code_marks),
//           total_mark: finalTotalMark,
//           full_mark: full_mark,
//           grade: calculatedGrade,
//           gpa: calculatedGpa,
//           status: status
//         });
//       } else {
//         // Prepare insert query
//         insertQueries.push({
//           student_id, class_id, group_id, section_id, shift_id,
//           subject_id, exam_id, year_id, school_id,
//           total_mark: finalTotalMark, full_mark: full_mark, grade: calculatedGrade, gpa: calculatedGpa, 
//           status: status, short_code_marks: JSON.stringify(short_code_marks)
//         });
//       }
//     }
    
//     // 🚀 OPTIMIZATION 5: Batch update existing marks
//     if (updateQueries.length > 0) {
//       const updateQuery = `
//         UPDATE mark_input 
//         SET short_code_marks = data.short_code_marks::jsonb,
//             total_mark = data.total_mark::numeric,
//             full_mark = data.full_mark::numeric,
//             grade = data.grade::text,
//             gpa = data.gpa::numeric,
//             status = data.status::text,
//             updated_at = CURRENT_TIMESTAMP
//         FROM (VALUES ${updateQueries.map((_, i) => `($${i * 7 + 1}::bigint, $${i * 7 + 2}::jsonb, $${i * 7 + 3}::numeric, $${i * 7 + 4}::numeric, $${i * 7 + 5}::text, $${i * 7 + 6}::numeric, $${i * 7 + 7}::text)`).join(', ')}) AS data(id, short_code_marks, total_mark, full_mark, grade, gpa, status)
//         WHERE mark_input.id = data.id
//         RETURNING *
//       `;
      
//       const updateValues = updateQueries.flatMap(q => [q.id, q.short_code_marks, q.total_mark, q.full_mark, q.grade, Number(q.gpa), q.status]);
//       const updateResult = await client.query(updateQuery, updateValues);
//       savedMarks.push(...updateResult.rows);
//     }
    
//     // 🚀 OPTIMIZATION 6: Batch insert new marks
//     if (insertQueries.length > 0) {
//       const insertQuery = `
//         INSERT INTO mark_input (
//           student_id, class_id, group_id, section_id, shift_id, 
//           subject_id, exam_id, year_id, school_id, 
//           total_mark, full_mark, grade, gpa, status, short_code_marks
//         )
//         VALUES ${insertQueries.map((_, i) => `($${i * 15 + 1}::bigint, $${i * 15 + 2}::bigint, $${i * 15 + 3}::bigint, $${i * 15 + 4}::bigint, $${i * 15 + 5}::bigint, $${i * 15 + 6}::bigint, $${i * 15 + 7}::bigint, $${i * 15 + 8}::bigint, $${i * 15 + 9}::bigint, $${i * 15 + 10}::bigint, $${i * 15 + 11}::numeric, $${i * 15 + 12}::numeric, $${i * 15 + 13}::text, $${i * 15 + 14}::numeric, $${i * 15 + 15}::jsonb)`).join(', ')}
//         RETURNING *
//       `;
      
//       const insertValues = insertQueries.flatMap(q => [
//         q.student_id, q.class_id, q.group_id, q.section_id, q.shift_id,
//         q.subject_id, q.exam_id, q.year_id, q.school_id,
//         q.total_mark, q.full_mark, q.grade, Number(q.gpa), q.status, q.short_code_marks
//       ]);
//       const insertResult = await client.query(insertQuery, insertValues);
//       savedMarks.push(...insertResult.rows);
//     }
    
//     await client.query('COMMIT');
//     return savedMarks;
//   } catch (error) {
//     await client.query('ROLLBACK');
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// // Get all mark inputs with pagination
// const getAllMarkInputs = async (
//   filters: IMarkInputFilters,
//   paginationOptions: IPaginationOptions
// ): Promise<IGenericResponse<IMarkInput[]>> => {
//   const { searchTerm, ...filterFields } = filters;
//   const {
//     page,
//     limit,
//     skip,
//     sortBy,
//     sortOrder = 'desc',
//   } = paginationHelpers.calculatePagination({
//     ...paginationOptions,
//     sortBy: paginationOptions.sortBy || 'id',
//   });

//   const conditions: string[] = [];
//   const values: any[] = [];
//   let paramIndex = 1;

//   if (searchTerm) {
//     conditions.push(
//       `(s.student_name_en ILIKE $${paramIndex} OR s.student_id ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex} OR sub.name ILIKE $${paramIndex})`
//     );
//     values.push(`%${searchTerm}%`);
//     paramIndex++;
//   }

//   for (const [field, value] of Object.entries(filterFields)) {
//     if (value !== undefined && value !== null) {
//       conditions.push(`mi.${field} = $${paramIndex}`);
//       values.push(value);
//       paramIndex++;
//     }
//   }

//   const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

//   const query = `
//     SELECT mi.*,
//            s.student_name_en,
//            s.student_id as student_id_code,
//            s.roll,
//            c.name as class_name,
//            g.name as group_name,
//            sec.name as section_name,
//            sh.name as shift_name,
//            sub.name as subject_name,
//            ce.class_exam_name as exam_name,
//            ay.name as academic_year_name
//     FROM mark_input mi
//     LEFT JOIN students s ON mi.student_id = s.id
//     LEFT JOIN class c ON mi.class_id = c.id
//     LEFT JOIN student_group g ON mi.group_id = g.id
//     LEFT JOIN section sec ON mi.section_id = sec.id
//     LEFT JOIN shift sh ON mi.shift_id = sh.id
//     LEFT JOIN subject sub ON mi.subject_id = sub.id
//     LEFT JOIN class_exam ce ON mi.exam_id = ce.id
//     LEFT JOIN academic_year ay ON mi.year_id = ay.id
//     ${whereClause}
//     ORDER BY mi.${sortBy} ${sortOrder}
//     LIMIT $${paramIndex++} OFFSET $${paramIndex};
//   `;

//   values.push(limit, skip);

//   const result = await pool.query(query, values);

//   const countQuery = `SELECT COUNT(*) FROM mark_input mi ${whereClause};`;
//   const countResult = await pool.query(
//     countQuery,
//     values.slice(0, paramIndex - 2)
//   );
//   const total = parseInt(countResult.rows[0].count, 10);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       hasNext: page < Math.ceil(total / limit),
//       hasPrev: page > 1,
//     },
//     data: result.rows,
//   };
// };

// // Get single mark input
// const getSingleMarkInput = async (id: number): Promise<IMarkInput | null> => {
//   const query = `
//     SELECT mi.*,
//            s.student_name_en,
//            s.student_id as student_id_code,
//            s.roll,
//            c.name as class_name,
//            g.name as group_name,
//            sec.name as section_name,
//            sh.name as shift_name,
//            sub.name as subject_name,
//            ce.class_exam_name as exam_name,
//            ay.name as academic_year_name
//     FROM mark_input mi
//     LEFT JOIN students s ON mi.student_id = s.id
//     LEFT JOIN class c ON mi.class_id = c.id
//     LEFT JOIN student_group g ON mi.group_id = g.id
//     LEFT JOIN section sec ON mi.section_id = sec.id
//     LEFT JOIN shift sh ON mi.shift_id = sh.id
//     LEFT JOIN subject sub ON mi.subject_id = sub.id
//     LEFT JOIN class_exam ce ON mi.exam_id = ce.id
//     LEFT JOIN academic_year ay ON mi.year_id = ay.id
//     WHERE mi.id = $1;
//   `;
//   const result = await pool.query(query, [id]);
//   return result.rows[0] || null;
// };

// // Delete mark input
// const deleteMarkInput = async (id: number): Promise<void> => {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     const query = 'DELETE FROM mark_input WHERE id = $1 RETURNING *;';
//     const result = await client.query(query, [id]);

//     if (result.rows.length === 0) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Mark input not found');
//     }

//     await client.query('COMMIT');
//   } catch (error) {
//     await client.query('ROLLBACK');
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// // Bulk upload mark input from Excel data
// const bulkUploadMarkInput = async (data: any): Promise<IMarkInput[]> => {
//   const { class_id, subject_id, exam_id, year_id, school_id, marks_data } = data;
  
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
    
//     const savedMarks: IMarkInput[] = [];
    
//     for (const markData of marks_data) {
//       const { student_id, group_id, section_id, shift_id, full_mark, short_code_marks, status, total_mark, grade, gpa } = markData;
      
//       // Use frontend calculated values if available, otherwise calculate
//       const finalTotalMark = total_mark || Object.values(short_code_marks).reduce((sum: number, mark: any) => sum + (mark || 0), 0);
//       const finalGrade = grade || 'F';
//       const finalGpa = gpa || 0;
      
//       // Get short codes to calculate weighted total and check pass marks
//       const shortCodesQuery = `
//         SELECT sc.id, sem.acceptance, sem.pass_mark
//         FROM set_exam_marks sem
//         JOIN short_codes sc ON sem.short_code_id = sc.id
//         WHERE sem.class_id = $1 
//           AND sem.class_exam_id = $2 
//           AND sem.subject_id = $3 
//           AND sem.year_id = $4 
//           AND sem.school_id = $5
//           AND sem.status = 'active'
//       `;
      
//       const shortCodesResult = await pool.query(shortCodesQuery, [class_id, exam_id, subject_id, year_id, school_id]);
      
//       // Check if student has failed any short code
//       let hasFailedShortCode = false;
//       for (const shortCode of shortCodesResult.rows) {
//         const mark = short_code_marks[shortCode.id] || 0;
//         if (mark < shortCode.pass_mark) {
//           hasFailedShortCode = true;
//           break;
//         }
//       }
      
//       // Calculate weighted total for grade calculation
//       let weightedTotal = 0;
//       for (const shortCode of shortCodesResult.rows) {
//         const mark = short_code_marks[shortCode.id] || 0;
//         weightedTotal += mark * shortCode.acceptance;
//       }
      
//       // Use frontend calculated values if available, otherwise calculate
//       let calculatedGrade = finalGrade;
//       let calculatedGpa = finalGpa;
      
//       if (!grade || !gpa) {
//         // Calculate grade and GPA - if failed any short code, grade is F and GPA is 0
//         if (hasFailedShortCode) {
//           calculatedGrade = 'F';
//           calculatedGpa = 0;
//         } else {
//           const gradeResult = await calculateGradeAndGPA(weightedTotal, full_mark, class_id, exam_id, school_id);
//           calculatedGrade = gradeResult.grade;
//           calculatedGpa = Number(gradeResult.gpa); // Ensure gpa is a number
//         }
//       }
      
//       // Check if marks already exist
//       const existingQuery = `
//         SELECT id FROM mark_input 
//         WHERE student_id = $1 AND exam_id = $2 AND subject_id = $3 AND school_id = $4
//       `;
      
//       const existingResult = await client.query(existingQuery, [student_id, exam_id, subject_id, school_id]);
      
//       if (existingResult.rows.length > 0) {
//         // Update existing marks
//         const updateQuery = `
//           UPDATE mark_input 
//           SET short_code_marks = $1, 
//               total_mark = $2, 
//               full_mark = $3,
//               grade = $4::text, 
//               gpa = $5::numeric, 
//               status = $6::text,
//               updated_at = CURRENT_TIMESTAMP
//           WHERE id = $7
//           RETURNING *
//         `;
        
//         const updateResult = await client.query(updateQuery, [
//           JSON.stringify(short_code_marks),
//           finalTotalMark,
//           full_mark,
//           calculatedGrade,
//           Number(calculatedGpa),
//           status,
//           existingResult.rows[0].id
//         ]);
        
//         savedMarks.push(updateResult.rows[0]);
//       } else {
//         // Insert new marks
//         const insertQuery = `
//           INSERT INTO mark_input (
//             student_id, class_id, group_id, section_id, shift_id, 
//             subject_id, exam_id, year_id, school_id, 
//             total_mark, full_mark, grade, gpa, status, short_code_marks
//           )
//           VALUES (
//             $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::text, $14::numeric, $15::text, $16::jsonb
//           )
//           RETURNING *
//         `;
        
//         const insertResult = await client.query(insertQuery, [
//           student_id, class_id, group_id, section_id, shift_id,
//           subject_id, exam_id, year_id, school_id,
//           finalTotalMark, full_mark, calculatedGrade, Number(calculatedGpa), status, JSON.stringify(short_code_marks)
//         ]);
        
//         savedMarks.push(insertResult.rows[0]);
//       }
//     }
    
//     await client.query('COMMIT');
//     return savedMarks;
//   } catch (error) {
//     await client.query('ROLLBACK');
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// // Delete mark input records by subject-wise criteria
// const deleteMarkInputBySubjectWise = async (params: IMarkInputDeleteBySubjectWise): Promise<IMarkInputDeleteResult> => {
//   const { class_id, subject_id, exam_id, year_id, school_id, group_id, section_id, shift_id } = params;
  
//   const client = await pool.connect();
  
//   try {
//     // Build conditions for deletion
//     const conditions: string[] = [
//       'school_id = $1',
//       'class_id = $2',
//       'subject_id = $3',
//       'exam_id = $4',
//       'year_id = $5'
//     ];
    
//     const values: any[] = [school_id, class_id, subject_id, exam_id, year_id];
//     let paramIndex = 6;
    
//     if (group_id) {
//       conditions.push(`group_id = $${paramIndex++}`);
//       values.push(group_id);
//     }
    
//     if (section_id) {
//       conditions.push(`section_id = $${paramIndex++}`);
//       values.push(section_id);
//     }
    
//     if (shift_id) {
//       conditions.push(`shift_id = $${paramIndex++}`);
//       values.push(shift_id);
//     }
    
//     const whereClause = conditions.join(' AND ');
    
//     // First, get count of records to be deleted
//     const countQuery = `SELECT COUNT(*) as count FROM mark_input WHERE ${whereClause}`;
//     const countResult = await client.query(countQuery, values);
//     const recordCount = parseInt(countResult.rows[0].count);
    
//     if (recordCount === 0) {
//       return {
//         deleted_count: 0,
//         message: 'No records found matching the criteria'
//       };
//     }
    
//     // Delete the records
//     const deleteQuery = `DELETE FROM mark_input WHERE ${whereClause}`;
//     await client.query(deleteQuery, values);
    
//     return {
//       deleted_count: recordCount,
//       message: `Successfully deleted ${recordCount} mark input record(s)`
//     };
    
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// export const MarkInputService = {
//   searchStudentsForMarkInput,
//   saveMarkInput,
//   getAllMarkInputs,
//   getSingleMarkInput,
//   deleteMarkInput,
//   getOrCreateDefaultGradeSetup,
//   calculateGradeAndGPA,
//   bulkUploadMarkInput,
//   deleteMarkInputBySubjectWise,
// };







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

// --- helpers to enforce numeric types safely ---
const asNumber = (v: any, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const sumMarks = (obj: Record<string | number, any>): number =>
  Object.values(obj || {}).reduce((sum, m) => sum + asNumber(m, 0), 0);

// Search students for mark input based on filters
const searchStudentsForMarkInput = async (params: IMarkInputSearchParams): Promise<IMarkInputStudentData[]> => {
  const { class_id, subject_id, exam_id, year_id, group_id, section_id, shift_id, category_id, school_id } = params;

  // Build conditions for student search
  const conditions: string[] = [
    's.school_id = $1',
    's.class_id = $2',
    's.academic_year_id = $3',
    "s.status = 'active'",
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

  // Get current grade setup for recalculation
  const gradeSetup = await getOrCreateDefaultGradeSetup(class_id, exam_id, school_id);

  return studentsResult.rows.map((row: any) => {
    let existingMarks = undefined;
    
    if (row.existing_mark_id) {
      // Recalculate grade and GPA with current grade setup
      const shortCodeMarks = row.short_code_marks || {};
      
      // Calculate weighted total for grade calculation
      let weightedTotal = 0;
      let hasFailedShortCode = false;
      
      // Calculate percentage-based pass marks for each short code
      const calculatePercentageBasedPassMark = (totalMarks: number): number => {
        const rawPass = totalMarks * 0.33;
        const fractional = rawPass - Math.floor(rawPass);
        
        // If fractional part is >= 0.5, round up (ceil), otherwise round down (floor)
        if (fractional >= 0.5) {
          return Math.ceil(rawPass);
        } else {
          return Math.floor(rawPass);
        }
      };

      for (const shortCode of shortCodesResult.rows) {
        const mark = asNumber(shortCodeMarks[shortCode.short_code_id] ?? 0);
        const passMark = calculatePercentageBasedPassMark(shortCode.total_marks);
        
        // Check if failed any short code
        if (mark < passMark) {
          hasFailedShortCode = true;
        }
        
        weightedTotal += mark * shortCode.acceptance;
      }

      // Calculate new grade and GPA
      let newGrade = 'F';
      let newGpa = 0.0;
      
      if (!hasFailedShortCode) {
        const fullMarks = shortCodesResult.rows.reduce((sum, sc) => sum + sc.total_marks, 0);
        const percentage = fullMarks > 0 ? (weightedTotal / fullMarks) * 100 : 0;
        
        for (const point of gradeSetup.grade_points) {
          if (percentage >= point.mark_point_first && percentage <= point.mark_point_second) {
            newGrade = point.grade;
            newGpa = point.gpa;
            break;
          }
        }
      }

      existingMarks = {
        id: row.existing_mark_id,
        student_id: row.student_id,
        class_id,
        subject_id,
        exam_id,
        year_id,
        school_id,
        short_code_marks: shortCodeMarks,
        status: row.existing_status || 'present',
        total_mark: asNumber(row.total_mark),
        grade: newGrade,
        gpa: newGpa
      };
    }

    return {
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
      existing_marks: existingMarks
    };
  });
};

// Get or create default grade setup - PERCENTAGE BASED
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
        mark_point_first: asNumber(row.mark_point_first),
        mark_point_second: asNumber(row.mark_point_second),
        grade: row.letter_grade,
        gpa: asNumber(row.grade_point)
      }))
    };
  }

  // Return default percentage-based grade setup (no database creation)
  return {
    id: 0, // No database ID for default setup
    class_id,
    exam_id,
    school_id,
    grade_points: [
      { mark_point_first: 80, mark_point_second: 100, grade: 'A+', gpa: 5.0 },
      { mark_point_first: 70, mark_point_second: 79, grade: 'A', gpa: 4.0 },
      { mark_point_first: 60, mark_point_second: 69, grade: 'A-', gpa: 3.5 },
      { mark_point_first: 50, mark_point_second: 59, grade: 'B', gpa: 3.0 },
      { mark_point_first: 40, mark_point_second: 49, grade: 'C', gpa: 2.0 },
      { mark_point_first: 33, mark_point_second: 39, grade: 'D', gpa: 1.0 },
      { mark_point_first: 0, mark_point_second: 32, grade: 'F', gpa: 0.0 }
    ]
  };
};

// Calculate grade and GPA based on marks - PERCENTAGE BASED
const calculateGradeAndGPA = async (
  totalMark: number,
  fullMark: number,
  class_id: number,
  exam_id: number,
  school_id: number
): Promise<{ grade: string; gpa: number }> => {
  const gradeSetup = await getOrCreateDefaultGradeSetup(class_id, exam_id, school_id);

  // Calculate percentage
  const t = asNumber(totalMark);
  const f = asNumber(fullMark);
  const percentage = f > 0 ? (t / f) * 100 : 0;

  for (const point of gradeSetup.grade_points) {
    if (percentage >= point.mark_point_first && percentage <= point.mark_point_second) {
      return { grade: point.grade, gpa: asNumber(point.gpa) };
    }
  }

  // Default to F if no match found
  return { grade: 'F', gpa: 0.0 };
};

// Save mark input data - OPTIMIZED VERSION
const saveMarkInput = async (data: IMarkInputBulkSave): Promise<IMarkInput[]> => {
  const { class_id, subject_id, exam_id, year_id, school_id, marks_data } = data;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 🚀 OPTIMIZATION 1: Get short codes once for all students
    const shortCodesQuery = `
      SELECT sc.id, sem.acceptance, sem.pass_mark, sem.total_marks
      FROM set_exam_marks sem
      JOIN short_codes sc ON sem.short_code_id = sc.id
      WHERE sem.class_id = $1
        AND sem.class_exam_id = $2
        AND sem.subject_id = $3
        AND sem.year_id = $4
        AND sem.school_id = $5
        AND sem.status = 'active'
    `;

    const shortCodesResult = await client.query(shortCodesQuery, [class_id, exam_id, subject_id, year_id, school_id]);
    const shortCodesMap = new Map(shortCodesResult.rows.map(row => [row.id, {
      id: row.id,
      acceptance: asNumber(row.acceptance),
      pass_mark: asNumber(row.pass_mark),
      total_marks: asNumber(row.total_marks)
    }]));

    // 🚀 OPTIMIZATION 2: Get grade setup once
    const gradeSetup = await getOrCreateDefaultGradeSetup(class_id, exam_id, school_id);

    // 🚀 OPTIMIZATION 3: Get all existing marks in one query
    const studentIds = marks_data.map(m => m.student_id);
    const existingMarksQuery = `
      SELECT id, student_id FROM mark_input
      WHERE student_id = ANY($1::bigint[]) AND exam_id = $2 AND subject_id = $3 AND school_id = $4
    `;
    const existingMarksResult = await client.query(existingMarksQuery, [studentIds, exam_id, subject_id, school_id]);
    const existingMarksMap = new Map(existingMarksResult.rows.map(row => [row.student_id, row.id]));

    const savedMarks: IMarkInput[] = [];
    const updateQueries: any[] = [];
    const insertQueries: any[] = [];

    // 🚀 OPTIMIZATION 4: Process all students in memory first
    for (const markData of marks_data) {
      const { student_id, group_id, section_id, shift_id, full_mark, short_code_marks, status, total_mark, grade, gpa } = markData;

      // Ensure numerics
      const fm = asNumber(full_mark);
      const finalTotalMark = asNumber(total_mark, sumMarks(short_code_marks));
      const initialGrade = grade || 'F';
      const initialGpa = asNumber(gpa, 0);

      // If frontend didn't provide calculated values, calculate them
      let calculatedGrade = initialGrade;
      let calculatedGpa = initialGpa;

      // Fix: Only check for undefined/null, not string, for gpa (which is a number)
      if (!grade || gpa === undefined || gpa === null) {
        // Calculate percentage-based pass marks for each short code
        const calculatePercentageBasedPassMark = (totalMarks: number): number => {
          const rawPass = totalMarks * 0.33;
          const fractional = rawPass - Math.floor(rawPass);
          
          // If fractional part is >= 0.5, round up (ceil), otherwise round down (floor)
          if (fractional >= 0.5) {
            return Math.ceil(rawPass);
          } else {
            return Math.floor(rawPass);
          }
        };

        // Check fail by short code using percentage-based pass marks
        let hasFailedShortCode = false;
        let weightedTotal = 0;

        for (const [shortCodeId, sc] of shortCodesMap) {
          const mark = asNumber(short_code_marks?.[shortCodeId] ?? 0);
          const passMark = calculatePercentageBasedPassMark(sc.total_marks);
          if (mark < passMark) hasFailedShortCode = true;
          weightedTotal += mark * sc.acceptance;
        }

        if (hasFailedShortCode) {
          calculatedGrade = 'F';
          calculatedGpa = 0;
        } else {
          // percentage-based from gradeSetup
          const percentage = fm > 0 ? (weightedTotal / fm) * 100 : 0;
          let found = false;
          for (const point of gradeSetup.grade_points) {
            if (percentage >= point.mark_point_first && percentage <= point.mark_point_second) {
              calculatedGrade = point.grade;
              calculatedGpa = asNumber(point.gpa);
              found = true;
              break;
            }
          }
          if (!found) {
            calculatedGrade = 'F';
            calculatedGpa = 0.0;
          }
        }
      }

      const existingId = existingMarksMap.get(student_id);

      if (existingId) {
        // Prepare update
        updateQueries.push({
          id: existingId,
          short_code_marks: JSON.stringify(short_code_marks || {}),
          total_mark: asNumber(finalTotalMark),
          full_mark: fm,
          grade: calculatedGrade,
          gpa: asNumber(calculatedGpa),
          status: status
        });
      } else {
        // Prepare insert
        insertQueries.push({
          student_id, class_id, group_id, section_id, shift_id,
          subject_id, exam_id, year_id, school_id,
          total_mark: asNumber(finalTotalMark),
          full_mark: fm,
          grade: calculatedGrade,
          gpa: asNumber(calculatedGpa),
          status: status,
          short_code_marks: JSON.stringify(short_code_marks || {})
        });
      }
    }

    // 🚀 OPTIMIZATION 5: Batch update existing marks
    if (updateQueries.length > 0) {
      const updateQuery = `
        UPDATE mark_input
        SET short_code_marks = data.short_code_marks::jsonb,
            total_mark = data.total_mark::numeric,
            full_mark = data.full_mark::numeric,
            grade = data.grade::text,
            gpa = data.gpa::numeric,
            status = data.status::text,
            updated_at = CURRENT_TIMESTAMP
        FROM (VALUES ${updateQueries.map((_, i) =>
          `($${i * 7 + 1}::bigint, $${i * 7 + 2}::jsonb, $${i * 7 + 3}::numeric, $${i * 7 + 4}::numeric, $${i * 7 + 5}::text, $${i * 7 + 6}::numeric, $${i * 7 + 7}::text)`
        ).join(', ')}) AS data(id, short_code_marks, total_mark, full_mark, grade, gpa, status)
        WHERE mark_input.id = data.id
        RETURNING *
      `;

      const updateValues = updateQueries.flatMap(q => [q.id, q.short_code_marks, asNumber(q.total_mark), asNumber(q.full_mark), q.grade, asNumber(q.gpa), q.status]);
      const updateResult = await client.query(updateQuery, updateValues);
      savedMarks.push(...updateResult.rows);
    }

    // 🚀 OPTIMIZATION 6: Batch insert new marks
    if (insertQueries.length > 0) {
      // 15 columns; 15 placeholders per row
      // positions: 1..15 each row
      const insertQuery = `
        INSERT INTO mark_input (
          student_id, class_id, group_id, section_id, shift_id,
          subject_id, exam_id, year_id, school_id,
          total_mark, full_mark, grade, gpa, status, short_code_marks
        )
        VALUES ${insertQueries.map((_, i) => {
          const base = i * 15;
          return `(
            $${base + 1}::bigint,  $${base + 2}::bigint,  $${base + 3}::bigint,  $${base + 4}::bigint,  $${base + 5}::bigint,
            $${base + 6}::bigint,  $${base + 7}::bigint,  $${base + 8}::bigint,  $${base + 9}::bigint,
            $${base + 10}::numeric, $${base + 11}::numeric, $${base + 12}::text, $${base + 13}::numeric, $${base + 14}::text, $${base + 15}::jsonb
          )`;
        }).join(', ')}
        RETURNING *
      `;

      const insertValues = insertQueries.flatMap(q => [
        q.student_id, q.class_id, q.group_id, q.section_id, q.shift_id,
        q.subject_id, q.exam_id, q.year_id, q.school_id,
        asNumber(q.total_mark), asNumber(q.full_mark), q.grade, asNumber(q.gpa), q.status, q.short_code_marks
      ]);
      const insertResult = await client.query(insertQuery, insertValues);
      savedMarks.push(...insertResult.rows);
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
      // numeric fields: cast parameter to numeric
      if (['gpa', 'total_mark', 'full_mark'].includes(field)) {
        conditions.push(`mi.${field} = $${paramIndex}::numeric`);
      } else {
        conditions.push(`mi.${field} = $${paramIndex}`);
      }
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
      const { student_id, group_id, section_id, shift_id, full_mark, short_code_marks, status, total_mark, grade, gpa } = markData;

      const fm = asNumber(full_mark);
      const finalTotalMark = asNumber(total_mark, sumMarks(short_code_marks));
      const initialGrade = grade || 'F';
      const initialGpa = asNumber(gpa, 0);

      // Get short codes to calculate weighted total and check pass marks
      const shortCodesQuery = `
        SELECT sc.id, sem.acceptance, sem.pass_mark, sem.total_marks
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

      // Calculate percentage-based pass marks for each short code
      const calculatePercentageBasedPassMark = (totalMarks: number): number => {
        const rawPass = totalMarks * 0.33;
        const fractional = rawPass - Math.floor(rawPass);
        
        // If fractional part is >= 0.5, round up (ceil), otherwise round down (floor)
        if (fractional >= 0.5) {
          return Math.ceil(rawPass);
        } else {
          return Math.floor(rawPass);
        }
      };

      // Check if student has failed any short code using percentage-based pass marks
      let hasFailedShortCode = false;
      for (const shortCode of shortCodesResult.rows) {
        const mark = asNumber(short_code_marks?.[shortCode.id] ?? 0);
        const passMark = calculatePercentageBasedPassMark(asNumber(shortCode.total_marks));
        if (mark < passMark) {
          hasFailedShortCode = true;
          break;
        }
      }

      // Calculate weighted total for grade calculation
      let weightedTotal = 0;
      for (const shortCode of shortCodesResult.rows) {
        const mark = asNumber(short_code_marks?.[shortCode.id] ?? 0);
        weightedTotal += mark * asNumber(shortCode.acceptance);
      }

      // Use frontend calculated values if available, otherwise calculate
      let calculatedGrade = initialGrade;
      let calculatedGpa = initialGpa;

      if (!grade || gpa === undefined || gpa === null || gpa === '') {
        if (hasFailedShortCode) {
          calculatedGrade = 'F';
          calculatedGpa = 0;
        } else {
          const gradeResult = await calculateGradeAndGPA(weightedTotal, fm, class_id, exam_id, school_id);
          calculatedGrade = gradeResult.grade;
          calculatedGpa = asNumber(gradeResult.gpa);
        }
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
          SET short_code_marks = $1::jsonb,
              total_mark = $2::numeric,
              full_mark = $3::numeric,
              grade = $4::text,
              gpa = $5::numeric,
              status = $6::text,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $7
          RETURNING *
        `;

        const updateResult = await client.query(updateQuery, [
          JSON.stringify(short_code_marks || {}),
          asNumber(finalTotalMark),
          fm,
          calculatedGrade,
          asNumber(calculatedGpa),
          status,
          existingResult.rows[0].id
        ]);

        savedMarks.push(updateResult.rows[0]);
      } else {
        // Insert new marks (15 columns, 15 params)
        const insertQuery = `
          INSERT INTO mark_input (
            student_id, class_id, group_id, section_id, shift_id,
            subject_id, exam_id, year_id, school_id,
            total_mark, full_mark, grade, gpa, status, short_code_marks
          )
          VALUES (
            $1::bigint, $2::bigint, $3::bigint, $4::bigint, $5::bigint,
            $6::bigint, $7::bigint, $8::bigint, $9::bigint,
            $10::numeric, $11::numeric, $12::text, $13::numeric, $14::text, $15::jsonb
          )
          RETURNING *
        `;

        const insertResult = await client.query(insertQuery, [
          student_id, class_id, group_id, section_id, shift_id,
          subject_id, exam_id, year_id, school_id,
          asNumber(finalTotalMark), fm, calculatedGrade, asNumber(calculatedGpa), status, JSON.stringify(short_code_marks || {})
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
