import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getShopConfig, setShopConfig } from "@/lib/firestore";

const SHOP_ID = process.env.PRINTIFY_SHOP_ID!;
const API_KEY = process.env.PRINTIFY_API_KEY!;

async function getAllPrintifyProducts() {
  const res = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/products.json?limit=50`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  const data = await res.json();
  return data.data ?? [];
}

export async function GET() {
  const [products, config] = await Promise.all([
    getAllPrintifyProducts(),
    getShopConfig(),
  ]);
  return NextResponse.json({ products, config });
}

export async function POST(req: Request) {
  const { enabledProductIds } = await req.json();
  if (!Array.isArray(enabledProductIds)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  await setShopConfig(enabledProductIds);
  // Immediately bust the shop page cache so changes are visible right away
  revalidatePath("/shop");
  revalidatePath("/shop/[productId]", "page");
  return NextResponse.json({ ok: true });
}
