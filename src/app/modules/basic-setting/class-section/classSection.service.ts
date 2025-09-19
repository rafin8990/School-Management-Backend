import pool from '../../../../utils/dbClient';
import { IClassSectionAssign } from './classSection.interface';

const getByClass = async (schoolId: number, classId: number): Promise<IClassSectionAssign | null> => {
  const result = await pool.query(
    `SELECT * FROM class_section_assign WHERE school_id = $1 AND class_id = $2 LIMIT 1`,
    [schoolId, classId]
  );

  return result.rows[0] || null;
};

const upsert = async (data: IClassSectionAssign): Promise<IClassSectionAssign> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO class_section_assign (school_id, class_id, section_ids)
       VALUES ($1, $2, $3)
       ON CONFLICT (school_id, class_id)
       DO UPDATE SET section_ids = EXCLUDED.section_ids, updated_at = CURRENT_TIMESTAMP
       RETURNING *;`,
      [data.school_id, data.class_id, data.section_ids ?? null]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const ClassSectionService = {
  getByClass,
  upsert,
};
