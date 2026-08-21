export type SubscriptionPlan = "MONTHLY_500" | "ANNUAL_5000";

export interface CheckoutResponse {
  message: string;
  invoiceUrl: string;
  paydunyaToken: string;
  amount: number;
  durationDays: number;
}
