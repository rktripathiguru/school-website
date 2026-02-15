"use client";

import { useEffect, useState } from "react";

export default function MathHeroSlideshow() {
  const backgrounds = [
    "bg-math-grid",
    "bg-math-symbols",
    "bg-math-geometry",
    "bg-math-blueprint",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${backgrounds[index]}`}
    />
  );
}
