export type IMarkInput = {
  id?: number;
  student_id: number;
  class_id: number;
  group_id?: number | null;
  section_id?: number | null;
  shift_id?: number | null;
  subject_id: number;
  exam_id: number;
  year_id: number;
  full_mark?: number | null;
  total_mark?: number | null;
  grade?: string | null;
  gpa?: number | null;
  status: 'absent' | 'present';
  short_code_marks: Record<string, number>; // JSON object with shortcode as key and marks as value
  school_id: number;
  created_at?: string;
  updated_at?: string;
};

export type IMarkInputFilters = {
  searchTerm?: string;
  student_id?: number;
  class_id?: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
  subject_id?: number;
  exam_id?: number;
  year_id?: number;
  status?: 'absent' | 'present';
  school_id?: number;
};

export type IMarkInputSearchParams = {
  class_id: number;
  subject_id: number;
  exam_id: number;
  year_id: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
  category_id?: number;
  school_id: number;
};

export type IMarkInputStudentData = {
  student_id: number;
  student_name_en: string;
  student_id_code: string;
  roll: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
  class_name: string;
  subject_name: string;
  short_codes: Array<{
    short_code_id: number;
    short_code_name: string;
    view_position?: number;
    total_marks: number;
    pass_mark: number;
    acceptance: number;
  }>;
  existing_marks?: IMarkInput;
};

export type IMarkInputSaveData = {
  student_id: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
  full_mark: number;
  short_code_marks: Record<string, number>;
  status: 'absent' | 'present';
  total_mark: number;
  grade: string;
  gpa: number;
};

export type IMarkInputBulkSave = {
  class_id: number;
  subject_id: number;
  exam_id: number;
  year_id: number;
  school_id: number;
  marks_data: IMarkInputSaveData[];
};

export type IGradeSetup = {
  id: number;
  class_id: number;
  exam_id: number;
  school_id: number;
  grade_points: Array<{
    mark_point_first: number;
    mark_point_second: number;
    grade: string;
    gpa: number;
  }>;
};

export type IMarkInputDeleteBySubjectWise = {
  class_id: number;
  subject_id: number;
  exam_id: number;
  year_id: number;
  school_id: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
};

export type IMarkInputDeleteResult = {
  deleted_count: number;
  message: string;
};
