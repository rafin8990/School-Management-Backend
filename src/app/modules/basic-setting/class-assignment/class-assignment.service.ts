import httpStatus from 'http-status';
import { IClassWithAssignments, IClassAssignmentResponse } from './class-assignment.interface';
import pool from '../../../../utils/dbClient';
import ApiError from '../../../../errors/ApiError';

const getClassesWithAssignments = async (schoolId: number): Promise<IClassWithAssignments[]> => {
  try {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.status,
        g.id as group_id,
        g.name as group_name,
        s.id as section_id,
        s.name as section_name,
        sh.id as shift_id,
        sh.name as shift_name
      FROM class c
      LEFT JOIN class_group_assign cga ON c.id = cga.class_id AND c.school_id = cga.school_id
      LEFT JOIN "group" g ON g.id = ANY(cga.group_ids) AND g.status = 'active'
      LEFT JOIN class_section_assign csa ON c.id = csa.class_id AND c.school_id = csa.school_id
      LEFT JOIN section s ON s.id = ANY(csa.section_ids) AND s.status = 'active'
      LEFT JOIN class_shift_assign csh ON c.id = csh.class_id AND c.school_id = csh.school_id
      LEFT JOIN shift sh ON sh.id = ANY(csh.shift_ids) AND sh.status = 'active'
      WHERE c.school_id = $1 AND c.status = 'active'
      ORDER BY c.id, g.id, s.id, sh.id
    `;

    const result = await pool.query(query, [schoolId]);
    return result.rows;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch class assignments');
  }
};

const getClassAssignments = async (classId: number, schoolId: number): Promise<IClassAssignmentResponse | null> => {
  try {
    // Get class info
    const classQuery = 'SELECT id, name FROM class WHERE id = $1 AND school_id = $2 AND status = \'active\'';
    const classResult = await pool.query(classQuery, [classId, schoolId]);
    
    if (classResult.rows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
    }

    const classInfo = classResult.rows[0];

    // Get assigned groups
    const groupsQuery = `
      SELECT g.id, g.name
      FROM class_group_assign cga
      JOIN "group" g ON g.id = ANY(cga.group_ids)
      WHERE cga.class_id = $1 AND cga.school_id = $2 AND g.status = 'active'
      ORDER BY g.name
    `;
    const groupsResult = await pool.query(groupsQuery, [classId, schoolId]);

    // Get assigned sections
    const sectionsQuery = `
      SELECT s.id, s.name
      FROM class_section_assign csa
      JOIN section s ON s.id = ANY(csa.section_ids)
      WHERE csa.class_id = $1 AND csa.school_id = $2 AND s.status = 'active'
      ORDER BY s.name
    `;
    const sectionsResult = await pool.query(sectionsQuery, [classId, schoolId]);

    // Get assigned shifts
    const shiftsQuery = `
      SELECT sh.id, sh.name
      FROM class_shift_assign csh
      JOIN shift sh ON sh.id = ANY(csh.shift_ids)
      WHERE csh.class_id = $1 AND csh.school_id = $2 AND sh.status = 'active'
      ORDER BY sh.name
    `;
    const shiftsResult = await pool.query(shiftsQuery, [classId, schoolId]);

    return {
      class_id: classInfo.id,
      class_name: classInfo.name,
      groups: groupsResult.rows,
      sections: sectionsResult.rows,
      shifts: shiftsResult.rows,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch class assignments');
  }
};

export const ClassAssignmentService = {
  getClassesWithAssignments,
  getClassAssignments,
};
