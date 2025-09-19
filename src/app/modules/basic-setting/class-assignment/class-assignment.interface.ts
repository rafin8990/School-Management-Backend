export interface IClassAssignment {
  class_id: number;
  group_ids: number[];
  section_ids: number[];
  shift_ids: number[];
  school_id: number;
}

export interface IClassWithAssignments {
  id: number;
  name: string;
  status: string;
  group_id?: number | null;
  group_name?: string | null;
  section_id?: number | null;
  section_name?: string | null;
  shift_id?: number | null;
  shift_name?: string | null;
}

export interface IClassAssignmentResponse {
  class_id: number;
  class_name: string;
  groups: Array<{ id: number; name: string }>;
  sections: Array<{ id: number; name: string }>;
  shifts: Array<{ id: number; name: string }>;
}
