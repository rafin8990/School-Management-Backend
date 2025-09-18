export type Role = 'school_super_admin' | 'school_admin' | 'admin' | 'user';

export type CreateSchoolUserInput = {
  name: string;
  email?: string;
  password: string;
  username: string;
  mobile_no: string;
  photo?: string;
  school_id: number;
  address?: string;
  role?: Role;
};

export type LoginInput = {
  usernameOrMobile: string;
  password: string;
};

export type JwtPayloadUser = {
  id: number;
  email: string | null;
  role: Role;
  school_id: number;
};


