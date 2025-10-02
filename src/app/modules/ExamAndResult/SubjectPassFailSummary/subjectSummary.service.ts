import pool from '../../../../utils/dbClient';
import { ISubjectSummaryFilters, ISubjectSummaryResponse, ISubjectSummaryRow } from './subjectSummary.interface';

export const SubjectSummaryService = {
  async generate(filters: ISubjectSummaryFilters): Promise<ISubjectSummaryResponse> {
    const school = await this.getSchoolInfo(filters.school_id);
    const meta = await this.getMeta(filters);
    const rows = await this.getRows(filters);
    return {
      school_info: school,
      report_info: meta,
      rows,
    };
  },

  async getSchoolInfo(schoolId: number) {
    const r = await pool.query('SELECT name, address, logo as logo_url, email, website FROM school WHERE id = $1', [schoolId]);
    const s = r.rows[0] || {};
    return { name: s.name || 'School Name', address: s.address || 'School Address', logo_url: s.logo_url || null, email: s.email || null, website: s.website || null };
  },

  async getMeta(filters: ISubjectSummaryFilters) {
    const exam = await pool.query('SELECT class_exam_name as exam_name FROM class_exam WHERE id = $1 AND school_id = $2', [filters.exam_id, filters.school_id]);
    const cls = filters.class_id ? await pool.query('SELECT name FROM class WHERE id = $1', [filters.class_id]) : { rows: [] as any[] };
    const grp = filters.group_id ? await pool.query('SELECT name FROM student_group WHERE id = $1', [filters.group_id]) : { rows: [] as any[] };
    const sec = filters.section_id ? await pool.query('SELECT name FROM section WHERE id = $1', [filters.section_id]) : { rows: [] as any[] };
    return { class_name: cls.rows[0]?.name, group_name: grp.rows[0]?.name, section_name: sec.rows[0]?.name, exam_name: exam.rows[0]?.exam_name || 'Exam', year: filters.year_id };
  },

  async getRows(filters: ISubjectSummaryFilters): Promise<ISubjectSummaryRow[]> {
    // Get subjects for selected scope (from class_subjects when class/group provided, else all active subjects of school)
    let subjectsQuery: string;
    let params: any[] = [filters.school_id];
    if (filters.class_id) {
      subjectsQuery = `
        SELECT s.id as subject_id, s.name as subject_name
        FROM class_wise_subject cws
        JOIN class_subjects cs ON cs.class_wise_subject_id = cws.id
        JOIN subject s ON s.id = cs.subject_id AND s.status = 'active'
        WHERE cws.school_id = $1 AND cws.class_id = $2 ${filters.group_id ? 'AND cws.group_id = $3' : ''}
        GROUP BY s.id, s.name
        ORDER BY cs.serial_no
      `;
      params.push(filters.class_id);
      if (filters.group_id) params.push(filters.group_id);
    } else {
      subjectsQuery = `SELECT id as subject_id, name as subject_name FROM subject WHERE school_id = $1 AND status = 'active' ORDER BY name`;
    }
    const subjects = await pool.query(subjectsQuery, params);

    const rows: ISubjectSummaryRow[] = [];
    for (const sub of subjects.rows) {
      // Total students in scope
      const baseConds: string[] = ['s.school_id = $1'];
      const baseParams: any[] = [filters.school_id];
      let b = 2;
      if (filters.class_id) { baseConds.push(`s.class_id = $${b++}`); baseParams.push(filters.class_id); }
      if (filters.group_id) { baseConds.push(`s.group_id = $${b++}`); baseParams.push(filters.group_id); }
      if (filters.section_id) { baseConds.push(`s.section_id = $${b++}`); baseParams.push(filters.section_id); }

      const totalRes = await pool.query(
        `SELECT COUNT(*)::int AS total FROM students s WHERE ${baseConds.join(' AND ')} AND s.status = 'active' AND s.disabled = false`,
        baseParams
      );
      const total = totalRes.rows[0]?.total || 0;

      // Appeared for this subject
      const appearConds: string[] = ['mi.school_id = $1', 'mi.subject_id = $2', 'mi.exam_id = $3', 'mi.year_id = $4'];
      const appearParams: any[] = [filters.school_id, sub.subject_id, filters.exam_id, filters.year_id];
      let a = 5;
      if (filters.class_id) { appearConds.push(`mi.class_id = $${a++}`); appearParams.push(filters.class_id); }
      if (filters.group_id) { appearConds.push(`s.group_id = $${a++}`); appearParams.push(filters.group_id); }
      if (filters.section_id) { appearConds.push(`s.section_id = $${a++}`); appearParams.push(filters.section_id); }
      const appearedRes = await pool.query(
        `SELECT COUNT(DISTINCT mi.student_id)::int AS appeared
         FROM mark_input mi JOIN students s ON s.id = mi.student_id
         WHERE ${appearConds.join(' AND ')}`,
        appearParams
      );
      const appeared = appearedRes.rows[0]?.appeared || 0;

      // Pass/Fail for this subject (F considered fail)
      const pfRes = await pool.query(
        `SELECT 
           SUM(CASE WHEN COALESCE(mi.grade,'') = 'F' THEN 0 ELSE 1 END)::int AS pass,
           SUM(CASE WHEN COALESCE(mi.grade,'') = 'F' THEN 1 ELSE 0 END)::int AS fail
         FROM mark_input mi JOIN students s ON s.id = mi.student_id
         WHERE ${appearConds.join(' AND ')}`,
        appearParams
      );
      const pass = pfRes.rows[0]?.pass || 0;
      const fail = pfRes.rows[0]?.fail || 0;
      const absent = Math.max(0, total - appeared);

      rows.push({ subject_id: sub.subject_id, subject_name: sub.subject_name, total_students: total, appeared, pass, fail, absent });
    }

    return rows;
  },
};


