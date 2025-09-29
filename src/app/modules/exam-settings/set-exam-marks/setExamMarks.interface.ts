export type ISetExamMark = {
  id?: number;
  class_id: number;
  class_exam_id: number;
  year_id: number;
  subject_id: number;
  short_code_id: number;
  total_marks: number;
  countable_marks: number;
  pass_mark: number;
  acceptance: number;
  status: 'active' | 'inactive';
  school_id: number;
};

export type ISetExamMarkUpsertInput = {
  school_id: number;
  class_id: number;
  class_exam_ids: number[];
  year_id: number;
  entries: Array<{
    subject_id: number;
    short_code_id: number;
    total_marks: number;
    countable_marks: number;
    pass_mark: number;
    acceptance: number;
    status: 'active' | 'inactive';
  }>;
};


