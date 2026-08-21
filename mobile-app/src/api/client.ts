import axios, { AxiosError } from "axios";

// Point d'entrée unique pour tous les appels réseau de l'app.
// Aucun composant ou service ne doit importer axios directement : tout passe par apiClient.
//
// Backend réel (ndono-li/backend-api, NestJS) : pas de préfixe /api, écoute sur :3000.
// L'app ne doit JAMAIS appeler ai-service (:8000) directement : ses routes exigent un
// secret interne (X-Internal-Secret) que le client mobile ne doit pas détenir.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // le RAG peut être lent, on laisse une marge large avant de considérer un timeout
  headers: {
    Accept: "application/json",
  },
});

export type ApiErrorKind = "network" | "timeout" | "server" | "unauthorized" | "forbidden" | "unknown";

export interface ApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
}

// Le backend NestJS renvoie {statusCode, message, error} sur les erreurs :
// on préfère toujours son message réel (ex. "abonnement à 500 FCFA/mois requis")
// à un texte générique, quand il est disponible.
function serverMessage(error: AxiosError): string | undefined {
  const data = error.response?.data as { message?: string | string[] } | undefined;
  if (!data?.message) return undefined;
  return Array.isArray(data.message) ? data.message.join(" ") : data.message;
}

function normalizeError(error: AxiosError): ApiError {
  if (error.code === "ECONNABORTED") {
    return {
      kind: "timeout",
      message: "Le serveur met trop de temps à répondre. Réessayez.",
    };
  }
  if (!error.response) {
    return {
      kind: "network",
      message: "Connexion impossible. Vérifiez votre réseau et réessayez.",
    };
  }
  if (error.response.status === 401) {
    return {
      kind: "unauthorized",
      message: serverMessage(error) ?? "Identifiants incorrects ou session expirée.",
      status: 401,
    };
  }
  if (error.response.status === 403) {
    return {
      kind: "forbidden",
      message: serverMessage(error) ?? "Action non autorisée.",
      status: 403,
    };
  }
  if (error.response.status >= 500) {
    return {
      kind: "server",
      message: "Le service est momentanément indisponible.",
      status: error.response.status,
    };
  }
  return {
    kind: "unknown",
    message: serverMessage(error) ?? "Une erreur est survenue. Réessayez.",
    status: error.response.status,
  };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeError(error))
);

// Le token est injecté ici après connexion (voir useAuth) : aucun service n'a besoin
// de le passer manuellement dans ses appels, apiClient s'en charge pour tous.
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
