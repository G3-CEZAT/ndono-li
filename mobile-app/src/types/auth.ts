export type UserRole = "PELERIN" | "ERUDIT" | "ADMIN";

export interface User {
  id: string;
  phone: string;
  fullName: string | null;
  role: UserRole;
  subscriptionExpiresAt: string | null;
  createdAt?: string;
  isSubscribed?: boolean;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

// GET /auth/profile renvoie isSubscribed en plus (calculé côté serveur).
export interface ProfileResponse extends User {
  isSubscribed: boolean;
}
