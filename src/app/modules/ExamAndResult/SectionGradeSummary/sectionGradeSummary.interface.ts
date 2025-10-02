export interface ISectionGradeSummaryFilters {
  class_id?: number;
  group_id?: number;
  section_id?: number;
  exam_id: number;
  year_id: number;
  school_id: number;
}

export interface ISectionGradeRow {
  class_id: number;
  class_name: string;
  section_id: number | null;
  section_name: string;
  total_students: number;
  a_plus: number;
  a: number;
  a_minus: number;
  b: number;
  c: number;
  d: number;
  f: number;
}

export interface ISectionGradeSummaryResponse {
  school_info: { name: string; address: string; logo_url?: string; email?: string; website?: string };
  report_info: { exam_name: string; year: number };
  rows: ISectionGradeRow[];
}


