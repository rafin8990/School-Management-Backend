export type ISignature = {
  id?: number;
  name: string;
  image?: string | null;
  school_id: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
};
