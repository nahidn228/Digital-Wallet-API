import { UserRole } from "../user/user.constrain";

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  nid?: string;
  address?: string;
  dateOfBirth?: Date;
}