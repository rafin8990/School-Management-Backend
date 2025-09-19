import pool from '../../../../utils/dbClient';
import { IClassShiftAssign } from './classShift.interface';

const getByClass = async (schoolId: number, classId: number): Promise<IClassShiftAssign | null> => {
  const result = await pool.query(
    `SELECT * FROM class_shift_assign WHERE school_id = $1 AND class_id = $2 LIMIT 1`,
    [schoolId, classId]
  );

  return result.rows[0] || null;
};

const upsert = async (data: IClassShiftAssign): Promise<IClassShiftAssign> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO class_shift_assign (school_id, class_id, shift_ids)
       VALUES ($1, $2, $3)
       ON CONFLICT (school_id, class_id)
       DO UPDATE SET shift_ids = EXCLUDED.shift_ids, updated_at = CURRENT_TIMESTAMP
       RETURNING *;`,
      [data.school_id, data.class_id, data.shift_ids ?? null]
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

export const ClassShiftService = {
  getByClass,
  upsert,
};
