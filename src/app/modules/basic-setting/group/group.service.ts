import httpStatus from 'http-status';

import { IGroup } from './group.interface';
import pool from '../../../../utils/dbClient';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';
import ApiError from '../../../../errors/ApiError';

const createGroup = async (data: IGroup): Promise<IGroup | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO student_group (name, serial_number, status, school_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      data.name,
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

const getAllGroups = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IGroup[]>> => {
  const { searchTerm, ...filterFields } = filters;
  const {
    page,
    limit,
    skip,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = paginationHelpers.calculatePagination(paginationOptions);

  let whereConditions = [];
  let queryParams = [];
  let paramCount = 1;

  // Add search term
  if (searchTerm) {
    whereConditions.push(`name ILIKE $${paramCount}`);
    queryParams.push(`%${searchTerm}%`);
    paramCount++;
  }

  // Add filter fields
  Object.entries(filterFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      whereConditions.push(`${key} = $${paramCount}`);
      queryParams.push(value);
      paramCount++;
    }
  });

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Build query
  let query = `
    SELECT * FROM student_group
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  queryParams.push(limit, skip);

  const result = await pool.query(query, queryParams);

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total FROM student_group
    ${whereClause}
  `;

  const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
  const total = parseInt(countResult.rows[0].total);

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

const getSingleGroup = async (id: number): Promise<IGroup | null> => {
  const query = 'SELECT * FROM student_group WHERE id = $1';
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }

  return result.rows[0];
};

const updateGroup = async (id: number, data: Partial<IGroup>): Promise<IGroup | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE student_group
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
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

const deleteGroup = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = 'DELETE FROM student_group WHERE id = $1';
    const result = await client.query(query, [id]);

    if (result.rowCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const GroupService = {
  createGroup,
  getAllGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
};