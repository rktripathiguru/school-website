"use client";

import dynamic from "next/dynamic";

const MathRainEffect = dynamic(
  () => import("./MathRainEffect"),
  { ssr: false }
);

export default function MathRainWrapper() {
  return <MathRainEffect />;
}
