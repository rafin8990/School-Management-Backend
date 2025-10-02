export type ISequentialExam = {
  id?: number;
  class_id: number;
  exam_id: number;
  sequence: 'Grade_TotalMark_Roll' | 'TotalMark_Grade_Roll' | 'TotalMark_Roll_Grade' | 'Roll_TotalMark_Grade';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};


