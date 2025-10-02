import pool from '../../../../utils/dbClient';
import { ISectionGradeSummaryFilters, ISectionGradeSummaryResponse, ISectionGradeRow } from './sectionGradeSummary.interface';

export const SectionGradeSummaryService = {
  async generate(filters: ISectionGradeSummaryFilters): Promise<ISectionGradeSummaryResponse> {
    const school = await this.getSchoolInfo(filters.school_id);
    const exam = await this.getExamInfo(filters.exam_id, filters.school_id);
    const rows = await this.getRows(filters);
    return { school_info: school, report_info: { exam_name: exam, year: filters.year_id }, rows };
  },

  async getSchoolInfo(schoolId: number) {
    const r = await pool.query('SELECT name, address, logo as logo_url, email, website FROM school WHERE id = $1', [schoolId]);
    const s = r.rows[0] || {};
    return { name: s.name || 'School Name', address: s.address || 'School Address', logo_url: s.logo_url || null, email: s.email || null, website: s.website || null };
  },

  async getExamInfo(examId: number, schoolId: number) {
    const r = await pool.query('SELECT class_exam_name FROM class_exam WHERE id = $1 AND school_id = $2', [examId, schoolId]);
    return r.rows[0]?.class_exam_name || 'Exam';
  },

  async getRows(filters: ISectionGradeSummaryFilters): Promise<ISectionGradeRow[]> {
    // Build population grouped by class/section
    const baseConds: string[] = ['s.school_id = $1'];
    const baseParams: any[] = [filters.school_id];
    let idx = 2;
    if (filters.class_id) { baseConds.push(`s.class_id = $${idx++}`); baseParams.push(filters.class_id); }
    if (filters.group_id) { baseConds.push(`s.group_id = $${idx++}`); baseParams.push(filters.group_id); }
    if (filters.section_id) { baseConds.push(`s.section_id = $${idx++}`); baseParams.push(filters.section_id); }

    const population = await pool.query(
      `SELECT c.id as class_id, c.name as class_name, sec.id as section_id, sec.name as section_name, COUNT(*)::int as total
       FROM students s
       JOIN class c ON c.id = s.class_id
       LEFT JOIN section sec ON sec.id = s.section_id
       WHERE ${baseConds.join(' AND ')} AND s.status = 'active' AND s.disabled = false
       GROUP BY c.id, c.name, sec.id, sec.name
       ORDER BY c.name, sec.name NULLS LAST`,
      baseParams
    );

    const rows: ISectionGradeRow[] = [];
    for (const p of population.rows) {
      const gradeCounts = await pool.query(
        `SELECT COALESCE(mi.grade, '') as grade, COUNT(DISTINCT mi.student_id)::int as cnt
         FROM mark_input mi JOIN students s ON s.id = mi.student_id
         WHERE mi.school_id = $1 AND mi.exam_id = $2 AND mi.year_id = $3 AND mi.class_id = $4 ${p.section_id ? 'AND s.section_id = $5' : ''} ${filters.group_id ? `AND s.group_id = $${p.section_id ? 6 : 5}` : ''}
         GROUP BY mi.grade`,
        [filters.school_id, filters.exam_id, filters.year_id, p.class_id, ...(p.section_id ? [p.section_id] : []), ...(filters.group_id ? [filters.group_id] : [])]
      );

      const map: Record<string, number> = {};
      for (const g of gradeCounts.rows) map[g.grade] = Number(g.cnt);

      rows.push({
        class_id: p.class_id,
        class_name: p.class_name,
        section_id: p.section_id,
        section_name: p.section_name || 'COMMON',
        total_students: Number(p.total || 0),
        a_plus: map['A+'] || 0,
        a: map['A'] || 0,
        a_minus: map['A-'] || 0,
        b: map['B'] || 0,
        c: map['C'] || 0,
        d: map['D'] || 0,
        f: map['F'] || 0,
      });
    }

    return rows;
  },
};


