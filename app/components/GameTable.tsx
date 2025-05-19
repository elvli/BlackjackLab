"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const GameTable = () => {
  const numHands = useSelector((state: RootState) => state.settings.numHands);

  // Dynamically generate angles based on numHands
  const getAngles = (n: number) => {
    if (n === 1) return [90]; // center
    if (n === 2) return [65, 115];

    const start = 40;
    const end = 140;
    const step = (end - start) / (n - 1);
    return Array.from({ length: n }, (_, i) => start + i * step);
  };

  return (
    <div className="relative w-full flex-grow pt-16 flex items-center justify-center">
      {/* Dealer near top center */}
      <div className="absolute top-[10vh] left-1/2 -translate-x-1/2">
        <div className="bg-white rounded p-2 shadow">Dealer</div>
      </div>

      {/* Player hands semicircle */}
      {getAngles(numHands).map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        const radius = 280;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: `calc(10vh + ${y}px)`,
              left: `calc(50% + ${x}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="bg-white rounded p-2 shadow">Hand {i + 1}</div>
          </div>
        );
      })}
    </div>
  );
};

export default GameTable;
