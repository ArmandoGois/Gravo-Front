export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  credits?: number;
  tier?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  message?: string;
}
