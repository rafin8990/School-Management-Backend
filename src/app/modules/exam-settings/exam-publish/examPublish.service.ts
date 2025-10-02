import pool from '../../../../utils/dbClient';
import { IExamPublish } from './examPublish.interface';

const upsert = async (data: IExamPublish): Promise<IExamPublish> => {
  const res = await pool.query(
    `INSERT INTO exam_publish (exam_id, year_id, publish_status, school_id)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (exam_id, year_id, school_id)
     DO UPDATE SET publish_status = EXCLUDED.publish_status, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [data.exam_id, data.year_id, data.publish_status, data.school_id]
  );
  return res.rows[0];
};

const get = async (schoolId: number, examId: number, yearId: number): Promise<IExamPublish | null> => {
  const res = await pool.query(
    `SELECT * FROM exam_publish WHERE school_id = $1 AND exam_id = $2 AND year_id = $3`,
    [schoolId, examId, yearId]
  );
  return res.rows[0] || null;
};

export const ExamPublishService = { upsert, get };


