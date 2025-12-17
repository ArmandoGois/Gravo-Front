import type {
  User,
  UserCredentials,
  AuthResponse,
} from "@/domain/entities/user.entity";

export interface IAuthRepository {
  login(credentials: UserCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<void>;
}
