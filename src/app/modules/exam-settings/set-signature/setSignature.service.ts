import pool from '../../../../utils/dbClient';
import { ISetSignature } from './setSignature.interface';

const listByReport = async (schoolId: number, reportId: number) => {
  const res = await pool.query(
    `SELECT * FROM set_signature WHERE school_id = $1 AND report_id = $2 ORDER BY id ASC`,
    [schoolId, reportId]
  );
  return res.rows as ISetSignature[];
};

const upsertMany = async (schoolId: number, reportId: number, rows: Omit<ISetSignature, 'id'|'school_id'|'report_id'>[]) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete existing for this report to simplify bulk upsert
    await client.query(`DELETE FROM set_signature WHERE school_id = $1 AND report_id = $2`, [schoolId, reportId]);
    if (rows.length > 0) {
      const values: any[] = [];
      const chunks: string[] = [];
      let i = 1;
      for (const r of rows) {
        chunks.push(`($${i++},$${i++},$${i++},$${i++},$${i++})`);
        values.push(reportId, r.signature_id, r.position ?? null, r.status, schoolId);
      }
      await client.query(
        `INSERT INTO set_signature (report_id, signature_id, position, status, school_id) VALUES ${chunks.join(', ')}`,
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

export const SetSignatureService = { listByReport, upsertMany };


