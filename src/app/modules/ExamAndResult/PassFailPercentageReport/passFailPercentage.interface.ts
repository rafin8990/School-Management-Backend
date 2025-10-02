export interface IPassFailPercentageFilters {
  class_id?: number;
  group_id?: number;
  section_id?: number;
  exam_id: number;
  year_id: number;
  school_id: number;
}

export interface ISectionStatRow {
  class_id: number;
  class_name: string;
  section_id?: number | null;
  section_name: string;
  total_students: number;
  appeared: number;
  pass: number;
  fail: number;
  absent: number;
}

export interface IPassFailPercentageResponse {
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
  };
  rows: ISectionStatRow[];
}



