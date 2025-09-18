import httpStatus from 'http-status';
import pool from '../../../../utils/dbClient';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';
import ApiError from '../../../../errors/ApiError';
import { IClassExam } from './classExam.interface';

const createClassExam = async (data: IClassExam): Promise<IClassExam | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO class_exam (class_exam_name, position, status, serial_number, school_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      data.class_exam_name,
      data.position,
      data.status,
      data.serial_number ?? null,
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

const getAllClassExams = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IClassExam[]>> => {
  const { searchTerm, ...filterFields } = filters;
  const { page, limit, skip, sortBy = 'created_at', sortOrder = 'desc' } =
    paginationHelpers.calculatePagination(paginationOptions);

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (searchTerm) {
    conditions.push(`(ce.class_exam_name ILIKE $${paramIndex})`);
    values.push(`%${searchTerm}%`);
    paramIndex++;
  }

  for (const [field, value] of Object.entries(filterFields)) {
    if (value !== undefined && value !== null) {
      conditions.push(`ce.${field} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT ce.*
    FROM class_exam ce
    ${whereClause}
    ORDER BY ce.${sortBy} ${sortOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex};
  `;

  values.push(limit, skip);

  const result = await pool.query(query, values);

  const countQuery = `SELECT COUNT(*) FROM class_exam ce ${whereClause};`;
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

const getSingleClassExam = async (id: number): Promise<IClassExam | null> => {
  const query = `
    SELECT ce.*
    FROM class_exam ce
    WHERE ce.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const updateClassExam = async (id: number, data: Partial<IClassExam>): Promise<IClassExam | null> => {
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
      UPDATE class_exam 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Class exam not found');
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

const deleteClassExam = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = 'DELETE FROM class_exam WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Class exam not found');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const ClassExamService = {
  createClassExam,
  getAllClassExams,
  getSingleClassExam,
  updateClassExam,
  deleteClassExam,
};


