export type Sponsor = {
  name: string;
  url?: string;
  logo?: string; // path relative to /public/sponsors/
  tier: "presenting" | "gold" | "community";
};

export const SPONSORS: Sponsor[] = [
  // Presenting / Title Sponsors
  // { name: "Your Sponsor", url: "https://example.com", tier: "presenting" },

  // Team Sponsors — logos in /public/logos/
  { name: "Stinson's Hub", url: "", logo: "stinsons-hub.png", tier: "gold" },
  { name: "Costello's Maverick Pop", url: "", logo: "costellos-maverick-pop.png", tier: "gold" },
  { name: "Beacon Bikes", url: "", logo: "beacon-bikes.png", tier: "gold" },
  { name: "Marcelo Home Improvement", url: "", logo: "marcelo-home-improvement.png", tier: "gold" },
  { name: "Southern Dutchess CC", url: "", logo: "southern-dutchess-cc.png", tier: "gold" },
  { name: "S&S Par-Tee's", url: "", logo: "ss-par-tees.png", tier: "gold" },
  { name: "Cut & Coat", url: "", logo: "cutncoat.png", tier: "gold" },
  { name: "Queen City E-Gills", url: "", logo: "queen-city-e-gills.png", tier: "gold" },
];
