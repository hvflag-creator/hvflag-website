"use client";

import { useState } from "react";

interface TeamLogoProps {
  slug: string;
  name: string;
  color: string;
  size?: number;
  className?: string;
}

export default function TeamLogo({ slug, name, color, size = 40, className = "" }: TeamLogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    // Fallback: colored circle dot
    return (
      <div
        className={`rounded-full flex-shrink-0 ${className}`}
        style={{ width: size, height: size, background: color }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/${slug}.png`}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
      style={{ objectFit: "contain" }}
      onError={() => setError(true)}
    />
  );
}
