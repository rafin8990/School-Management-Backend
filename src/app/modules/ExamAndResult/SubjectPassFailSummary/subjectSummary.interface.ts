export interface ISubjectSummaryFilters {
  class_id?: number;
  group_id?: number;
  section_id?: number;
  exam_id: number;
  year_id: number;
  school_id: number;
}

export interface ISubjectSummaryRow {
  subject_id: number;
  subject_name: string;
  total_students: number;
  appeared: number;
  pass: number;
  fail: number;
  absent: number;
}

export interface ISubjectSummaryResponse {
  school_info: { name: string; address: string; email?: string; website?: string; logo_url?: string };
  report_info: { class_name?: string; group_name?: string; section_name?: string; exam_name: string; year: number };
  rows: ISubjectSummaryRow[];
}


