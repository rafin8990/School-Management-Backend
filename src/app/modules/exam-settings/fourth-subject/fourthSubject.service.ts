import pool from '../../../../utils/dbClient';

const listChoosableSubjectsByClass = async (schoolId: number, classId: number) => {
  const res = await pool.query(
    `SELECT DISTINCT s.id, s.name
     FROM class_wise_subject cws
     JOIN class_subjects cs ON cs.class_wise_subject_id = cws.id
     JOIN subject s ON s.id = cs.subject_id
     WHERE cws.school_id = $1 AND cws.class_id = $2 AND cs.type = 'choosable'
     ORDER BY s.name`,
    [schoolId, classId]
  );
  return res.rows;
};

const listStudents = async (schoolId: number, classId: number, groupId: number | null, sectionId: number | null, yearId: number) => {
  // Simplified: assumes students table has class_id/group_id/section_id/year_id columns
  const conditions = ['school_id = $1', 'class_id = $2', 'academic_year_id = $3'];
  const values: any[] = [schoolId, classId, yearId];
  let idx = 4;
  if (groupId) { conditions.push(`group_id = $${idx++}`); values.push(groupId); }
  if (sectionId) { conditions.push(`section_id = $${idx++}`); values.push(sectionId); }
  const res = await pool.query(
    `SELECT id, student_name_en AS name, roll FROM students WHERE ${conditions.join(' AND ')} ORDER BY roll ASC`,
    values
  );
  return res.rows;
};

const ensureFourthSubject = async (schoolId: number, subjectId: number) => {
  const found = await pool.query(`SELECT * FROM fourth_subjects WHERE school_id = $1 AND subject_id = $2`, [schoolId, subjectId]);
  if (found.rows.length) return found.rows[0];
  const ins = await pool.query(`INSERT INTO fourth_subjects (school_id, subject_id) VALUES ($1, $2) RETURNING *`, [schoolId, subjectId]);
  return ins.rows[0];
};

const assignFourthSubject = async (schoolId: number, subjectId: number, studentIds: number[]) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const fs = await ensureFourthSubject(schoolId, subjectId);
    if (studentIds.length) {
      const chunks: string[] = [];
      const values: any[] = [];
      let i = 1;
      for (const sid of studentIds) {
        chunks.push(`($${i++}, $${i++})`);
        values.push(fs.id, sid);
      }
      await client.query(
        `INSERT INTO fourth_subject_students (fourth_subject_id, student_id) VALUES ${chunks.join(', ')}
         ON CONFLICT (fourth_subject_id, student_id) DO NOTHING`,
        values
      );
    }
    await client.query('COMMIT');
    return { success: true };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const FourthSubjectService = { listChoosableSubjectsByClass, listStudents, assignFourthSubject };

// New: list assigned fourth subjects for students with filters
export const listAssignments = async (
  schoolId: number,
  classId: number,
  groupId: number | null,
  sectionId: number | null,
  yearId: number
) => {
  const conditions = ['st.school_id = $1', 'st.class_id = $2', 'st.academic_year_id = $3'];
  const values: any[] = [schoolId, classId, yearId];
  let idx = 4;
  if (groupId) { conditions.push(`st.group_id = $${idx++}`); values.push(groupId); }
  if (sectionId) { conditions.push(`st.section_id = $${idx++}`); values.push(sectionId); }
  const query = `
    SELECT st.id AS student_id,
           st.student_id AS student_code,
           st.student_name_en AS student_name,
           st.roll,
           fs.subject_id,
           s.name AS subject_name,
           'active' AS status
    FROM students st
    LEFT JOIN fourth_subject_students fss ON fss.student_id = st.id
    LEFT JOIN fourth_subjects fs ON fs.id = fss.fourth_subject_id
    LEFT JOIN subject s ON s.id = fs.subject_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY st.roll ASC
  `;
  const res = await pool.query(query, values);
  return res.rows;
};


