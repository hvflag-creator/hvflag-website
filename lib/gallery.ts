export type GalleryItem =
  | { type: "instagram"; url: string }
  | { type: "photo"; src: string; caption?: string };

// ─────────────────────────────────────────────────────────────────────────────
// Add items here in the order you want them to appear.
//
// Instagram post:
//   { type: "instagram", url: "https://www.instagram.com/p/XXXXXXXX/" }
//
// Manual photo (drop the file in /public/gallery/ first):
//   { type: "photo", src: "/gallery/your-photo.jpg", caption: "Optional caption" }
// ─────────────────────────────────────────────────────────────────────────────

export const GALLERY: GalleryItem[] = [
  // Paste your Instagram post URLs here — we'll fill these in together
];
