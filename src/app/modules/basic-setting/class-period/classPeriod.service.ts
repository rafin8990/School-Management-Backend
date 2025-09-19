import pool from '../../../../utils/dbClient';
import { IClassPeriod, PaginatedResponse } from './classPeriod.interface';

const createClassPeriod = async (data: IClassPeriod): Promise<IClassPeriod> => {
  const { name, serial_number, school_id, status } = data;
  
  const result = await pool.query(
    `INSERT INTO class_period (name, serial_number, school_id, status) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [name, serial_number, school_id, status]
  );
  
  return result.rows[0];
};

const getAllClassPeriods = async (
  filters: any,
  paginationOptions: any
): Promise<PaginatedResponse<IClassPeriod>> => {
  const { searchTerm, name, status, school_id } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationOptions;

  let query = `
    SELECT * FROM class_period 
    WHERE school_id = $1
  `;
  const queryParams: any[] = [school_id];
  let paramCount = 1;

  // Add search filters
  if (searchTerm) {
    paramCount++;
    query += ` AND name ILIKE $${paramCount}`;
    queryParams.push(`%${searchTerm}%`);
  }

  if (name) {
    paramCount++;
    query += ` AND name ILIKE $${paramCount}`;
    queryParams.push(`%${name}%`);
  }

  if (status) {
    paramCount++;
    query += ` AND status = $${paramCount}`;
    queryParams.push(status);
  }

  // Add sorting
  if (sortBy && sortOrder) {
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
  } else {
    query += ` ORDER BY serial_number ASC, created_at DESC`;
  }

  // Add pagination
  query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  queryParams.push(limit, skip);

  const result = await pool.query(query, queryParams);

  // Get total count for pagination
  let countQuery = `
    SELECT COUNT(*) as total FROM class_period 
    WHERE school_id = $1
  `;
  const countParams: any[] = [school_id];
  let countParamCount = 1;

  if (searchTerm) {
    countParamCount++;
    countQuery += ` AND name ILIKE $${countParamCount}`;
    countParams.push(`%${searchTerm}%`);
  }

  if (name) {
    countParamCount++;
    countQuery += ` AND name ILIKE $${countParamCount}`;
    countParams.push(`%${name}%`);
  }

  if (status) {
    countParamCount++;
    countQuery += ` AND status = $${countParamCount}`;
    countParams.push(status);
  }

  const countResult = await pool.query(countQuery, countParams);
  const total = parseInt(countResult.rows[0].total);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    success: true,
    message: 'Class periods retrieved successfully',
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

const getClassPeriodById = async (id: number): Promise<IClassPeriod | null> => {
  const result = await pool.query(
    'SELECT * FROM class_period WHERE id = $1',
    [id]
  );
  
  return result.rows[0] || null;
};

const updateClassPeriod = async (
  id: number,
  data: Partial<IClassPeriod>
): Promise<IClassPeriod | null> => {
  const { name, serial_number, status } = data;
  
  const result = await pool.query(
    `UPDATE class_period 
     SET name = COALESCE($1, name), 
         serial_number = COALESCE($2, serial_number), 
         status = COALESCE($3, status),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 
     RETURNING *`,
    [name, serial_number, status, id]
  );
  
  return result.rows[0] || null;
};

const deleteClassPeriod = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM class_period WHERE id = $1',
    [id]
  );

  return (result.rowCount ?? 0) > 0;
};

export const ClassPeriodService = {
  createClassPeriod,
  getAllClassPeriods,
  getClassPeriodById,
  updateClassPeriod,
  deleteClassPeriod,
};
