export type ISubject = {
  id?: number;
  name: string;
  code?: string | null;
  serial_number?: number | null;
  status: 'active' | 'inactive';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};


