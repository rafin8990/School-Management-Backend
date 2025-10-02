export interface ITabulationStudent {
  student_id: number;
  student_name_en: string;
  student_name_bn?: string;
  student_id_code: string;
  roll: number;
  class_name: string;
  group_name?: string;
  section_name?: string;
  shift_name?: string;
  subjects: ITabulationSubject[];
  total_marks: number;
  total_full_marks: number;
  grade: string;
  gpa: number;
  position: number;
  comment: string;
}

export interface ITabulationSubject {
  subject_id: number;
  subject_name: string;
  short_codes: ITabulationShortCode[];
  total_marks: number;
  full_marks: number;
  grade: string;
  gpa: number;
}

export interface ITabulationShortCode {
  short_code_id: number;
  short_code_name: string;
  obtained_marks: number;
  full_marks: number;
  pass_mark: number;
}

export interface ITabulationGradeSetup {
  grade_setup_id: number;
  grade_points: Array<{
    letter_grade: string;
    mark_point_first: number;
    mark_point_second: number;
    grade_point: number;
    note?: string;
  }>;
}

export interface ITabulationFilters {
  class_id: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
  student_id?: number;
  exam_id: number;
  year_id: number;
  merit_type: 'class_wise' | 'section_wise';
  sequential_order: 'Grade_TotalMark_Roll' | 'TotalMark_Grade_Roll' | 'TotalMark_Roll_Grade' | 'Roll_TotalMark_Grade';
  school_id: number;
}

export interface ITabulationResponse {
  school_info: {
    name: string;
    address: string;
    email?: string;
    website?: string;
  };
  report_info: {
    exam_name: string;
    year: number;
    class_name: string;
    group_name?: string;
    section_name?: string;
    shift_name?: string;
    merit_type?: string;
    total_students: number;
  };
  students: ITabulationStudent[];
  grade_setup: {
    grade_setup_id: number;
    grade_points: Array<{
      letter_grade: string;
      mark_point_first: number;
      mark_point_second: number;
      grade_point: number;
    }>;
  };
  sequential_exam?: {
    sequence: string;
  };
  signatures?: Array<{
    position: string;
    name: string;
    designation: string;
    signature_url?: string;
  }>;
}
