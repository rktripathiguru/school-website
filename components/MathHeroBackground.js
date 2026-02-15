"use client";

import { useEffect } from "react";

export default function MathHeroBackground() {
  useEffect(() => {
    const canvas = document.getElementById("mathCanvas");
    const ctx = canvas.getContext("2d");

    let width, height;
    let symbols = ["π", "∑", "√", "∫", "Δ", "θ"];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 400;
    }

    resize();
    window.addEventListener("resize", resize);

    let particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.3 + Math.random() * 0.5,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.font = "20px Arial";

      particles.forEach(p => {
        ctx.fillText(p.symbol, p.x, p.y);
        p.y -= p.speed;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      id="mathCanvas"
      className="absolute inset-0 w-full h-full opacity-40"
    />
  );
}
