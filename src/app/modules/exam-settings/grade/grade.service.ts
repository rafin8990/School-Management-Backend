import pool from '../../../../utils/dbClient';
import { IGrade } from './grade.interface';

const create = async (data: IGrade): Promise<IGrade> => {
  const query = `
    INSERT INTO grade (mark_point_first, mark_point_second, grade_point, letter_grade, note, school_id, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  const values = [
    data.mark_point_first,
    data.mark_point_second,
    data.grade_point ?? null,
    data.letter_grade ?? null,
    data.note ?? null,
    data.school_id,
    data.status,
  ];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const getAll = async (schoolId: number, status?: 'active'|'inactive'): Promise<IGrade[]> => {
  const conditions: string[] = ['school_id = $1'];
  const values: any[] = [schoolId];
  if (status) {
    conditions.push('status = $2');
    values.push(status);
  }
  const where = `WHERE ${conditions.join(' AND ')}`;
  const res = await pool.query(`SELECT * FROM grade ${where} ORDER BY mark_point_first DESC, mark_point_second DESC;`, values);
  return res.rows;
};

const getById = async (id: number, schoolId: number): Promise<IGrade | null> => {
  const res = await pool.query('SELECT * FROM grade WHERE id = $1 AND school_id = $2;', [id, schoolId]);
  return res.rows[0] || null;
};

const update = async (id: number, data: Partial<IGrade>): Promise<IGrade | null> => {
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
  const res = await pool.query(`UPDATE grade SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *;`, [...values, id]);
  return res.rows[0] || null;
};

const remove = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM grade WHERE id = $1;', [id]);
};

const bulkCreate = async (grades: IGrade[]): Promise<IGrade[]> => {
  if (grades.length === 0) return [];
  
  const values: any[] = [];
  const placeholders: string[] = [];
  let paramIndex = 1;
  
  grades.forEach((grade) => {
    placeholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5}, $${paramIndex + 6})`);
    values.push(
      grade.mark_point_first,
      grade.mark_point_second,
      grade.grade_point ?? null,
      grade.letter_grade ?? null,
      grade.note ?? null,
      grade.school_id,
      grade.status
    );
    paramIndex += 7;
  });
  
  const query = `
    INSERT INTO grade (mark_point_first, mark_point_second, grade_point, letter_grade, note, school_id, status)
    VALUES ${placeholders.join(', ')} RETURNING *;
  `;
  
  const res = await pool.query(query, values);
  return res.rows;
};

const bulkUpdate = async (grades: Partial<IGrade>[]): Promise<IGrade[]> => {
  if (grades.length === 0) return [];
  
  const results: IGrade[] = [];
  
  for (const grade of grades) {
    if (grade.id) {
      const result = await update(grade.id, grade);
      if (result) results.push(result);
    }
  }
  
  return results;
};

export const GradeService = { 
  create, 
  getAll, 
  getById, 
  update, 
  remove, 
  bulkCreate, 
  bulkUpdate 
};
