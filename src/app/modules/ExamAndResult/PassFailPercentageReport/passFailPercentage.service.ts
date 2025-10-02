import pool from '../../../../utils/dbClient';
import { IPassFailPercentageFilters, IPassFailPercentageResponse, ISectionStatRow } from './passFailPercentage.interface';

export const PassFailPercentageService = {
  async generate(filters: IPassFailPercentageFilters): Promise<IPassFailPercentageResponse> {
    const school = await this.getSchoolInfo(filters.school_id);
    const exam = await this.getExamInfo(filters.exam_id, filters.year_id, filters.school_id);

    const rows = await this.getSectionStats(filters);

    return {
      school_info: school,
      report_info: {
        exam_name: exam.exam_name,
        year: exam.year,
      },
      rows,
    };
  },

  async getSchoolInfo(schoolId: number) {
    const r = await pool.query('SELECT name, address, logo as logo_url, email, website FROM school WHERE id = $1', [schoolId]);
    const s = r.rows[0] || {};
    return {
      name: s.name || 'School Name',
      address: s.address || 'School Address',
      logo_url: s.logo_url || null,
      email: s.email || null,
      website: s.website || null,
    };
  },

  async getExamInfo(examId: number, yearId: number, schoolId: number) {
    const r = await pool.query('SELECT class_exam_name as exam_name FROM class_exam WHERE id = $1 AND school_id = $2', [examId, schoolId]);
    return { exam_name: r.rows[0]?.exam_name || 'Exam', year: yearId };
  },

  async getSectionStats(filters: IPassFailPercentageFilters): Promise<ISectionStatRow[]> {
    // Build base student population per section (class filter optional for "All")
    const where: string[] = ['s.school_id = $1'];
    const params: any[] = [filters.school_id];
    let idx = 2;
    if (filters.class_id) { where.push(`s.class_id = $${idx++}`); params.push(filters.class_id); }
    if (filters.group_id) { where.push(`s.group_id = $${idx++}`); params.push(filters.group_id); }
    if (filters.section_id) { where.push(`s.section_id = $${idx++}`); params.push(filters.section_id); }

    const baseQuery = `
      SELECT c.id as class_id, c.name as class_name, sec.id as section_id, sec.name as section_name, COUNT(*)::int as total_students
      FROM students s
      JOIN class c ON c.id = s.class_id
      LEFT JOIN section sec ON sec.id = s.section_id
      WHERE ${where.join(' AND ')} AND s.status = 'active' AND s.disabled = false
      GROUP BY c.id, c.name, sec.id, sec.name
      ORDER BY c.name, sec.name NULLS LAST
    `;
    const base = await pool.query(baseQuery, params);

    const results: ISectionStatRow[] = [];

    for (const row of base.rows) {
      // Resolve section id if named
      const rowSectionId = row.section_id || (row.section_name ? await this.getSectionIdByName(row.section_name) : null);

      // Appeared: students having any mark_input row for this exam/year
      const appearedConds: string[] = [
        'mi.school_id = $1',
        'mi.exam_id = $2',
        'mi.year_id = $3',
      ];
      const appearedParams: any[] = [filters.school_id, filters.exam_id, filters.year_id];
      let aIdx = 4;
      if (filters.class_id) { appearedConds.push(`mi.class_id = $${aIdx++}`); appearedParams.push(filters.class_id); }
      else { appearedConds.push(`mi.class_id = $${aIdx++}`); appearedParams.push(row.class_id); }
      if (rowSectionId) { appearedConds.push(`s.section_id = $${aIdx++}`); appearedParams.push(rowSectionId); }
      if (filters.group_id) { appearedConds.push(`s.group_id = $${aIdx++}`); appearedParams.push(filters.group_id); }

      const appeared = await pool.query(
        `SELECT COUNT(DISTINCT mi.student_id)::int as appeared
         FROM mark_input mi
         JOIN students s ON s.id = mi.student_id
         WHERE ${appearedConds.join(' AND ')}`,
        appearedParams
      );

      // Pass/Fail: assuming status in mark_input reflects presence and grade/gpa holds pass criteria
      // Define pass as gpa > 0 or grade NOT IN ('F') across subjects; an approximation: if any subject has grade = 'F' then fail.
      const pfConds: string[] = [
        'mi.school_id = $1',
        'mi.exam_id = $2',
        'mi.year_id = $3',
      ];
      const pfParams: any[] = [filters.school_id, filters.exam_id, filters.year_id];
      let pIdx = 4;
      if (filters.class_id) { pfConds.push(`mi.class_id = $${pIdx++}`); pfParams.push(filters.class_id); }
      else { pfConds.push(`mi.class_id = $${pIdx++}`); pfParams.push(row.class_id); }
      if (rowSectionId) { pfConds.push(`s.section_id = $${pIdx++}`); pfParams.push(rowSectionId); }
      if (filters.group_id) { pfConds.push(`s.group_id = $${pIdx++}`); pfParams.push(filters.group_id); }

      const passFail = await pool.query(
        `WITH per_student AS (
            SELECT mi.student_id,
                   BOOL_OR(COALESCE(mi.grade, '') = 'F') AS has_fail
            FROM mark_input mi
            JOIN students s ON s.id = mi.student_id
            WHERE ${pfConds.join(' AND ')}
            GROUP BY mi.student_id
         )
         SELECT 
           SUM(CASE WHEN has_fail THEN 0 ELSE 1 END)::int AS pass,
           SUM(CASE WHEN has_fail THEN 1 ELSE 0 END)::int AS fail
         FROM per_student`,
        pfParams
      );

      const appearedCount = appeared.rows[0]?.appeared || 0;
      const passCount = passFail.rows[0]?.pass || 0;
      const failCount = passFail.rows[0]?.fail || 0;
      const absentCount = Math.max(0, (row.total_students || 0) - appearedCount);

      results.push({
        class_id: row.class_id,
        class_name: row.class_name,
        section_id: row.section_id,
        section_name: row.section_name || 'COMMON',
        total_students: row.total_students || 0,
        appeared: appearedCount,
        pass: passCount,
        fail: failCount,
        absent: absentCount,
      });
    }

    return results;
  },

  async getSectionIdByName(name: string) {
    const r = await pool.query('SELECT id FROM section WHERE name = $1 LIMIT 1', [name]);
    return r.rows[0]?.id || null;
  },
};



