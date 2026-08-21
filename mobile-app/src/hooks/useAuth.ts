import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ApiError, setAuthToken } from "../api/client";
import { getCurrentUser, login as loginRequest, register as registerRequest } from "../services/authService";
import { User } from "../types/auth";

const TOKEN_KEY = "pilgrim-app:auth-token";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Le token est stocké via SecureStore (chiffré), jamais via AsyncStorage.
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        setStatus("unauthenticated");
        return;
      }
      setAuthToken(token);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setStatus("authenticated");
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setAuthToken(null);
        setStatus("unauthenticated");
      }
    })();
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await loginRequest({ phone, password });
      await SecureStore.setItemAsync(TOKEN_KEY, response.accessToken);
      setAuthToken(response.accessToken);
      setUser(response.user);
      setStatus("authenticated");
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (phone: string, password: string, fullName?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await registerRequest({ phone, password, fullName });
      await SecureStore.setItemAsync(TOKEN_KEY, response.accessToken);
      setAuthToken(response.accessToken);
      setUser(response.user);
      setStatus("authenticated");
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Pas d'endpoint dédié "statut d'abonnement" côté backend : isSubscribed et
  // subscriptionExpiresAt vivent sur /auth/profile. On rafraîchit ce profil après un
  // retour de paiement PayDunya pour refléter l'abonnement nouvellement activé.
  const refreshProfile = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [status]);

  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isSubmitting,
    error,
    login,
    register,
    logout,
    refreshProfile,
  };
}
