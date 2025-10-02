import pool from '../../../../utils/dbClient';
import { ITabulationResponse, ITabulationStudent, ITabulationFilters } from './tabulationReport.interface';
import { ProgressReportService } from '../ProgressReport/progressReport.service';

class TabulationFormat3Service {
  async getTabulationFormat3Report(filters: ITabulationFilters): Promise<ITabulationResponse> {
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
      
      // Convert progress report data to tabulation format 3
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
        gpa: student.gpa,
        grade: student.grade,
        position: student.position,
        previous_roll: student.previous_roll,
        new_roll: student.new_roll,
        comment: student.comment,
      }));

      // Get school information
      const schoolInfo = await this.getSchoolInfo(filters.school_id);

      return {
        students,
        grade_setup: progressReportData.grade_setup,
        sequential_exam: progressReportData.sequential_exam,
        school_info: schoolInfo,
        report_info: {
          exam_name: progressReportData.report_info?.exam_name || 'N/A',
          year: progressReportData.report_info?.year || new Date().getFullYear(),
          class_name: progressReportData.report_info?.class_name || 'N/A',
          group_name: progressReportData.report_info?.group_name || 'N/A',
          section_name: progressReportData.report_info?.section_name || 'N/A',
          merit_type: progressReportData.report_info?.merit_type || 'class_wise',
          total_students: students.length,
        },
        signatures: progressReportData.signatures || [],
      };
    } catch (error) {
      console.error('Error generating tabulation format 3 report:', error);
      throw error;
    }
  }

  private async getSchoolInfo(schoolId: number) {
    try {
      const query = `
        SELECT 
          name,
          address,
          logo,
          email,
          website
        FROM school 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [schoolId]);
      
      if (result.rows.length > 0) {
        const school = result.rows[0];
        return {
          name: school.name || 'School Name',
          address: school.address || 'School Address',
          logo_url: school.logo || null,
          email: school.email || null,
          website: school.website || null,
        };
      }
      
      return {
        name: 'School Name',
        address: 'School Address',
        logo_url: null,
        email: null,
        website: null,
      };
    } catch (error) {
      console.error('Error fetching school info:', error);
      return {
        name: 'School Name',
        address: 'School Address',
        logo_url: null,
        email: null,
        website: null,
      };
    }
  }
}

export default new TabulationFormat3Service();
