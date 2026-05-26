export default function GalleryPage() {
  return (
    <div>
      <div
        className="border-b py-10"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Gallery
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Photos from the field</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div
          className="rounded-lg p-16 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="text-5xl mb-4">📸</div>
          <div className="font-display font-black text-2xl uppercase mb-2" style={{ color: "var(--gold)" }}>
            Photos Coming Soon
          </div>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--muted)" }}>
            Game photos and highlights from the Summer 2026 season will appear here. Follow{" "}
            <a
              href="https://www.instagram.com/hvflagfootball"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              @hvflagfootball on Instagram
            </a>{" "}
            for real-time updates.
          </p>
        </div>
      </div>
    </div>
  );
}
