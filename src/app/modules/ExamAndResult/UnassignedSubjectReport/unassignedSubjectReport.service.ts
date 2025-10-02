import pool from '../../../../utils/dbClient';
import { IUnassignedSubjectFilters, IUnassignedSubjectResponse, IClassSubjectData, ISubjectData } from './unassignedSubjectReport.interface';

export const UnassignedSubjectReportService = {
  async generateUnassignedSubjectReport(filters: IUnassignedSubjectFilters): Promise<IUnassignedSubjectResponse> {
    try {
      // Get school information
      const schoolInfo = await this.getSchoolInfo(filters.school_id);
      
      // Get exam information
      const examInfo = await this.getExamInfo(filters.exam_id, filters.year_id, filters.school_id);
      
      // Get class subject data
      const classSubjectData = await this.getClassSubjectData(filters);
      
      // Calculate summary
      const summary = this.calculateSummary(classSubjectData);
      
      return {
        school_info: schoolInfo,
        report_info: {
          exam_name: examInfo.exam_name,
          year: examInfo.year,
          class_name: examInfo.class_name,
          group_name: examInfo.group_name,
          section_name: examInfo.section_name,
          shift_name: examInfo.shift_name,
        },
        class_subject_data: classSubjectData,
        summary,
      };
    } catch (error) {
      console.error('Error generating unassigned subject report:', error);
      throw error;
    }
  },

  async getSchoolInfo(schoolId: number) {
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
  },

  async getExamInfo(examId: number, yearId: number, schoolId: number) {
    try {
      const query = `
        SELECT 
          ce.class_exam_name as exam_name,
          ay.name as year,
          c.name as class_name,
          sg.name as group_name,
          sec.name as section_name,
          sh.name as shift_name
        FROM class_exam ce
        JOIN academic_year ay ON ay.id = $2
        LEFT JOIN class c ON c.id = (SELECT class_id FROM set_exam_marks WHERE class_exam_id = $1 AND school_id = $3 LIMIT 1)
        LEFT JOIN student_group sg ON sg.id = (SELECT group_id FROM set_exam_marks WHERE class_exam_id = $1 AND school_id = $3 LIMIT 1)
        LEFT JOIN section sec ON sec.id = (SELECT section_id FROM set_exam_marks WHERE class_exam_id = $1 AND school_id = $3 LIMIT 1)
        LEFT JOIN shift sh ON sh.id = (SELECT shift_id FROM set_exam_marks WHERE class_exam_id = $1 AND school_id = $3 LIMIT 1)
        WHERE ce.id = $1 AND ce.school_id = $3
      `;

      const result = await pool.query(query, [examId, yearId, schoolId]);

      if (result.rows.length > 0) {
        const exam = result.rows[0];
        return {
          exam_name: exam.exam_name || 'Exam',
          year: exam.year || yearId,
          class_name: exam.class_name,
          group_name: exam.group_name,
          section_name: exam.section_name,
          shift_name: exam.shift_name,
        };
      }

      return {
        exam_name: 'Exam',
        year: yearId,
        class_name: null,
        group_name: null,
        section_name: null,
        shift_name: null,
      };
    } catch (error) {
      console.error('Error fetching exam info:', error);
      return {
        exam_name: 'Exam',
        year: yearId,
        class_name: null,
        group_name: null,
        section_name: null,
        shift_name: null,
      };
    }
  },

  async getClassSubjectData(filters: IUnassignedSubjectFilters): Promise<IClassSubjectData[]> {
    try {
      // Build conditions for class filtering
      const conditions: string[] = ['cws.school_id = $1'];
      const values: any[] = [filters.school_id];
      let paramIndex = 2;

      if (filters.class_id) {
        conditions.push(`cws.class_id = $${paramIndex++}`);
        values.push(filters.class_id);
      }

      if (filters.group_id) {
        conditions.push(`cws.group_id = $${paramIndex++}`);
        values.push(filters.group_id);
      }

      // Get all classes with their subject assignments
      const classesQuery = `
        SELECT DISTINCT
          cws.class_id,
          c.name as class_name,
          cws.group_id,
          sg.name as group_name
        FROM class_wise_subject cws
        JOIN class c ON c.id = cws.class_id
        LEFT JOIN student_group sg ON sg.id = cws.group_id
        WHERE ${conditions.join(' AND ')}
        ORDER BY c.name, sg.name
      `;

      const classesResult = await pool.query(classesQuery, values);
      const classData: IClassSubjectData[] = [];

      for (const classRow of classesResult.rows) {
        // Get subjects assigned to this class
        const subjectsQuery = `
          SELECT 
            s.id as subject_id,
            s.name as subject_name,
            cs.serial_no
          FROM class_wise_subject cws
          JOIN class_subjects cs ON cs.class_wise_subject_id = cws.id
          JOIN subject s ON s.id = cs.subject_id
          WHERE cws.school_id = $1 
            AND cws.class_id = $2 
            AND (
              cws.group_id = $3 OR ($3 IS NULL AND cws.group_id IS NULL)
            )
            AND s.status = 'active'
          ORDER BY cs.serial_no
        `;

        const subjectsResult = await pool.query(subjectsQuery, [
          filters.school_id,
          classRow.class_id,
          classRow.group_id ?? null
        ]);

        const subjects: ISubjectData[] = [];
        let inputtedSubjects = 0;
        const remainingSubjectNames: string[] = [];

        for (const subject of subjectsResult.rows) {
          // Check if this subject has marks inputted for this exam and year
          // Count students with inputted marks for this subject
          const inputtedQuery = `
            SELECT COUNT(DISTINCT mi.student_id) as inputted_count
            FROM mark_input mi
            JOIN students s ON s.id = mi.student_id
            WHERE mi.school_id = $1
              AND mi.class_id = $2
              AND mi.subject_id = $3
              AND mi.exam_id = $4
              AND mi.year_id = $5
              AND s.status = 'active'
              AND s.disabled = false
              ${filters.section_id ? 'AND s.section_id = $6' : ''}
              ${filters.shift_id ? `AND s.shift_id = $${filters.section_id ? '7' : '6'}` : ''}
          `;

          const inputtedParams: any[] = [
            filters.school_id,
            classRow.class_id,
            subject.subject_id,
            filters.exam_id,
            filters.year_id,
          ];
          if (filters.section_id) inputtedParams.push(filters.section_id);
          if (filters.shift_id) inputtedParams.push(filters.shift_id);

          const inputtedResult = await pool.query(inputtedQuery, inputtedParams);
          const inputtedCount = Number(inputtedResult.rows[0]?.inputted_count || 0);

          // Count total eligible students for this class/group (and optional section/shift)
          const totalStudentsQuery = `
            SELECT COUNT(*) as total_students
            FROM students s
            WHERE s.school_id = $1
              AND s.class_id = $2
              AND s.status = 'active'
              AND s.disabled = false
              ${filters.section_id ? 'AND s.section_id = $3' : ''}
              ${filters.shift_id ? `AND s.shift_id = $${filters.section_id ? '4' : '3'}` : ''}
          `;

          const totalParams: any[] = [
            filters.school_id,
            classRow.class_id,
          ];
          if (filters.section_id) totalParams.push(filters.section_id);
          if (filters.shift_id) totalParams.push(filters.shift_id);

          const totalResult = await pool.query(totalStudentsQuery, totalParams);
          const totalStudents = Number(totalResult.rows[0]?.total_students || 0);

          const hasMarks = inputtedCount > 0;

          subjects.push({
            subject_id: subject.subject_id,
            subject_name: subject.subject_name,
            has_marks: hasMarks,
            inputted_count: inputtedCount,
            total_students: totalStudents,
          });

          if (!hasMarks) {
            remainingSubjectNames.push(subject.subject_name);
          } else {
            inputtedSubjects++;
          }
        }

        classData.push({
          class_id: classRow.class_id,
          class_name: classRow.class_name,
          group_id: classRow.group_id,
          group_name: classRow.group_name,
          section_id: undefined,
          section_name: undefined,
          shift_id: undefined,
          shift_name: undefined,
          total_subjects: subjects.length,
          inputted_subjects: inputtedSubjects,
          remaining_subjects: subjects.length - inputtedSubjects,
          remaining_subject_names: remainingSubjectNames,
          subjects,
        });
      }

      return classData;
    } catch (error) {
      console.error('Error fetching class subject data:', error);
      throw error;
    }
  },

  calculateSummary(classData: IClassSubjectData[]) {
    const totalClasses = classData.length;
    const completedClasses = classData.filter(c => c.remaining_subjects === 0).length;
    const pendingClasses = totalClasses - completedClasses;
    
    const totalSubjects = classData.reduce((sum, c) => sum + c.total_subjects, 0);
    const inputtedSubjects = classData.reduce((sum, c) => sum + c.inputted_subjects, 0);
    const remainingSubjects = totalSubjects - inputtedSubjects;

    return {
      total_classes: totalClasses,
      completed_classes: completedClasses,
      pending_classes: pendingClasses,
      total_subjects: totalSubjects,
      inputted_subjects: inputtedSubjects,
      remaining_subjects: remainingSubjects,
    };
  },
};
