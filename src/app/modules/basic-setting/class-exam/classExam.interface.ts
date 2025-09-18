export type IClassExam = {
  id?: number;
  class_exam_name: string;
  position: number;
  serial_number?: number | null;
  status: 'active' | 'inactive';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};


