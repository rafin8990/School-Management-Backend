export interface IProgressReportFilters {
  class_id: number;
  exam_id: number;
  year_id: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
  student_id?: number;
  merit_type: 'class_wise' | 'section_wise';
  merit_order?: 'Grade_TotalMark_Roll' | 'TotalMark_Grade_Roll' | 'TotalMark_Roll_Grade' | 'Roll_TotalMark_Grade';
  school_id: number;
}

export interface IStudentProgressData {
  student_id: number;
  student_name_en: string;
  student_name_bn?: string;
  father_name_en: string;
  father_name_bn?: string;
  mother_name_en: string;
  mother_name_bn?: string;
  student_id_code: string;
  roll: number;
  class_name: string;
  group_name?: string;
  section_name?: string;
  shift_name?: string;
  exam_name: string;
  year: number;
  photo_url?: string;
  subjects: ISubjectProgressData[];
  total_marks: number;
  total_full_marks: number;
  gpa: number;
  grade: string;
  position: number;
  previous_roll: number;
  new_roll: number;
  comment: string;
}

export interface ISubjectProgressData {
  subject_id: number;
  subject_name: string;
  short_codes: IShortCodeProgressData[];
  total_marks: number;
  full_marks: number;
  grade: string;
  gpa: number;
  highest_marks: number;
}

export interface IShortCodeProgressData {
  short_code_id: number;
  short_code_name: string;
  obtained_marks: number;
  full_marks: number;
  pass_mark: number;
}

export interface IGradeSetupData {
  grade_setup_id: number;
  grade_points: Array<{
    mark_point_first: number;
    mark_point_second: number;
    letter_grade: string;
    grade_point: number;
    note?: string;
  }>;
}

export interface ISequentialExamData {
  sequence: 'Grade_TotalMark_Roll' | 'TotalMark_Grade_Roll' | 'TotalMark_Roll_Grade' | 'Roll_TotalMark_Grade';
}

export interface IProgressReportResponse {
  students: IStudentProgressData[];
  grade_setup: IGradeSetupData;
  sequential_exam: ISequentialExamData;
  school_info: {
    name: string;
    name_bn?: string;
    address: string;
    logo_url?: string;
  };
  report_info: {
    exam_name: string;
    year: number;
    class_name: string;
    group_name?: string;
    section_name?: string;
    merit_type: string;
  };
  signatures: Array<{
    position: 'left' | 'middle' | 'right';
    name: string;
    designation: string;
    signature_url?: string;
  }>;
}
