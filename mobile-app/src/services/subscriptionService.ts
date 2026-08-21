import { apiClient } from "../api/client";
import { CheckoutResponse, SubscriptionPlan } from "../types/subscription";

// Le paiement PayDunya est initié et signé côté backend (clé secrète marchande) :
// l'app ne fait que récupérer l'URL de paiement hébergée (sandbox) et l'ouvrir.
// Pas d'endpoint de statut dédié : voir GET /auth/profile (isSubscribed, subscriptionExpiresAt).
export async function createSubscriptionCheckout(
  plan: SubscriptionPlan = "MONTHLY_500"
): Promise<CheckoutResponse> {
  const { data } = await apiClient.post<CheckoutResponse>("/payments/subscribe", { plan });
  return data;
}
