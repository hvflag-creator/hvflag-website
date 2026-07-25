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
  // Manual photos
  { type: "photo", src: "/gallery/pancake-blocks.jpg", caption: "Hudson Valley's Finest" },
  { type: "photo", src: "/gallery/marcelos-team.jpg", caption: "Marcelo Home Improvement" },
  { type: "photo", src: "/gallery/ss-team.jpg", caption: "S&S Par-Tee's" },

  // Instagram posts
  { type: "instagram", url: "https://www.instagram.com/p/DbL3ztdlQ7z/" },
  { type: "instagram", url: "https://www.instagram.com/p/DbL6AyClULI/" },
  { type: "instagram", url: "https://www.instagram.com/p/DYj4n9Ile3s/" },
  { type: "instagram", url: "https://www.instagram.com/p/DYj3jW7lZrf/" },
  { type: "instagram", url: "https://www.instagram.com/p/DYTOsIDDJT8/" },
];
