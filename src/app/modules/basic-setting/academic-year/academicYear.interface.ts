export type AcademicYearStatus = 'active' | 'inactive';

export interface IAcademicYear {
  id?: number;
  name: number;
  serial_number?: number | null;
  school_id: number;
  status: AcademicYearStatus;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  data: T[];
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
