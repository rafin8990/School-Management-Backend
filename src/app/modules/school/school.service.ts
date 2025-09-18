import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import pool from '../../../utils/dbClient';
import { ISchool } from './school.interface';

const createSchool = async (data: ISchool): Promise<ISchool | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO school (name, eiin, mobile, logo, district_id, thana_id, website, email, address, payable_amount, established_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      data.name,
      data.eiin ?? null,
      data.mobile ?? null,
      data.logo ?? null,
      data.district_id,
      data.thana_id,
      data.website ?? null,
      data.email ?? null,
      data.address ?? null,
      data.payable_amount ?? null,
      data.established_at ?? null,
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

const getAllSchools = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ISchool[]>> => {
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
    conditions.push(`(s.name ILIKE $${paramIndex} OR s.eiin ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex})`);
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
    SELECT s.*,
           row_to_json(d) as district,
           row_to_json(t) as thana
    FROM school s
    LEFT JOIN district d ON s.district_id = d.id
    LEFT JOIN thana t ON s.thana_id = t.id
    ${whereClause}
    ORDER BY s.${sortBy} ${sortOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex};
  `;

  values.push(limit, skip);

  const result = await pool.query(query, values);

  const countQuery = `SELECT COUNT(*) FROM school s ${whereClause};`;
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

const getSingleSchool = async (id: number): Promise<ISchool | null> => {
  const query = `
    SELECT s.*,
           row_to_json(d) as district,
           row_to_json(t) as thana
    FROM school s
    LEFT JOIN district d ON s.district_id = d.id
    LEFT JOIN thana t ON s.thana_id = t.id
    WHERE s.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const updateSchool = async (id: number, data: Partial<ISchool>): Promise<ISchool | null> => {
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
      UPDATE school 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'School not found');
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

const deleteSchool = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = 'DELETE FROM school WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'School not found');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getSchoolsByDistrict = async (districtId: number): Promise<ISchool[]> => {
  const query = `
    SELECT s.*,
           row_to_json(d) as district,
           row_to_json(t) as thana
    FROM school s
    LEFT JOIN district d ON s.district_id = d.id
    LEFT JOIN thana t ON s.thana_id = t.id
    WHERE s.district_id = $1
    ORDER BY s.name ASC;
  `;
  const result = await pool.query(query, [districtId]);
  return result.rows;
};

const getSchoolsByThana = async (thanaId: number): Promise<ISchool[]> => {
  const query = `
    SELECT s.*,
           row_to_json(d) as district,
           row_to_json(t) as thana
    FROM school s
    LEFT JOIN district d ON s.district_id = d.id
    LEFT JOIN thana t ON s.thana_id = t.id
    WHERE s.thana_id = $1
    ORDER BY s.name ASC;
  `;
  const result = await pool.query(query, [thanaId]);
  return result.rows;
};

export const SchoolService = {
  createSchool,
  getAllSchools,
  getSingleSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByDistrict,
  getSchoolsByThana,
};
