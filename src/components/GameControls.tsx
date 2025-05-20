"use client";

import { Button } from "./ui/button";

const GameControls = () => {
  const handleHit = () => {
    console.log("Hit");
  };

  const handleStand = () => {
    console.log("Stand");
  };

  const handleDouble = () => {
    console.log("Double");
  };

  const handleSplit = () => {
    console.log("Split");
  };

  const handleSurrender = () => {
    console.log("Surrender");
  };

  return (
    <div className="mt-3">
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={handleHit}>
          Hit
        </Button>
        <Button variant="outline" onClick={handleStand}>
          Stand
        </Button>
        <Button variant="outline" onClick={handleDouble}>
          Double
        </Button>
        <Button variant="outline" onClick={handleSplit}>
          Split
        </Button>
        <Button
          variant="outline"
          className="text-white border-0 bg-red-700 hover:text-gray-200 hover:bg-red-800 dark:border-1 dark:text-red-400"
          onClick={handleSurrender}
        >
          Surrender
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
