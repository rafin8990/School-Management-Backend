
import pool from '../../../../utils/dbClient';
import { IClassGroupAssign } from './classGroup.interface';

const getByClass = async (schoolId: number, classId: number): Promise<IClassGroupAssign | null> => {
  const query = `SELECT * FROM class_group_assign WHERE school_id = $1 AND class_id = $2 LIMIT 1`;
  const result = await pool.query(query, [schoolId, classId]);
  return result.rows[0] || null;
};

const upsert = async (data: IClassGroupAssign): Promise<IClassGroupAssign> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO class_group_assign (school_id, class_id, group_ids)
       VALUES ($1, $2, $3)
       ON CONFLICT (school_id, class_id)
       DO UPDATE SET group_ids = EXCLUDED.group_ids, updated_at = CURRENT_TIMESTAMP
       RETURNING *;`,
      [data.school_id, data.class_id, data.group_ids ?? null]
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

export const ClassGroupService = {
  getByClass,
  upsert,
};


