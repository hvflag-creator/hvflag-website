const SHOP_ID = process.env.PRINTIFY_SHOP_ID!;
const API_KEY = process.env.PRINTIFY_API_KEY!;
const BASE = "https://api.printify.com/v1";

function headers() {
  return { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type PrintifyOptionValue = {
  id: number;
  title: string;
  colors?: string[];
};

export type PrintifyProductOption = {
  name: string;
  type: "color" | "size" | string;
  values: PrintifyOptionValue[];
};

export type PrintifyVariant = {
  id: number;
  title: string;
  price: number; // cents
  is_enabled: boolean;
  options: number[]; // option value IDs
};

export type PrintifyImage = {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
};

export type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  options: PrintifyProductOption[];
  visible: boolean;
};

export type PrintifyOrderAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

// ── API ───────────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<PrintifyProduct[]> {
  const res = await fetch(`${BASE}/shops/${SHOP_ID}/products.json?limit=50`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return (data.data ?? []).filter((p: PrintifyProduct) =>
    p.visible && p.variants.some((v) => v.is_enabled)
  );
}

export async function getProduct(id: string): Promise<PrintifyProduct | null> {
  const res = await fetch(`${BASE}/shops/${SHOP_ID}/products/${id}.json`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function createOrder(params: {
  external_id: string;
  line_items: { product_id: string; variant_id: number; quantity: number }[];
  shipping_method: number;
  address_to: PrintifyOrderAddress;
}) {
  const res = await fetch(`${BASE}/shops/${SHOP_ID}/orders.json`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ ...params, send_shipping_notification: true }),
  });
  if (!res.ok) {
    const body = await res.text();
    // 409 = order with this external_id already exists — treat as success (idempotent)
    if (res.status === 409) return { id: null, already_exists: true };
    throw new Error(`Printify order failed (${res.status}): ${body}`);
  }
  return res.json();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getProductMainImage(product: PrintifyProduct): string {
  const def = product.images.find((i) => i.is_default) ?? product.images[0];
  return def?.src ?? "";
}

export function getImageForVariant(product: PrintifyProduct, variantId: number): string {
  const img = product.images.find((i) => i.variant_ids.includes(variantId));
  return img?.src ?? getProductMainImage(product);
}

export function getMinPrice(product: PrintifyProduct): number {
  const prices = product.variants.filter((v) => v.is_enabled).map((v) => v.price);
  return prices.length ? Math.min(...prices) : 0;
}

export function findVariant(
  product: PrintifyProduct,
  selectedOptions: Record<string, number>
): PrintifyVariant | undefined {
  const optionIds = Object.values(selectedOptions);
  return product.variants.find(
    (v) =>
      v.is_enabled &&
      optionIds.every((id) => v.options.includes(id))
  );
}
