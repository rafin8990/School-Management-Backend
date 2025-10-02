export type IGrade = {
  id?: number;
  mark_point_first: number;
  mark_point_second: number;
  grade_point?: number | null;
  letter_grade?: string | null;
  note?: string | null;
  school_id: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
};
