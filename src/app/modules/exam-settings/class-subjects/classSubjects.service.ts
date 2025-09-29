import pool from '../../../../utils/dbClient';
import { IAssignmentInput, IClassSubject, IClassWiseSubject } from './classSubjects.interface';

const ensureClassWiseSubject = async (
  school_id: number,
  class_id: number,
  group_id: number
): Promise<IClassWiseSubject> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const selectQuery = `
      SELECT * FROM class_wise_subject
      WHERE school_id = $1 AND class_id = $2 AND group_id = $3
      LIMIT 1;
    `;
    const found = await client.query(selectQuery, [school_id, class_id, group_id]);
    if (found.rows.length > 0) {
      await client.query('COMMIT');
      return found.rows[0];
    }

    const insertQuery = `
      INSERT INTO class_wise_subject (school_id, class_id, group_id, status)
      VALUES ($1, $2, $3, 'active')
      RETURNING *;
    `;
    const inserted = await client.query(insertQuery, [school_id, class_id, group_id]);
    await client.query('COMMIT');
    return inserted.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const assignSubjects = async (payload: IAssignmentInput): Promise<IClassSubject[]> => {
  const { school_id, class_id, group_id, assignments } = payload;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cws = await ensureClassWiseSubject(school_id, class_id, group_id);

    const deleteQuery = `
      DELETE FROM class_subjects WHERE class_wise_subject_id = $1;
    `;
    await client.query(deleteQuery, [cws.id]);

    const insertValues: any[] = [];
    const valuesSql: string[] = [];
    let param = 1;
    for (const item of assignments) {
      valuesSql.push(`($${param++}, $${param++}, $${param++}, $${param++}, $${param++})`);
      insertValues.push(
        cws.id,
        item.subject_id,
        item.serial_no,
        item.type ?? null,
        item.merge_no ?? 0
      );
    }

    const insertQuery = `
      INSERT INTO class_subjects (class_wise_subject_id, subject_id, serial_no, type, merge_no)
      VALUES ${valuesSql.join(', ')}
      RETURNING *;
    `;
    const result = await client.query(insertQuery, insertValues);
    await client.query('COMMIT');
    return result.rows;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const getAssignments = async (school_id: number, class_id: number, group_id: number) => {
  const query = `
    SELECT cs.*, s.name AS subject_name, s.code AS subject_code
    FROM class_wise_subject cws
    JOIN class_subjects cs ON cs.class_wise_subject_id = cws.id
    JOIN subject s ON s.id = cs.subject_id
    WHERE cws.school_id = $1 AND cws.class_id = $2 AND cws.group_id = $3
    ORDER BY cs.serial_no ASC;
  `;
  const result = await pool.query(query, [school_id, class_id, group_id]);
  return result.rows;
};

export const ClassSubjectsService = {
  assignSubjects,
  getAssignments,
};


