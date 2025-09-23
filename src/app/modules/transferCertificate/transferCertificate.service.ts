import pool from '../../../utils/dbClient';

import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { ITransferCertificate } from './transferCertificate.interface';
import { transferCertificateValidationSchema } from './transferCertificate.validation';

const createTransferCertificate = async (
  transferCertificateData: ITransferCertificate
): Promise<ITransferCertificate> => {
  const validatedData = transferCertificateValidationSchema.parse(transferCertificateData);

  // Check if transfer certificate already exists for this student
  const existingCertificate = await pool.query(
    `SELECT id FROM transfer_certificates 
     WHERE student_id = $1 AND status = 'active'`,
    [validatedData.student_id]
  );

  if (existingCertificate.rows.length > 0) {
    // Update existing certificate instead of creating new one
    const updateQuery = `
      UPDATE transfer_certificates SET
        school_id = $1,
        class_id = $2,
        exam_name = $3,
        appeared_exam = $4,
        appeared_year = $5,
        last_payment_month = $6,
        promoted_class = $7,
        detained_class = $8,
        reason_for_leave = $9,
        updated_by = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = $11 AND status = 'active'
      RETURNING *
    `;

    const updateValues = [
      validatedData.school_id,
      validatedData.class_id,
      validatedData.exam_name || null,
      validatedData.appeared_exam || null,
      validatedData.appeared_year,
      validatedData.last_payment_month || null,
      validatedData.promoted_class || null,
      validatedData.detained_class || null,
      validatedData.reason_for_leave || null,
      validatedData.updated_by || null,
      validatedData.student_id,
    ];

    const updateResult = await pool.query(updateQuery, updateValues);
    return updateResult.rows[0];
  }

  // Create new certificate if none exists
  const query = `
    INSERT INTO transfer_certificates (
      school_id, class_id, student_id, exam_name, appeared_exam, 
      appeared_year, last_payment_month, promoted_class, detained_class, 
      reason_for_leave, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;

  const values = [
    validatedData.school_id,
    validatedData.class_id,
    validatedData.student_id,
    validatedData.exam_name || null,
    validatedData.appeared_exam || null,
    validatedData.appeared_year,
    validatedData.last_payment_month || null,
    validatedData.promoted_class || null,
    validatedData.detained_class || null,
    validatedData.reason_for_leave || null,
    validatedData.created_by || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllTransferCertificates = async (
  filters: any,
  paginationOptions: any
): Promise<IGenericResponse<ITransferCertificate[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

  // Build search conditions
  const searchConditions = [];
  if (searchTerm) {
    searchConditions.push(`
      (tc.exam_name ILIKE $${searchConditions.length + 1} OR 
       tc.appeared_exam ILIKE $${searchConditions.length + 1} OR
       tc.promoted_class ILIKE $${searchConditions.length + 1} OR
       tc.detained_class ILIKE $${searchConditions.length + 1} OR
       tc.reason_for_leave ILIKE $${searchConditions.length + 1} OR
       s.name ILIKE $${searchConditions.length + 1} OR
       c.name ILIKE $${searchConditions.length + 1} OR
       st.name ILIKE $${searchConditions.length + 1})
    `);
  }

  // Build filter conditions
  const filterConditions: string[] = [];
  Object.keys(filtersData).forEach((key, index) => {
    if (filtersData[key]) {
      filterConditions.push(`tc.${key} = $${searchConditions.length + filterConditions.length + 1}`);
    }
  });

  // Combine all conditions
  const whereConditions = [...searchConditions, ...filterConditions];
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Build query parameters
  const queryParams = [];
  if (searchTerm) {
    queryParams.push(`%${searchTerm}%`);
  }
  Object.values(filtersData).forEach(value => {
    if (value) queryParams.push(value);
  });

  const countQuery = `
    SELECT COUNT(*) as total
    FROM transfer_certificates tc
    LEFT JOIN school s ON tc.school_id = s.id
    LEFT JOIN class c ON tc.class_id = c.id
    LEFT JOIN students st ON tc.student_id = st.id
    ${whereClause}
  `;

  const dataQuery = `
    SELECT 
      tc.*,
      s.name as school_name,
      c.name as class_name,
      st.student_name_en as student_name,
      st.student_id as student_roll,
      u1.name as created_by_name,
      u2.name as updated_by_name
    FROM transfer_certificates tc
    LEFT JOIN school s ON tc.school_id = s.id
    LEFT JOIN class c ON tc.class_id = c.id
    LEFT JOIN students st ON tc.student_id = st.id
    LEFT JOIN school_user u1 ON tc.created_by = u1.id
    LEFT JOIN school_user u2 ON tc.updated_by = u2.id
    ${whereClause}
    ORDER BY tc.${sortBy} ${sortOrder}
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
  `;

  const countResult = await pool.query(countQuery, queryParams);
  const total = parseInt(countResult.rows[0].total);

  const dataResult = await pool.query(dataQuery, [...queryParams, limit, skip]);
  const data = dataResult.rows;

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const getSingleTransferCertificate = async (id: number): Promise<ITransferCertificate | null> => {
  const query = `
    SELECT 
      tc.*,
      s.name as school_name,
      c.name as class_name,
      st.student_name_en as student_name,
      st.student_id as student_roll,
      u1.name as created_by_name,
      u2.name as updated_by_name
    FROM transfer_certificates tc
    LEFT JOIN school s ON tc.school_id = s.id
    LEFT JOIN class c ON tc.class_id = c.id
    LEFT JOIN students st ON tc.student_id = st.id
    LEFT JOIN school_user u1 ON tc.created_by = u1.id
    LEFT JOIN school_user u2 ON tc.updated_by = u2.id
    WHERE tc.id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const updateTransferCertificate = async (
  id: number,
  updateData: Partial<ITransferCertificate>
): Promise<ITransferCertificate | null> => {
  // Check if transfer certificate exists
  const existingCertificate = await getSingleTransferCertificate(id);
  if (!existingCertificate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer certificate not found');
  }

  // Validate update data
  const validatedData = transferCertificateValidationSchema.partial().parse(updateData);

  // Build dynamic update query
  const updateFields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(validatedData).forEach((key) => {
    if (validatedData[key as keyof typeof validatedData] !== undefined) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(validatedData[key as keyof typeof validatedData]);
      paramCount++;
    }
  });

  if (updateFields.length === 0) {
    return existingCertificate;
  }

  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE transfer_certificates 
    SET ${updateFields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteTransferCertificate = async (id: number): Promise<ITransferCertificate | null> => {
  const query = 'DELETE FROM transfer_certificates WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const softDeleteTransferCertificate = async (id: number): Promise<ITransferCertificate | null> => {
  const query = `
    UPDATE transfer_certificates 
    SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const restoreTransferCertificate = async (id: number): Promise<ITransferCertificate | null> => {
  const query = `
    UPDATE transfer_certificates 
    SET status = 'active', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const getTransferCertificatesByStudent = async (studentId: number): Promise<ITransferCertificate[]> => {
  const query = `
    SELECT 
      tc.*,
      s.name as school_name,
      c.name as class_name,
      st.student_name_en as student_name,
      st.student_id as student_roll
    FROM transfer_certificates tc
    LEFT JOIN school s ON tc.school_id = s.id
    LEFT JOIN class c ON tc.class_id = c.id
    LEFT JOIN students st ON tc.student_id = st.id
    WHERE tc.student_id = $1 AND tc.status = 'active'
    ORDER BY tc.created_at DESC
  `;

  const result = await pool.query(query, [studentId]);
  return result.rows;
};

const getTransferCertificatesByClass = async (classId: number): Promise<ITransferCertificate[]> => {
  const query = `
    SELECT 
      tc.*,
      s.name as school_name,
      c.name as class_name,
      st.student_name_en as student_name,
      st.student_id as student_roll
    FROM transfer_certificates tc
    LEFT JOIN school s ON tc.school_id = s.id
    LEFT JOIN class c ON tc.class_id = c.id
    LEFT JOIN students st ON tc.student_id = st.id
    WHERE tc.class_id = $1 AND tc.status = 'active'
    ORDER BY tc.created_at DESC
  `;

  const result = await pool.query(query, [classId]);
  return result.rows;
};

export const TransferCertificateService = {
  createTransferCertificate,
  getAllTransferCertificates,
  getSingleTransferCertificate,
  updateTransferCertificate,
  deleteTransferCertificate,
  softDeleteTransferCertificate,
  restoreTransferCertificate,
  getTransferCertificatesByStudent,
  getTransferCertificatesByClass,
};
