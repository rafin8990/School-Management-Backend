export interface ITransferCertificate {
  id?: number;
  school_id: number;
  class_id: number;
  student_id: number;
  exam_name?: string;
  appeared_exam?: string;
  appeared_year: number;
  last_payment_month?: string;
  promoted_class?: string;
  detained_class?: string;
  reason_for_leave?: string;
  status?: 'active' | 'inactive' | 'archived';
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
  updated_by?: number;
}

export interface ITransferCertificateFilters {
  searchTerm?: string;
  school_id?: number;
  class_id?: number;
  student_id?: number;
  appeared_year?: number;
  status?: string;
  created_by?: number;
}

export interface ITransferCertificateResponse extends ITransferCertificate {
  school_name?: string;
  class_name?: string;
  student_name?: string;
  student_roll?: string;
  created_by_name?: string;
  updated_by_name?: string;
}
