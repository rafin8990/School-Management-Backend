export interface IUnassignedSubjectFilters {
  class_id?: number;
  group_id?: number;
  section_id?: number;
  shift_id?: number;
  exam_id: number;
  year_id: number;
  school_id: number;
}

export interface IClassSubjectData {
  class_id: number;
  class_name: string;
  group_id?: number;
  group_name?: string;
  section_id?: number;
  section_name?: string;
  shift_id?: number;
  shift_name?: string;
  total_subjects: number;
  inputted_subjects: number;
  remaining_subjects: number;
  remaining_subject_names: string[];
  subjects: ISubjectData[];
}

export interface ISubjectData {
  subject_id: number;
  subject_name: string;
  has_marks: boolean;
  inputted_count: number;
  total_students: number;
}

export interface IUnassignedSubjectResponse {
  school_info: {
    name: string;
    address: string;
    email?: string;
    website?: string;
    logo_url?: string;
  };
  report_info: {
    exam_name: string;
    year: number;
    class_name?: string;
    group_name?: string;
    section_name?: string;
    shift_name?: string;
  };
  class_subject_data: IClassSubjectData[];
  summary: {
    total_classes: number;
    completed_classes: number;
    pending_classes: number;
    total_subjects: number;
    inputted_subjects: number;
    remaining_subjects: number;
  };
}
