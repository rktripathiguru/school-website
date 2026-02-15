"use client";

import { useEffect, useState } from "react";

const mathSymbols = ["∑", "∏", "∫", "∂", "∇", "√", "∞", "π", "θ", "α", "β", "γ", "δ", "λ", "μ", "σ", "φ", "ψ", "ω", "±", "×", "÷", "≈", "≠", "≤", "≥", "∈", "∉", "⊂", "⊃", "∪", "∩", "∀", "∃", "∅", "ℝ", "ℕ", "ℤ", "ℚ", "ℂ"];

export default function MathRainEffect() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const generateSymbols = () => {
      const newSymbols = [];
      for (let i = 0; i < 50; i++) {
        newSymbols.push({
          id: i,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          left: Math.random() * 100,
          animationDuration: 5 + Math.random() * 10,
          animationDelay: Math.random() * 5,
          fontSize: 20 + Math.random() * 30,
          opacity: 0.3 + Math.random() * 0.4
        });
      }
      return newSymbols;
    };

    setSymbols(generateSymbols());
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute text-blue-800 animate-fall"
          style={{
            left: `${symbol.left}%`,
            fontSize: `${symbol.fontSize}px`,
            opacity: symbol.opacity,
            animation: `fall ${symbol.animationDuration}s linear ${symbol.animationDelay}s infinite`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
