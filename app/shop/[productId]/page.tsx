import { getProduct, getProducts } from "@/lib/printify";
import VariantPicker from "@/components/VariantPicker";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ productId: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) return {};
  return { title: `${product.title} – HVFF Shop` };
}

export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) notFound();

  return (
    <div>
      <div className="border-b py-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/shop" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--gold)" }}>
            ← Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Variant picker (includes dynamic image) */}
          <VariantPicker product={product} />

          {/* Right: Product info */}
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight mb-4">
              {product.title}
            </h1>

            {product.description && (
              <div
                className="text-sm leading-relaxed prose prose-invert max-w-none"
                style={{ color: "var(--muted)" }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            <div
              className="mt-6 rounded-lg p-4 text-sm"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
            >
              <p className="font-display font-bold uppercase tracking-wide mb-2">Shipping Info</p>
              <ul className="space-y-1" style={{ color: "var(--muted)" }}>
                <li>✓ Print-on-demand — made just for you</li>
                <li>✓ Ships within 3–7 business days</li>
                <li>✓ Tracked shipping included</li>
                <li>✓ Powered by Printify</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
