import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="font-display font-black text-xl" style={{ color: "var(--gold)" }}>HVFF</span>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Hudson Valley Flag Football · Beacon, NY
          </p>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: "var(--muted)" }}>
          <Link href="/schedule" className="hover:text-white transition-colors">Schedule</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <a
            href="https://www.instagram.com/hvflagfootball"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} HVFF. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
