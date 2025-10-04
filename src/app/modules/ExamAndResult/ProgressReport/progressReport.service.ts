import pool from '../../../../utils/dbClient';
import { IProgressReportFilters, IProgressReportResponse, IStudentProgressData, ISubjectProgressData, IShortCodeProgressData, IGradeSetupData, ISequentialExamData } from './progressReport.interface';

export const ProgressReportService = {
  async generateProgressReport(filters: IProgressReportFilters): Promise<IProgressReportResponse> {
    try {
      // Get school information
      const schoolInfo = await this.getSchoolInfo(filters.school_id);
      
      // Get grade setup
      const gradeSetup = await this.getGradeSetup(filters.class_id, filters.exam_id, filters.year_id, filters.school_id);
      
      // Get sequential exam order
      const sequentialExam = await this.getSequentialExamOrder(filters.class_id, filters.exam_id, filters.school_id);
      
      // Get students data with marks
      const students = await this.getStudentsWithMarks(filters, gradeSetup);
      
      // Get signatures
      const signatures = await this.getSignatures(filters.school_id);
      
      // Calculate merit positions
      const studentsWithPositions = this.calculateMeritPositions(students, filters.merit_type, filters.merit_order || sequentialExam.sequence);
      
      return {
        students: studentsWithPositions,
        grade_setup: gradeSetup,
        sequential_exam: sequentialExam,
        school_info: schoolInfo,
        report_info: {
          exam_name: students[0]?.exam_name || '',
          // Prefer the actual academic year value from joined data if available
          year: students[0]?.year ?? filters.year_id,
          class_name: students[0]?.class_name || '',
          group_name: students[0]?.group_name,
          section_name: students[0]?.section_name,
          merit_type: filters.merit_type,
        },
        signatures,
      };
    } catch (error) {
      console.error('Error generating progress report:', error);
      throw error;
    }
  },

  async getStudentsForProgressReport(filters: Omit<IProgressReportFilters, 'student_id'>) {
    const query = `
      SELECT DISTINCT 
        s.id as student_id,
        s.student_name_en,
        s.student_id as student_id_code,
        s.roll,
        c.name as class_name,
        sg.name as group_name,
        sec.name as section_name,
        sh.name as shift_name
      FROM students s
      JOIN class c ON s.class_id = c.id
      LEFT JOIN student_group sg ON s.group_id = sg.id
      LEFT JOIN section sec ON s.section_id = sec.id
      LEFT JOIN shift sh ON s.shift_id = sh.id
      WHERE s.class_id = $1 
        AND s.school_id = $2
        ${filters.group_id ? 'AND s.group_id = $3' : ''}
        ${filters.section_id ? `AND s.section_id = $${filters.group_id ? '4' : '3'}` : ''}
        ${filters.shift_id ? `AND s.shift_id = $${filters.group_id && filters.section_id ? '5' : filters.group_id || filters.section_id ? '4' : '3'}` : ''}
      ORDER BY s.roll
    `;
    
    const params = [filters.class_id, filters.school_id];
    if (filters.group_id) params.push(filters.group_id);
    if (filters.section_id) params.push(filters.section_id);
    if (filters.shift_id) params.push(filters.shift_id);
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getGradeSetupForProgressReport(classId: number, examId: number, yearId: number, schoolId: number): Promise<IGradeSetupData> {
    return await this.getGradeSetup(classId, examId, yearId, schoolId);
  },


  async getSchoolInfo(schoolId: number) {
    const query = `
      SELECT name, address, logo AS logo_url
      FROM school
      WHERE id = $1
    `;
    const result = await pool.query(query, [schoolId]);
    return result.rows[0] || { name: 'School Name', address: 'School Address' };
  },

  async getGradeSetup(classId: number, examId: number, yearId: number, schoolId: number): Promise<IGradeSetupData> {
    // First try to get custom grade setup
    const gradeSetupQuery = `
      SELECT gs.id as grade_setup_id
      FROM grade_setup gs
      WHERE gs.class_id = $1 
        AND gs.exam_id = $2 
        AND (gs.year_id = $3 OR gs.year_id IS NULL)
        AND gs.school_id = $4
      ORDER BY gs.year_id DESC NULLS LAST
      LIMIT 1
    `;
    
    const gradeSetupResult = await pool.query(gradeSetupQuery, [classId, examId, yearId, schoolId]);
    
    if (gradeSetupResult.rows.length > 0) {
      const gradeSetupId = gradeSetupResult.rows[0].grade_setup_id;
      
      // Get grade points for this setup
      const gradePointsQuery = `
        SELECT mark_point_first, mark_point_second, letter_grade, grade_point, note
        FROM grade_point_setup
        WHERE grade_setup_id = $1 AND status = 'active'
        ORDER BY mark_point_first DESC
      `;
      
      const gradePointsResult = await pool.query(gradePointsQuery, [gradeSetupId]);
      
      // If no grade points found, use default percentage-based setup
      if (gradePointsResult.rows.length === 0) {
        return {
          grade_setup_id: 0,
          grade_points: [
            { mark_point_first: 80, mark_point_second: 100, letter_grade: 'A+', grade_point: 5, note: '' },
            { mark_point_first: 70, mark_point_second: 79, letter_grade: 'A', grade_point: 4, note: '' },
            { mark_point_first: 60, mark_point_second: 69, letter_grade: 'A-', grade_point: 3.5, note: '' },
            { mark_point_first: 50, mark_point_second: 59, letter_grade: 'B', grade_point: 3, note: '' },
            { mark_point_first: 40, mark_point_second: 49, letter_grade: 'C', grade_point: 2, note: '' },
            { mark_point_first: 33, mark_point_second: 39, letter_grade: 'D', grade_point: 1, note: '' },
            { mark_point_first: 0, mark_point_second: 32, letter_grade: 'F', grade_point: 0, note: '' },
          ],
        };
      }
      
      return {
        grade_setup_id: gradeSetupId,
        grade_points: gradePointsResult.rows,
      };
    }
    
    // Return default percentage-based grade setup if no custom setup found
    return {
      grade_setup_id: 0,
      grade_points: [
        { mark_point_first: 80, mark_point_second: 100, letter_grade: 'A+', grade_point: 5, note: '' },
        { mark_point_first: 70, mark_point_second: 79, letter_grade: 'A', grade_point: 4, note: '' },
        { mark_point_first: 60, mark_point_second: 69, letter_grade: 'A-', grade_point: 3.5, note: '' },
        { mark_point_first: 50, mark_point_second: 59, letter_grade: 'B', grade_point: 3, note: '' },
        { mark_point_first: 40, mark_point_second: 49, letter_grade: 'C', grade_point: 2, note: '' },
        { mark_point_first: 33, mark_point_second: 39, letter_grade: 'D', grade_point: 1, note: '' },
        { mark_point_first: 0, mark_point_second: 32, letter_grade: 'F', grade_point: 0, note: '' },
      ],
    };
  },

  async getSequentialExamOrder(classId: number, examId: number, schoolId: number): Promise<ISequentialExamData> {
    const query = `
      SELECT sequence
      FROM sequential_exam
      WHERE class_id = $1 AND exam_id = $2 AND school_id = $3
    `;
    
    const result = await pool.query(query, [classId, examId, schoolId]);
    
    if (result.rows.length > 0) {
      return { sequence: result.rows[0].sequence };
    }
    
    // Return default sequence
    return { sequence: 'Grade_TotalMark_Roll' };
  },

  async getStudentsWithMarks(filters: IProgressReportFilters, gradeSetup: IGradeSetupData): Promise<IStudentProgressData[]> {
    let whereClause = `
      WHERE s.class_id = $1 
        AND s.school_id = $2
        AND mi.exam_id = $3
        AND mi.year_id = $4
    `;
    
    const params = [filters.class_id, filters.school_id, filters.exam_id, filters.year_id];
    let paramIndex = 5;
    
    if (filters.group_id) {
      whereClause += ` AND s.group_id = $${paramIndex}`;
      params.push(filters.group_id);
      paramIndex++;
    }
    
    if (filters.section_id) {
      whereClause += ` AND s.section_id = $${paramIndex}`;
      params.push(filters.section_id);
      paramIndex++;
    }
    
    if (filters.shift_id) {
      whereClause += ` AND s.shift_id = $${paramIndex}`;
      params.push(filters.shift_id);
      paramIndex++;
    }
    
    if (filters.student_id) {
      whereClause += ` AND s.id = $${paramIndex}`;
      params.push(filters.student_id);
      paramIndex++;
    }

    const query = `
      SELECT DISTINCT ON (s.id, sub.id)
        s.id as student_id,
        s.student_name_en,
        s.student_name_bn,
        s.father_name_en,
        s.father_name_bn,
        s.mother_name_en,
        s.mother_name_bn,
        s.student_id as student_id_code,
        s.roll,
        s.student_photo as photo_url,
        c.name as class_name,
        sg.name as group_name,
        sec.name as section_name,
        sh.name as shift_name,
        ce.class_exam_name as exam_name,
        ay.name as year,
        sub.id as subject_id,
        sub.name as subject_name,
        mi.total_mark,
        mi.grade,
        mi.gpa,
        mi.short_code_marks,
        mi.status,
        mi.full_mark as full_marks,
        sem.countable_marks,
        sem.pass_mark,
        sem.acceptance
      FROM students s
      JOIN class c ON s.class_id = c.id
      LEFT JOIN student_group sg ON s.group_id = sg.id
      LEFT JOIN section sec ON s.section_id = sec.id
      LEFT JOIN shift sh ON s.shift_id = sh.id
      JOIN class_exam ce ON ce.id = $3
      JOIN academic_year ay ON ay.id = $4
      JOIN mark_input mi ON mi.student_id = s.id AND mi.exam_id = $3 AND mi.year_id = $4
      JOIN subject sub ON mi.subject_id = sub.id
      LEFT JOIN set_exam_marks sem ON sem.class_id = s.class_id 
        AND sem.class_exam_id = $3 
        AND sem.year_id = $4 
        AND sem.subject_id = sub.id
        AND sem.school_id = $2
      ${whereClause}
      ORDER BY s.id, sub.id, mi.id DESC
    `;

    const result = await pool.query(query, params);
    
    // Get short code names mapping
    const shortCodeNamesQuery = `
      SELECT id, name 
      FROM short_codes 
      WHERE school_id = $1 AND status = 'active'
    `;
    const shortCodeNamesResult = await pool.query(shortCodeNamesQuery, [filters.school_id]);
    const shortCodeNamesMap = new Map<number, string>();
    shortCodeNamesResult.rows.forEach(row => {
      shortCodeNamesMap.set(row.id, row.name);
    });
    
    // Get short code specific full marks mapping
    const shortCodeFullMarksQuery = `
      SELECT short_code_id, total_marks, pass_mark
      FROM set_exam_marks 
      WHERE school_id = $1 AND class_id = $2 AND class_exam_id = $3 AND year_id = $4
    `;
    const shortCodeFullMarksResult = await pool.query(shortCodeFullMarksQuery, [
      filters.school_id, 
      filters.class_id, 
      filters.exam_id, 
      filters.year_id
    ]);
    const shortCodeFullMarksMap = new Map<number, { total_marks: number; pass_mark: number }>();
    shortCodeFullMarksResult.rows.forEach(row => {
      shortCodeFullMarksMap.set(row.short_code_id, {
        total_marks: row.total_marks,
        pass_mark: row.pass_mark
      });
    });
    
    // Group by student and then by subject
    const studentMap = new Map<number, IStudentProgressData>();
    const subjectMap = new Map<string, ISubjectProgressData>(); // Key: studentId_subjectId
    
    for (const row of result.rows) {
      if (!studentMap.has(row.student_id)) {
        studentMap.set(row.student_id, {
          student_id: row.student_id,
          student_name_en: row.student_name_en,
          student_name_bn: row.student_name_bn,
          father_name_en: row.father_name_en,
          father_name_bn: row.father_name_bn,
          mother_name_en: row.mother_name_en,
          mother_name_bn: row.mother_name_bn,
          student_id_code: row.student_id_code,
          roll: row.roll,
          class_name: row.class_name,
          group_name: row.group_name,
          section_name: row.section_name,
          shift_name: row.shift_name,
          exam_name: row.exam_name,
          year: row.year,
          photo_url: row.photo_url,
          subjects: [],
          total_marks: 0,
          total_full_marks: 0,
          gpa: 0,
          grade: '',
          position: 0,
          previous_roll: row.roll,
          new_roll: row.roll,
          comment: '', // Added to satisfy IStudentProgressData interface
        });
      }
      
      const student = studentMap.get(row.student_id)!;
      const subjectKey = `${row.student_id}_${row.subject_id}`;
      
      // Process short codes - use the actual names from the mapping
      const shortCodes: IShortCodeProgressData[] = [];
      if (row.short_code_marks && typeof row.short_code_marks === 'object') {
        // Use a Set to track processed short codes to avoid duplicates
        const processedShortCodes = new Set<number>();
        
        for (const [shortCodeId, marks] of Object.entries(row.short_code_marks)) {
          const shortCodeIdNum = Number(shortCodeId) || 0;
          
          // Skip if this short code was already processed
          if (processedShortCodes.has(shortCodeIdNum)) {
            continue;
          }
          
          processedShortCodes.add(shortCodeIdNum);
          const shortCodeName = shortCodeNamesMap.get(shortCodeIdNum) || `Code ${shortCodeId}`;
          
          // Get full marks and pass mark for this specific short code
          const shortCodeData = shortCodeFullMarksMap.get(shortCodeIdNum) || { total_marks: 0, pass_mark: 0 };
          
          shortCodes.push({
            short_code_id: shortCodeIdNum,
            short_code_name: shortCodeName,
            obtained_marks: Number(marks) || 0,
            full_marks: shortCodeData.total_marks, // Full marks for this specific short code
            pass_mark: shortCodeData.pass_mark, // Pass mark for this specific short code
          });
        }
      }
      
      if (subjectMap.has(subjectKey)) {
        // Subject already exists, just add the new short codes (no duplicates expected now)
        const existingSubject = subjectMap.get(subjectKey)!;
        
        // Add new short codes to existing subject
        existingSubject.short_codes.push(...shortCodes);
        
        // Recalculate totals from all short codes
        existingSubject.total_marks = existingSubject.short_codes.reduce((sum, sc) => sum + (sc.obtained_marks || 0), 0);
        const calculatedFullMarks = existingSubject.short_codes.reduce((sum, sc) => sum + (sc.full_marks || 0), 0);
        
        // Use the full_mark from mark_input if available, otherwise use calculated value
        existingSubject.full_marks = row.full_marks || calculatedFullMarks;
        
        // Recalculate grade and GPA for this subject
        const subjectGradeResult = this.calculateSubjectGrade(existingSubject.total_marks, existingSubject.full_marks, gradeSetup, existingSubject.short_codes, 1);
        existingSubject.grade = subjectGradeResult.grade;
        existingSubject.gpa = subjectGradeResult.gpa;
      } else {
        // New subject, create it
        const totalFullMarks = shortCodes.reduce((sum, sc) => sum + (sc.full_marks || 0), 0);
        const totalObtainedMarks = shortCodes.reduce((sum, sc) => sum + (sc.obtained_marks || 0), 0);
        
        // Use the full_mark from mark_input if available, otherwise calculate from short codes
        const subjectFullMarks = row.full_marks || totalFullMarks;
        
        // Calculate grade and GPA for this subject
        const subjectGradeResult = this.calculateSubjectGrade(totalObtainedMarks, subjectFullMarks, gradeSetup, shortCodes, 1);
        
        const subjectData: ISubjectProgressData = {
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          short_codes: shortCodes,
          total_marks: totalObtainedMarks,
          full_marks: subjectFullMarks,
          grade: subjectGradeResult.grade,
          gpa: subjectGradeResult.gpa,
          highest_marks: 0, // Will be calculated later
        };
        
        subjectMap.set(subjectKey, subjectData);
        student.subjects.push(subjectData);
      }
    }
    
    // Calculate totals and grades for each student
    for (const student of studentMap.values()) {
      let totalMarks = 0;
      let totalFullMarks = 0;
      let totalGpa = 0;
      let subjectCount = 0;
      let hasFailedAnySubject = false;
      
      for (const subject of student.subjects) {
        totalMarks += Number(subject.total_marks) || 0;
        totalFullMarks += Number(subject.full_marks) || 0;
        totalGpa += Number(subject.gpa) || 0;
        subjectCount++;
        
        // Check if student failed this subject (grade is F)
        if (subject.grade === 'F') {
          hasFailedAnySubject = true;
        }
      }
      
      student.total_marks = Number(totalMarks) || 0;
      student.total_full_marks = Number(totalFullMarks) || 0;
      
      // If failed any subject, total grade is F and GPA is 0
      if (hasFailedAnySubject) {
        student.grade = 'F';
        student.gpa = 0;
        student.comment = 'Failed in one or more subjects. Please work harder.';
      } else {
        // Calculate grade based on total marks percentage
        if (totalFullMarks > 0) {
          const totalMarksNum = Number(totalMarks) || 0;
          const totalFullMarksNum = Number(totalFullMarks) || 0;
          const totalPercentage = (totalMarksNum / totalFullMarksNum) * 100;
          
          // Find the appropriate grade based on total percentage
          let foundGrade = false;
          for (const gradePoint of gradeSetup.grade_points) {
            if (totalPercentage >= gradePoint.mark_point_first && totalPercentage <= gradePoint.mark_point_second) {
              student.grade = gradePoint.letter_grade;
              student.gpa = Number(gradePoint.grade_point) || 0;
              student.comment = gradePoint.note || this.getDefaultComment(gradePoint.letter_grade);
              foundGrade = true;
              break;
            }
          }
          
          if (!foundGrade) {
            student.grade = 'F';
            student.gpa = 0;
            student.comment = 'Needs significant improvement. Please work harder.';
          }
        } else {
          student.grade = 'F';
          student.gpa = 0;
          student.comment = 'Needs significant improvement. Please work harder.';
        }
      }
      
      // Ensure GPA is properly set as number
      student.gpa = Number(student.gpa) || 0;
    }
    
    return Array.from(studentMap.values());
  },

  calculateSubjectGrade(obtainedMarks: number, fullMarks: number, gradeSetup: IGradeSetupData, shortCodes: IShortCodeProgressData[] = [], subjectCount: number = 1): { grade: string; gpa: number } {
    // Convert to numbers to ensure proper calculation
    const obtained = Number(obtainedMarks) || 0;
    const full = Number(fullMarks) || 0;
    
    // If no marks obtained or full marks is 0, return F grade with 0 GPA
    if (obtained <= 0 || full <= 0) {
      return { grade: 'F', gpa: 0 };
    }
    
    // Calculate pass marks for each short code (countable marks / 3)
    const calculatePercentageBasedPassMark = (totalMarks: number): number => {
      const rawPass = totalMarks / 3;
      const fractional = rawPass - Math.floor(rawPass);
      
      // If fractional part is >= 0.5, round up (ceil), otherwise round down (floor)
      if (fractional >= 0.5) {
        return Math.ceil(rawPass);
      } else {
        return Math.floor(rawPass);
      }
    };

    // Check if student failed any short code using percentage-based pass marks
    let hasFailedShortCode = false;
    for (const shortCode of shortCodes) {
      const totalMarks = Number(shortCode.full_marks) || 0;
      const passMark = calculatePercentageBasedPassMark(totalMarks);
      const obtainedMark = Number(shortCode.obtained_marks) || 0;
      if (obtainedMark < passMark) {
        hasFailedShortCode = true;
        break;
      }
    }
    
    // If failed any short code, return F grade with 0 GPA
    if (hasFailedShortCode) {
      return { grade: 'F', gpa: 0 };
    }
    
    // Calculate percentage: (obtainedMarks / fullMarks) * 100
    const percentage = (obtained / full) * 100;
    
    // Find the appropriate grade based on percentage
    for (const gradePoint of gradeSetup.grade_points) {
      if (percentage >= gradePoint.mark_point_first && percentage <= gradePoint.mark_point_second) {
        return {
          grade: gradePoint.letter_grade,
          gpa: Number(gradePoint.grade_point) || 0
        };
      }
    }
    
    // If no grade found, return F grade with 0 GPA
    return { grade: 'F', gpa: 0 };
  },

  calculateGradeFromGPA(gpa: number, gradeSetup: IGradeSetupData): { grade: string; comment: string } {
    // Sort grade points by grade_point in descending order (highest first)
    const sortedGradePoints = [...gradeSetup.grade_points].sort((a, b) => b.grade_point - a.grade_point);
    
    for (const gradePoint of sortedGradePoints) {
      if (gpa >= gradePoint.grade_point) {
        return {
          grade: gradePoint.letter_grade,
          comment: gradePoint.note || this.getDefaultComment(gradePoint.letter_grade)
        };
      }
    }
    return {
      grade: 'F',
      comment: 'Needs improvement'
    };
  },

  calculateGrade(gpa: number, gradeSetup: IGradeSetupData): { grade: string; comment: string } {
    for (const gradePoint of gradeSetup.grade_points) {
      if (gpa >= gradePoint.grade_point) {
        return {
          grade: gradePoint.letter_grade,
          comment: gradePoint.note || this.getDefaultComment(gradePoint.letter_grade)
        };
      }
    }
    return {
      grade: 'F',
      comment: 'Needs improvement'
    };
  },

  getDefaultComment(grade: string): string {
    const comments: { [key: string]: string } = {
      'A+': 'Outstanding performance! Keep up the excellent work.',
      'A': 'Excellent work! You are doing very well.',
      'A-': 'Very good performance. Keep it up!',
      'B': 'Good work. There is room for improvement.',
      'C': 'Satisfactory performance. Try to improve.',
      'D': 'Below average. Focus on your studies.',
      'F': 'Needs significant improvement. Please work harder.'
    };
    return comments[grade] || 'Please work on your studies.';
  },

  calculateMeritPositions(students: IStudentProgressData[], meritType: 'class_wise' | 'section_wise', sequence: string): IStudentProgressData[] {
    if (meritType === 'section_wise') {
      // Group students by section and calculate positions within each section
      const sectionGroups = new Map<string, IStudentProgressData[]>();
      
      students.forEach(student => {
        const sectionKey = student.section_name || 'No Section';
        if (!sectionGroups.has(sectionKey)) {
          sectionGroups.set(sectionKey, []);
        }
        sectionGroups.get(sectionKey)!.push(student);
      });
      
      // Sort each section group
      const allSortedStudents: IStudentProgressData[] = [];
      sectionGroups.forEach(sectionStudents => {
        const sortedSectionStudents = [...sectionStudents].sort((a, b) => {
          switch (sequence) {
            case 'Grade_TotalMark_Roll':
              return this.compareByGradeTotalMarkRoll(a, b);
            case 'TotalMark_Grade_Roll':
              return this.compareByTotalMarkGradeRoll(a, b);
            case 'TotalMark_Roll_Grade':
              return this.compareByTotalMarkRollGrade(a, b);
            case 'Roll_TotalMark_Grade':
              return this.compareByRollTotalMarkGrade(a, b);
            default:
              return this.compareByGradeTotalMarkRoll(a, b);
          }
        });
        
        // Assign positions within section
        sortedSectionStudents.forEach((student, index) => {
          student.position = index + 1;
          student.new_roll = index + 1;
        });
        
        allSortedStudents.push(...sortedSectionStudents);
      });
      
      return allSortedStudents;
    } else {
      // Class-wise: sort all students together
      const sortedStudents = [...students].sort((a, b) => {
        switch (sequence) {
          case 'Grade_TotalMark_Roll':
            return this.compareByGradeTotalMarkRoll(a, b);
          case 'TotalMark_Grade_Roll':
            return this.compareByTotalMarkGradeRoll(a, b);
          case 'TotalMark_Roll_Grade':
            return this.compareByTotalMarkRollGrade(a, b);
          case 'Roll_TotalMark_Grade':
            return this.compareByRollTotalMarkGrade(a, b);
          default:
            return this.compareByGradeTotalMarkRoll(a, b);
        }
      });
      
      // Assign positions
      sortedStudents.forEach((student, index) => {
        student.position = index + 1;
        student.new_roll = index + 1;
      });
      
      return sortedStudents;
    }
  },

  compareByGradeTotalMarkRoll(a: IStudentProgressData, b: IStudentProgressData): number {
    // First by grade (higher grade first)
    const gradeOrder = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];
    const gradeComparison = gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    if (gradeComparison !== 0) return gradeComparison;
    
    // Then by total marks (higher first)
    if (b.total_marks !== a.total_marks) return b.total_marks - a.total_marks;
    
    // Finally by roll (lower first)
    return a.previous_roll - b.previous_roll;
  },

  compareByTotalMarkGradeRoll(a: IStudentProgressData, b: IStudentProgressData): number {
    // First by total marks (higher first)
    if (b.total_marks !== a.total_marks) return b.total_marks - a.total_marks;
    
    // Then by grade
    const gradeOrder = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];
    const gradeComparison = gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    if (gradeComparison !== 0) return gradeComparison;
    
    // Finally by roll
    return a.previous_roll - b.previous_roll;
  },

  compareByTotalMarkRollGrade(a: IStudentProgressData, b: IStudentProgressData): number {
    // First by total marks
    if (b.total_marks !== a.total_marks) return b.total_marks - a.total_marks;
    
    // Then by roll
    if (a.previous_roll !== b.previous_roll) return a.previous_roll - b.previous_roll;
    
    // Finally by grade
    const gradeOrder = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];
    return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
  },

  compareByRollTotalMarkGrade(a: IStudentProgressData, b: IStudentProgressData): number {
    // First by roll
    if (a.previous_roll !== b.previous_roll) return a.previous_roll - b.previous_roll;
    
    // Then by total marks
    if (b.total_marks !== a.total_marks) return b.total_marks - a.total_marks;
    
    // Finally by grade
    const gradeOrder = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];
    return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
  },

  async getSignatures(schoolId: number) {
    const query = `
      SELECT 
        s.name,
        s.image as signature_url,
        ss.position
      FROM signature s
      JOIN set_signature ss ON s.id = ss.signature_id
      JOIN report r ON ss.report_id = r.id
      WHERE s.school_id = $1 
        AND ss.status = 'active'
        AND r.status = 'active'
      ORDER BY ss.position
    `;
    
    const result = await pool.query(query, [schoolId]);
    return result.rows.map(row => ({
      position: row.position,
      name: row.name,
      designation: 'Signature', // Default designation since column doesn't exist
      signature_url: row.signature_url,
    }));
  },
};
