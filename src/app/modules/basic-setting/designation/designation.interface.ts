export type DesignationStatus = 'active' | 'inactive';

export interface IDesignation {
  id?: number;
  name: string;
  serial_number?: number | null;
  school_id: number;
  status: DesignationStatus;
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
