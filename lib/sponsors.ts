export type Sponsor = {
  name: string;
  url?: string;
  logo?: string; // path relative to /public/sponsors/
  tier: "presenting" | "gold" | "community";
};

export const SPONSORS: Sponsor[] = [
  // Presenting / Title Sponsors
  // { name: "Your Sponsor", url: "https://example.com", tier: "presenting" },

  // Gold Sponsors
  { name: "Stinson's Hub", url: "", tier: "gold" },
  { name: "Costello's Maverick Pop", url: "", tier: "gold" },
  { name: "Beacon Bikes", url: "", tier: "gold" },
  { name: "Marcelo Home Improvement", url: "", tier: "gold" },
  { name: "Southern Dutchess Country Club", url: "", tier: "gold" },

  // Community Sponsors
  { name: "S&S Par-Tee's", url: "", tier: "community" },
  { name: "Cut & Coat", url: "", tier: "community" },
  { name: "Queen City E-Gills", url: "", tier: "community" },
  { name: "Epique Realty", url: "", tier: "community" },
  { name: "Carter's", url: "", tier: "community" },
];
