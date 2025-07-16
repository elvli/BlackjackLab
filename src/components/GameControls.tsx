"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  placeBet,
  startGame,
  hit,
  stand,
  double,
  split,
  surrender,
} from "@/app/store/PlayStateSlice";

import { Plus, Minus } from "lucide-react";

const GameControls = () => {
  const dispatch = useDispatch();
  const { bankroll, betPlaced } = useSelector((state: RootState) => state.play);

  const [betAmount, setBetAmount] = useState(50);

  const handlePlaceBet = (amount: number) => {
    dispatch(placeBet(amount));
    dispatch(startGame(1)); // Or however many decks you want
  };

  return (
    <div className="mt-4 text-center min-h-[48px]">
      {" "}
      {/* adjust 56px to match your tallest content */}
      {!betPlaced ? (
        <div className="flex gap-2 justify-center items-center h-full">
          <div className="inline-flex rounded-md overflow-hidden border border-gray-300 text-sm font-medium h-10">
            <div className="bg-gray-200 px-3 py-2 text-gray-700 flex items-center h-full">
              Bankroll
            </div>
            <div className="bg-white px-3 py-2 text-gray-900 flex items-center h-full">
              ${bankroll}
            </div>
          </div>

          <div className="flex items-center space-x-2 mx-4 h-10">
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 h-full flex items-center justify-center"
              onClick={() => setBetAmount((prev) => Math.max(prev - 25, 0))}
            >
              <Minus className="w-4 h-4 text-black" />
            </button>
            <Input
              type="number"
              className="w-24 text-center font-medium
            [appearance:textfield] 
            [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none
            h-full"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
            />
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 h-full flex items-center justify-center"
              onClick={() => setBetAmount((prev) => prev + 25)}
            >
              <Plus className="w-4 h-4 text-black" />
            </button>
          </div>

          <Button
            variant="outline"
            className="h-10"
            onClick={() => handlePlaceBet(betAmount)}
          >
            Place Bet
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 justify-center items-center h-10">
          <span className="inline-flex items-center h-full">
            Bankroll: {bankroll}
          </span>
          <Button
            variant="outline"
            className="h-full"
            onClick={() => dispatch(hit())}
          >
            Hit
          </Button>
          <Button
            variant="outline"
            className="h-full"
            onClick={() => dispatch(stand())}
          >
            Stand
          </Button>
          <Button
            variant="outline"
            className="h-full"
            onClick={() => dispatch(double())}
          >
            Double
          </Button>
          <Button
            variant="outline"
            className="h-full"
            onClick={() => dispatch(split())}
          >
            Split
          </Button>
          <Button
            variant="outline"
            className="text-white border-0 bg-red-700 hover:text-gray-200 hover:bg-red-800 dark:border-1 dark:text-red-400 h-full"
            onClick={() => dispatch(surrender())}
          >
            Surrender
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameControls;
