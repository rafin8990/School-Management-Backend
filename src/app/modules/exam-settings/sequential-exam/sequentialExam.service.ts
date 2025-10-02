import pool from '../../../../utils/dbClient';
import { ISequentialExam } from './sequentialExam.interface';

const listByClassAndExam = async (schoolId: number, classId: number, examId: number) => {
  const res = await pool.query(
    `SELECT * FROM sequential_exam WHERE school_id = $1 AND class_id = $2 AND exam_id = $3`,
    [schoolId, classId, examId]
  );
  return res.rows as ISequentialExam[];
};

const upsert = async (data: ISequentialExam): Promise<ISequentialExam> => {
  const res = await pool.query(
    `INSERT INTO sequential_exam (class_id, exam_id, sequence, school_id)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (class_id, exam_id, school_id)
     DO UPDATE SET sequence = EXCLUDED.sequence, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [data.class_id, data.exam_id, data.sequence, data.school_id]
  );
  return res.rows[0];
};

export const SequentialExamService = { listByClassAndExam, upsert };


