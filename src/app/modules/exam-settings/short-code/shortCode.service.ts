import pool from '../../../../utils/dbClient';
import { IShortCode } from './shortCode.interface';

const create = async (data: IShortCode): Promise<IShortCode> => {
  const query = `
    INSERT INTO short_codes (name, mark_position, view_position, status, school_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [data.name, data.mark_position, data.view_position ?? null, data.status, data.school_id];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const getAll = async (schoolId: number, status?: 'active'|'inactive'): Promise<IShortCode[]> => {
  const conditions: string[] = ['school_id = $1'];
  const values: any[] = [schoolId];
  if (status) {
    conditions.push('status = $2');
    values.push(status);
  }
  const where = `WHERE ${conditions.join(' AND ')}`;
  const res = await pool.query(`SELECT * FROM short_codes ${where} ORDER BY mark_position ASC;`, values);
  return res.rows;
};

const update = async (id: number, data: Partial<IShortCode>): Promise<IShortCode | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) { fields.push(`${k} = $${idx++}`); values.push(v); }
  }
  if (fields.length === 0) return null;
  const res = await pool.query(`UPDATE short_codes SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *;`, [...values, id]);
  return res.rows[0] || null;
};

const remove = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM short_codes WHERE id = $1;', [id]);
};

export const ShortCodeService = { create, getAll, update, remove };


