export type ISchool = {
  id?: number;
  name: string;
  eiin?: string | null;
  mobile?: string | null;
  logo?: string | null;
  district_id: number;
  thana_id: number;
  website?: string | null;
  email?: string | null;
  address?: string | null;
  payable_amount?: number | null;
  established_at?: string | null;
  created_at?: Date;
  updated_at?: Date;
  district?: {
    id: number;
    name: string;
  };
  thana?: {
    id: number;
    name: string;
  };
};
