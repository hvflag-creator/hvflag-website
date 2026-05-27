import GalleryGrid from "@/components/GalleryGrid";
import { GALLERY } from "@/lib/gallery";

export const revalidate = 3600;

export default function GalleryPage() {
  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Gallery
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Photos &amp; highlights from the field
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <GalleryGrid items={GALLERY} />
      </div>
    </div>
  );
}
