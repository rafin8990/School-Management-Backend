export type IReport = {
  id?: number;
  name: string;
  status: 'active' | 'inactive';
  position?: number | null;
  school_id: number;
  created_at?: string;
  updated_at?: string;
};
