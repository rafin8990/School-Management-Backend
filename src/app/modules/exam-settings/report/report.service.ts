import pool from '../../../../utils/dbClient';
import { IReport } from './report.interface';

const create = async (data: IReport): Promise<IReport> => {
  const query = `
    INSERT INTO report (name, status, position, school_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [data.name, data.status, data.position ?? null, data.school_id];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const getAll = async (schoolId: number, status?: 'active'|'inactive'): Promise<IReport[]> => {
  const conditions: string[] = ['school_id = $1'];
  const values: any[] = [schoolId];
  if (status) {
    conditions.push('status = $2');
    values.push(status);
  }
  const where = `WHERE ${conditions.join(' AND ')}`;
  const res = await pool.query(`SELECT * FROM report ${where} ORDER BY position ASC, name ASC;`, values);
  return res.rows;
};

const getById = async (id: number, schoolId: number): Promise<IReport | null> => {
  const res = await pool.query('SELECT * FROM report WHERE id = $1 AND school_id = $2;', [id, schoolId]);
  return res.rows[0] || null;
};

const update = async (id: number, data: Partial<IReport>): Promise<IReport | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) { 
      fields.push(`${k} = $${idx++}`); 
      values.push(v); 
    }
  }
  if (fields.length === 0) return null;
  const res = await pool.query(`UPDATE report SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *;`, [...values, id]);
  return res.rows[0] || null;
};

const remove = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM report WHERE id = $1;', [id]);
};

export const ReportService = { create, getAll, getById, update, remove };
