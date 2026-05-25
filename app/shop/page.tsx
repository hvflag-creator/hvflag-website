import { getProducts, getProductMainImage, getMinPrice } from "@/lib/printify";
import Link from "next/link";

export const revalidate = 3600;

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Shop
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Official HVFF gear · Fulfilled by Printify
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="font-display font-black text-2xl uppercase mb-2" style={{ color: "var(--gold)" }}>
              Coming Soon
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              The HVFF store is being set up. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const image = getProductMainImage(product);
              const price = getMinPrice(product);
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="group rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="aspect-square overflow-hidden" style={{ background: "var(--surface2)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-display font-bold text-sm uppercase tracking-wide leading-tight line-clamp-2">
                      {product.title}
                    </p>
                    <p className="mt-1 font-display font-black text-base" style={{ color: "var(--gold)" }}>
                      From ${(price / 100).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
