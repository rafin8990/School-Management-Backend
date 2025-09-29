export type IClassWiseSubject = {
  id?: number;
  class_id: number;
  group_id: number;
  status: 'active' | 'inactive';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};

export type IClassSubject = {
  id?: number;
  class_wise_subject_id: number;
  subject_id: number;
  serial_no: number;
  type?: 'choosable' | 'uncountable' | null;
  merge_no?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type IAssignmentInput = {
  school_id: number;
  class_id: number;
  group_id: number;
  assignments: Array<{
    subject_id: number;
    serial_no: number;
    type?: 'choosable' | 'uncountable' | null;
    merge_no?: number | null;
  }>;
};


