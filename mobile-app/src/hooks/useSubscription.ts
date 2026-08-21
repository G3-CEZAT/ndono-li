import { useCallback, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { ApiError } from "../api/client";
import { createSubscriptionCheckout } from "../services/subscriptionService";

// Le paiement se fait sur la page hébergée PayDunya (WebBrowser), pas dans un WebView
// custom : plus sûr (l'app ne voit jamais les infos de carte/mobile money) et plus simple.
// Le statut d'abonnement lui-même vit sur le profil utilisateur (GET /auth/profile),
// il n'y a pas d'endpoint dédié : voir refreshProfile de useAuth.
export function useSubscription(onPaymentReturn: () => Promise<void>) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const subscribe = useCallback(async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const { invoiceUrl } = await createSubscriptionCheckout("MONTHLY_500");
      await WebBrowser.openBrowserAsync(invoiceUrl);
      // Le webhook PayDunya met à jour l'abonnement côté backend ; on rafraîchit le
      // profil au retour (best-effort - l'utilisateur peut relancer si le webhook est lent).
      await onPaymentReturn();
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsCheckingOut(false);
    }
  }, [onPaymentReturn]);

  return { isCheckingOut, error, subscribe };
}
