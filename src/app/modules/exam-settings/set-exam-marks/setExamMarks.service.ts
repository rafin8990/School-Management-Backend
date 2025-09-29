import pool from '../../../../utils/dbClient';
import { ISetExamMarkUpsertInput } from './setExamMarks.interface';

const listSubjectsAndExisting = async (
  schoolId: number,
  classId: number,
  yearId: number,
  classExamIds: number[]
) => {
  const subjectsRes = await pool.query(
    `SELECT DISTINCT s.id, s.name, s.serial_number
     FROM class_wise_subject cws
     JOIN class_subjects cs ON cs.class_wise_subject_id = cws.id
     JOIN subject s ON s.id = cs.subject_id
     WHERE cws.school_id = $1 AND cws.class_id = $2
     ORDER BY s.serial_number NULLS LAST, s.name`,
    [schoolId, classId]
  );
  const existingRes = await pool.query(
    `SELECT * FROM set_exam_marks WHERE school_id = $1 AND class_id = $2 AND year_id = $3 AND class_exam_id = ANY($4::int[])`,
    [schoolId, classId, yearId, classExamIds]
  );
  return { subjects: subjectsRes.rows, existing: existingRes.rows };
};

const upsert = async (payload: ISetExamMarkUpsertInput) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { school_id, class_id, year_id, class_exam_ids, entries } = payload;
    // Delete existing rows for the selection to avoid duplicates then insert new
    await client.query(
      `DELETE FROM set_exam_marks WHERE school_id = $1 AND class_id = $2 AND year_id = $3 AND class_exam_id = ANY($4::int[])`,
      [school_id, class_id, year_id, class_exam_ids]
    );
    if (entries.length > 0) {
      const values: any[] = [];
      const chunks: string[] = [];
      let i = 1;
      for (const examId of class_exam_ids) {
        for (const e of entries) {
          chunks.push(`($${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++})`);
          values.push(class_id, examId, year_id, e.subject_id, e.short_code_id, e.total_marks, e.countable_marks, e.pass_mark, e.acceptance, 'active', school_id);
        }
      }
      await client.query(
        `INSERT INTO set_exam_marks (class_id, class_exam_id, year_id, subject_id, short_code_id, total_marks, countable_marks, pass_mark, acceptance, status, school_id)
         VALUES ${chunks.join(', ')}`,
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

export const SetExamMarksService = { listSubjectsAndExisting, upsert };


