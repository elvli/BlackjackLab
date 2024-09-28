import React, { useEffect } from "react";
import { useGameProvider } from "../Context/GameContext";

import PlayingCard from "./PlayingCard";

const BlackjackTable = () => {
  const { startGame, playerCards, dealerCards } = useGameProvider();

  const handleHit = () => {
    console.log("Hit button clicked");
  };

  const handleStand = () => {
    console.log("Stand button clicked");
  };

  const handleDouble = () => {
    console.log("Double button clicked");
  };

  const handleSplit = () => {
    console.log("Split button clicked");
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-72px)]">
      {/* Dealer's Cards */}
      <div className="flex-1 bg-green-700 flex justify-center">
        {dealerCards.map((card, index) => (
          <PlayingCard key={index} value={card} />
        ))}
      </div>

      <div className="flex-1 bg-green-900 flex justify-center">
        {playerCards.map((card, index) => (
          <PlayingCard key={index} value={card} />
        ))}
      </div>

      {/* Control Buttons */}
      <div className="h-1/5 mt-2 flex justify-center items-center">
        <button
          type="button"
          className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={handleHit}
        >
          Hit
        </button>

        <button
          type="button"
          className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-500 dark:hover:bg-red-600"
          onClick={handleStand}
        >
          Stand
        </button>

        <button
          type="button"
          className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
          onClick={handleDouble}
        >
          Double
        </button>

        <button
          type="button"
          className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700"
          onClick={handleSplit}
        >
          Split
        </button>
      </div>
    </div>
  );
};

export default BlackjackTable;
