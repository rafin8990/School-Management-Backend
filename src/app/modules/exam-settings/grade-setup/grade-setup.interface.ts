export type IGradeSetup = {
  id?: number;
  exam_id: number;
  year_id?: number | null;
  class_id: number;
  school_id: number;
  created_at?: string;
  updated_at?: string;
};

export type IGradeSetupWithDetails = IGradeSetup & {
  exam?: {
    id: number;
    name: string;
  };
  year?: {
    id: number;
    year: number;
  };
  class?: {
    id: number;
    name: string;
  };
  grade_points?: IGradePointSetup[];
};

export type IGradePointSetup = {
  id?: number;
  grade_setup_id: number;
  mark_point_first: number;
  mark_point_second: number;
  grade_point?: number | null;
  letter_grade?: string | null;
  note?: string | null;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
};
