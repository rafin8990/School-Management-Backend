import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import pool from '../../../utils/dbClient';
import { IThana } from './thana.interface';

const createThana = async (data: IThana): Promise<IThana | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO thana (name, district_id)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [data.name, data.district_id ?? null];

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

const getAllThanas = async (
  filters: Partial<IThana> & { searchTerm?: string },
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IThana[]>> => {
  const { searchTerm, ...filterFields } = filters;
  const {
    page,
    limit,
    skip,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = paginationHelpers.calculatePagination(paginationOptions);

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (searchTerm) {
    conditions.push(`(t.name ILIKE $${paramIndex})`);
    values.push(`%${searchTerm}%`);
    paramIndex++;
  }

  for (const [field, value] of Object.entries(filterFields)) {
    if (value !== undefined && value !== null) {
      conditions.push(`t.${field} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT t.*,
           row_to_json(d) as district
    FROM thana t
    LEFT JOIN district d ON t.district_id = d.id
    ${whereClause}
    ORDER BY t.${sortBy} ${sortOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex};
  `;

  values.push(limit, skip);

  const result = await pool.query(query, values);

  const countQuery = `SELECT COUNT(*) FROM thana t ${whereClause};`;
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

const getSingleThana = async (id: number): Promise<IThana | null> => {
  const query = `
    SELECT t.*,
           row_to_json(d) as district
    FROM thana t
    LEFT JOIN district d ON t.district_id = d.id
    WHERE t.id = $1;
  `;

  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thana not found');
  }

  return result.rows[0];
};

const updateThana = async (
  id: number,
  data: Partial<IThana>
): Promise<IThana | null> => {
  try {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No data provided for update');
    }

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');
    const values = [...fields.map(field => (data as any)[field]), id];

    const query = `
      UPDATE thana
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Thana not found');
    }

    return result.rows[0];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update thana');
  }
};

const deleteThana = async (id: number): Promise<void> => {
  try {
    const result = await pool.query(
      'DELETE FROM thana WHERE id = $1 RETURNING *;',
      [id]
    );

    if (result.rowCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Thana not found');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete thana');
  }
};

const getThanasByDistrict = async (districtId: number): Promise<IThana[]> => {
  const query = `
    SELECT t.*
    FROM thana t
    WHERE t.district_id = $1
    ORDER BY t.name ASC;
  `;
  const result = await pool.query(query, [districtId]);
  return result.rows;
};

export const ThanaService = {
  createThana,
  getAllThanas,
  getSingleThana,
  updateThana,
  deleteThana,
  getThanasByDistrict,
};


