import httpStatus from 'http-status';
import { ISubject } from './subject.interface';
import pool from '../../../../utils/dbClient';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';
import ApiError from '../../../../errors/ApiError';

const createSubject = async (data: ISubject): Promise<ISubject | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO subject (name, code, serial_number, status, school_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      data.name,
      data.code ?? null,
      data.serial_number ?? null,
      data.status,
      data.school_id,
    ];

    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getAllSubjects = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ISubject[]>> => {
  const { searchTerm, ...filterFields } = filters;
  const { page, limit, skip, sortBy = 'created_at', sortOrder = 'desc' } =
    paginationHelpers.calculatePagination(paginationOptions);

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (searchTerm) {
    conditions.push(`(s.name ILIKE $${paramIndex} OR s.code ILIKE $${paramIndex})`);
    values.push(`%${searchTerm}%`);
    paramIndex++;
  }

  for (const [field, value] of Object.entries(filterFields)) {
    if (value !== undefined && value !== null) {
      conditions.push(`s.${field} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT s.*
    FROM subject s
    ${whereClause}
    ORDER BY s.${sortBy} ${sortOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex};
  `;

  values.push(limit, skip);

  const result = await pool.query(query, values);

  const countQuery = `SELECT COUNT(*) FROM subject s ${whereClause};`;
  const countResult = await pool.query(countQuery, values.slice(0, paramIndex - 2));
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
    data: result.rows,
  };
};

const getSingleSubject = async (id: number): Promise<ISubject | null> => {
  const query = `
    SELECT s.*
    FROM subject s
    WHERE s.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const updateSubject = async (id: number, data: Partial<ISubject>): Promise<ISubject | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No fields to update');
    }

    const query = `
      UPDATE subject 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteSubject = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = 'DELETE FROM subject WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const SubjectService = {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
};


