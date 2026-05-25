import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "HVFF – Hudson Valley Flag Football",
  description:
    "Hudson Valley Flag Football League — Beacon, NY. Scores, standings, rosters, and stats for the Inaugural 2026 season.",
  openGraph: {
    title: "HVFF – Hudson Valley Flag Football",
    description: "Beacon, NY flag football league. Scores, standings, rosters, and stats.",
    siteName: "HVFF",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
