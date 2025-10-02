import pool from '../../../../utils/dbClient';
import { ITabulationResponse, ITabulationStudent, ITabulationFilters } from './tabulationReport.interface';
import { ProgressReportService } from '../ProgressReport/progressReport.service';

class TabulationReportService {
  async getTabulationReport(filters: ITabulationFilters): Promise<ITabulationResponse> {
    try {
      // Convert tabulation filters to progress report filters
      const progressFilters = {
        class_id: filters.class_id,
        exam_id: filters.exam_id,
        year_id: filters.year_id,
        group_id: filters.group_id,
        section_id: filters.section_id,
        shift_id: filters.shift_id,
        student_id: filters.student_id,
        merit_type: filters.merit_type,
        merit_order: filters.sequential_order,
        school_id: filters.school_id,
      };

      // Use progress report service to get the data with correct calculations
      const progressReportData = await ProgressReportService.generateProgressReport(progressFilters);
      
      // Convert progress report data to tabulation format
      const students = progressReportData.students.map(student => ({
        student_id: student.student_id,
        student_name_en: student.student_name_en,
        student_name_bn: student.student_name_bn,
        student_id_code: student.student_id_code,
        roll: student.roll,
        class_name: student.class_name,
        group_name: student.group_name,
        section_name: student.section_name,
        shift_name: student.shift_name,
        subjects: student.subjects.map(subject => ({
          subject_id: subject.subject_id,
          subject_name: subject.subject_name,
          short_codes: subject.short_codes.map(sc => ({
            short_code_id: sc.short_code_id,
            short_code_name: sc.short_code_name,
            obtained_marks: sc.obtained_marks,
            full_marks: sc.full_marks,
            pass_mark: sc.pass_mark,
          })),
          total_marks: subject.total_marks,
          full_marks: subject.full_marks,
          grade: subject.grade,
          gpa: subject.gpa,
        })),
        total_marks: student.total_marks,
        total_full_marks: student.total_full_marks,
        grade: student.grade,
        gpa: student.gpa,
        position: student.position,
        comment: student.comment,
      }));

      // Get school information
      const schoolInfo = await this.getSchoolInfo(filters.school_id);
      
      // Get report info
      const reportInfo = await this.getReportInfo(filters, students);
      
      const result = {
        school_info: schoolInfo,
        report_info: reportInfo,
        students: students,
        grade_setup: {
          grade_setup_id: progressReportData.grade_setup.grade_setup_id,
          grade_points: progressReportData.grade_setup.grade_points,
        },
      };
      
      return result;
    } catch (error) {
      console.error('Error in getTabulationReport:', error);
      throw error;
    }
  }

  private async getSchoolInfo(schoolId: number) {
    const query = `
      SELECT name, address, email, website, logo
      FROM school
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [schoolId]);
    const school = result.rows[0] || {};
    
    return {
      name: school.name || 'School Name',
      address: school.address || 'School Address',
      email: school.email || '',
      website: school.website || '',
      logo_url: school.logo || null,
    };
  }

  private async getReportInfo(filters: ITabulationFilters, students: ITabulationStudent[]) {
    const examQuery = `
      SELECT ce.class_exam_name
      FROM class_exam ce
      WHERE ce.id = $1
    `;
    const examResult = await pool.query(examQuery, [filters.exam_id]);
    
    const yearQuery = `
      SELECT ay.name
      FROM academic_year ay
      WHERE ay.id = $1
    `;
    const yearResult = await pool.query(yearQuery, [filters.year_id]);
    
    const classQuery = `
      SELECT c.name
      FROM class c
      WHERE c.id = $1
    `;
    const classResult = await pool.query(classQuery, [filters.class_id]);
    
    let groupName = '';
    if (filters.group_id) {
      const groupQuery = `
        SELECT sg.name
        FROM student_group sg
        WHERE sg.id = $1
      `;
      const groupResult = await pool.query(groupQuery, [filters.group_id]);
      groupName = groupResult.rows[0]?.name || '';
    }
    
    let sectionName = '';
    if (filters.section_id) {
      const sectionQuery = `
        SELECT sec.name
        FROM section sec
        WHERE sec.id = $1
      `;
      const sectionResult = await pool.query(sectionQuery, [filters.section_id]);
      sectionName = sectionResult.rows[0]?.name || '';
    }
    
    let shiftName = '';
    if (filters.shift_id) {
      const shiftQuery = `
        SELECT sh.name
        FROM shift sh
        WHERE sh.id = $1
      `;
      const shiftResult = await pool.query(shiftQuery, [filters.shift_id]);
      shiftName = shiftResult.rows[0]?.name || '';
    }
    
    return {
      exam_name: examResult.rows[0]?.class_exam_name || 'Exam',
      year: yearResult.rows[0]?.name || filters.year_id,
      class_name: classResult.rows[0]?.name || 'Class',
      group_name: groupName,
      section_name: sectionName,
      shift_name: shiftName,
      total_students: students.length,
    };
  }
}

export const tabulationReportService = new TabulationReportService();