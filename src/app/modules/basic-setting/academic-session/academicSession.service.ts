import pool from '../../../../utils/dbClient';
import { IAcademicSession, PaginatedResponse, SingleResponse } from './academicSession.interface';

const getAllAcademicSessions = async (
  params: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    name?: string;
    status?: string;
    school_id: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): Promise<PaginatedResponse<IAcademicSession>> => {
  const {
    page = 1,
    limit = 10,
    searchTerm = '',
    name = '',
    status = '',
    school_id,
    sortBy = 'id',
    sortOrder = 'desc',
  } = params;

  const offset = (page - 1) * limit;
  let whereConditions = ['school_id = $1'];
  let queryParams: any[] = [school_id];
  let paramCount = 1;

  if (searchTerm) {
    paramCount++;
    whereConditions.push(`name ILIKE $${paramCount}`);
    queryParams.push(`%${searchTerm}%`);
  }

  if (name) {
    paramCount++;
    whereConditions.push(`name ILIKE $${paramCount}`);
    queryParams.push(`%${name}%`);
  }

  if (status) {
    paramCount++;
    whereConditions.push(`status = $${paramCount}`);
    queryParams.push(status);
  }

  const whereClause = whereConditions.join(' AND ');

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM academic_session WHERE ${whereClause}`;
  const countResult = await pool.query(countQuery, queryParams);
  const total = parseInt(countResult.rows[0].total);

  // Get paginated data
  const dataQuery = `
    SELECT * FROM academic_session 
    WHERE ${whereClause}
    ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
  `;
  queryParams.push(limit, offset);

  const result = await pool.query(dataQuery, queryParams);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    success: true,
    message: 'Academic sessions fetched successfully',
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
    data: result.rows,
  };
};

const getAcademicSessionById = async (id: number): Promise<SingleResponse<IAcademicSession>> => {
  const result = await pool.query('SELECT * FROM academic_session WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    throw new Error('Academic session not found');
  }

  return {
    success: true,
    message: 'Academic session fetched successfully',
    data: result.rows[0],
  };
};

const createAcademicSession = async (data: Omit<IAcademicSession, 'id' | 'created_at' | 'updated_at'>): Promise<SingleResponse<IAcademicSession>> => {
  const result = await pool.query(
    `INSERT INTO academic_session (name, serial_number, school_id, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.serial_number, data.school_id, data.status]
  );

  return {
    success: true,
    message: 'Academic session created successfully',
    data: result.rows[0],
  };
};

const updateAcademicSession = async (
  id: number,
  data: Partial<Pick<IAcademicSession, 'name' | 'serial_number' | 'status'>>
): Promise<SingleResponse<IAcademicSession>> => {
  const fields = [];
  const values = [];
  let paramCount = 0;

  if (data.name !== undefined) {
    paramCount++;
    fields.push(`name = $${paramCount}`);
    values.push(data.name);
  }

  if (data.serial_number !== undefined) {
    paramCount++;
    fields.push(`serial_number = $${paramCount}`);
    values.push(data.serial_number);
  }

  if (data.status !== undefined) {
    paramCount++;
    fields.push(`status = $${paramCount}`);
    values.push(data.status);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  paramCount++;
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE academic_session 
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('Academic session not found');
  }

  return {
    success: true,
    message: 'Academic session updated successfully',
    data: result.rows[0],
  };
};

const deleteAcademicSession = async (id: number): Promise<{ success: boolean; message: string }> => {
  const result = await pool.query('DELETE FROM academic_session WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    throw new Error('Academic session not found');
  }

  return {
    success: true,
    message: 'Academic session deleted successfully',
  };
};

export const AcademicSessionService = {
  getAllAcademicSessions,
  getAcademicSessionById,
  createAcademicSession,
  updateAcademicSession,
  deleteAcademicSession,
};
