import { apiClient } from "../api/client";
import { AuthResponse, ProfileResponse, UserRole } from "../types/auth";

export interface LoginParams {
  phone: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  fullName?: string;
  role?: UserRole;
}

export async function login(params: LoginParams): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", params);
  return data;
}

// Le ValidationPipe backend a forbidNonWhitelisted: true — n'envoyer que les champs
// exactement définis par RegisterDto, sinon 400.
export async function register(params: RegisterParams): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", params);
  return data;
}

export async function getCurrentUser(): Promise<ProfileResponse> {
  const { data } = await apiClient.get<ProfileResponse>("/auth/profile");
  return data;
}
