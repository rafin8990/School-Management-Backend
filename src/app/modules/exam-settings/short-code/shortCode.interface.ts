export type IShortCode = {
  id?: number;
  name: string;
  mark_position: number;
  view_position?: number | null;
  status: 'active' | 'inactive';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};


