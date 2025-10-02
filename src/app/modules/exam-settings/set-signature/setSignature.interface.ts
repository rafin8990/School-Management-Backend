export type ISetSignature = {
  id?: number;
  report_id: number;
  signature_id: number;
  position?: 'left' | 'middle' | 'right' | null;
  status: 'active' | 'inactive';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};


