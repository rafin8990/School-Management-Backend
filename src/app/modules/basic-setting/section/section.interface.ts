export type ISection = {
  id?: number;
  name: string;
  serial_number?: number | null;
  status: 'active' | 'inactive';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};


