import Stripe from "stripe";

// Lazy-initialize so the module can be imported at build time even when
// STRIPE_SECRET_KEY is not available (Vercel marks it sensitive, meaning
// it's only injected at runtime, not during `next build`).
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return _stripe;
}

// Backwards-compat named export for any direct `stripe.xxx` call sites
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
