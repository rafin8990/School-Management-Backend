import pool from '../../../../utils/dbClient';
import { IBoardExam, PaginatedResponse, SingleResponse } from './boardExam.interface';

const getAllBoardExams = async (
  params: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    name?: string;
    school_id: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): Promise<PaginatedResponse<IBoardExam>> => {
  const {
    page = 1,
    limit = 10,
    searchTerm = '',
    name = '',
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

  const whereClause = whereConditions.join(' AND ');

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM board_exam WHERE ${whereClause}`;
  const countResult = await pool.query(countQuery, queryParams);
  const total = parseInt(countResult.rows[0].total);

  // Get paginated data
  const dataQuery = `
    SELECT * FROM board_exam 
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
    message: 'Board exams fetched successfully',
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

const getBoardExamById = async (id: number): Promise<SingleResponse<IBoardExam>> => {
  const result = await pool.query('SELECT * FROM board_exam WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    throw new Error('Board exam not found');
  }

  return {
    success: true,
    message: 'Board exam fetched successfully',
    data: result.rows[0],
  };
};

const createBoardExam = async (data: Omit<IBoardExam, 'id' | 'created_at' | 'updated_at'>): Promise<SingleResponse<IBoardExam>> => {
  const result = await pool.query(
    `INSERT INTO board_exam (name, serial_number, school_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.name, data.serial_number, data.school_id]
  );

  return {
    success: true,
    message: 'Board exam created successfully',
    data: result.rows[0],
  };
};

const updateBoardExam = async (
  id: number,
  data: Partial<Pick<IBoardExam, 'name' | 'serial_number'>>
): Promise<SingleResponse<IBoardExam>> => {
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

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  paramCount++;
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE board_exam 
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('Board exam not found');
  }

  return {
    success: true,
    message: 'Board exam updated successfully',
    data: result.rows[0],
  };
};

const deleteBoardExam = async (id: number): Promise<{ success: boolean; message: string }> => {
  const result = await pool.query('DELETE FROM board_exam WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    throw new Error('Board exam not found');
  }

  return {
    success: true,
    message: 'Board exam deleted successfully',
  };
};

export const BoardExamService = {
  getAllBoardExams,
  getBoardExamById,
  createBoardExam,
  updateBoardExam,
  deleteBoardExam,
};
