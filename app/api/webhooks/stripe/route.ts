import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrder } from "@/lib/printify";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Parse cart items from metadata
  let cartItems: { productId: string; variantId: number; quantity: number }[] = [];
  try {
    cartItems = JSON.parse(session.metadata?.cart_items ?? "[]");
  } catch {
    return NextResponse.json({ error: "Invalid cart metadata" }, { status: 400 });
  }

  // Get shipping address from session
  const sessionWithShipping = session as Stripe.Checkout.Session & {
    shipping_details?: { address?: Stripe.Address; name?: string };
  };
  const addr = sessionWithShipping.shipping_details?.address ?? (session as unknown as { shipping?: { address?: Stripe.Address } }).shipping?.address;
  const name = sessionWithShipping.shipping_details?.name ?? session.customer_details?.name ?? "Customer";
  const email = session.customer_details?.email ?? "";
  const phone = session.customer_details?.phone ?? undefined;

  if (!addr) {
    console.error("No shipping address in session", session.id);
    return NextResponse.json({ error: "No shipping address" }, { status: 400 });
  }

  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ") || firstName;

  try {
    const order = await createOrder({
      external_id: session.id,
      line_items: cartItems.map((i) => ({
        product_id: i.productId,
        variant_id: i.variantId,
        quantity: i.quantity,
      })),
      shipping_method: 1,
      address_to: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        country: addr.country ?? "US",
        region: addr.state ?? "",
        address1: addr.line1 ?? "",
        address2: addr.line2 ?? undefined,
        city: addr.city ?? "",
        zip: addr.postal_code ?? "",
      },
    });
    console.log("Printify order created:", order.id);
  } catch (err) {
    console.error("Failed to create Printify order:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
