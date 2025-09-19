export type DepartmentStatus = 'active' | 'inactive';

export interface IDepartment {
  id?: number;
  name: string;
  serial_number?: number | null;
  school_id: number;
  status: DepartmentStatus;
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
