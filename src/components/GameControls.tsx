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

type GameControlsProps = {
  sessionActive?: boolean;
  onMove?: (move: {
    type: LoggedMoveType;
    handIndex?: number;
    payload?: Record<string, unknown>;
  }) => void;
};

type LoggedMoveType =
  | "PLACE_BET"
  | "START_HAND"
  | "HIT"
  | "STAND"
  | "DOUBLE"
  | "SPLIT"
  | "SURRENDER"
  | "END_HAND";

const GameControls = ({
  sessionActive = false,
  onMove,
}: GameControlsProps) => {
  const dispatch = useDispatch();
  const { bankroll, betPlaced, currentHandIndex, playerHands, currentBet } =
    useSelector((state: RootState) => state.play);
  const { numDecks } = useSelector((state: RootState) => state.settings);

  const [betAmount, setBetAmount] = useState(50);

  const handlePlaceBet = (amount: number) => {
    if (!sessionActive) return;

    dispatch(placeBet(amount));
    dispatch(startGame(numDecks));
    onMove?.({
      type: "PLACE_BET",
      payload: {
        amount,
      },
    });
    onMove?.({
      type: "START_HAND",
      handIndex: 0,
      payload: {
        amount,
        numDecks,
      },
    });
  };

  const handleMove = (type: LoggedMoveType) => {
    if (!sessionActive) return;

    onMove?.({
      type,
      handIndex: currentHandIndex,
      payload: {
        currentBet,
        handSize: playerHands[currentHandIndex]?.length ?? 0,
      },
    });
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
            disabled={!sessionActive}
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
            disabled={!sessionActive}
            onClick={() => {
              dispatch(hit());
              handleMove("HIT");
            }}
          >
            Hit
          </Button>
          <Button
            variant="outline"
            className="h-full"
            disabled={!sessionActive}
            onClick={() => {
              dispatch(stand());
              handleMove("STAND");
              onMove?.({
                type: "END_HAND",
                handIndex: currentHandIndex,
                payload: { resolution: "stand" },
              });
            }}
          >
            Stand
          </Button>
          <Button
            variant="outline"
            className="h-full"
            disabled={!sessionActive}
            onClick={() => {
              dispatch(double());
              handleMove("DOUBLE");
              onMove?.({
                type: "END_HAND",
                handIndex: currentHandIndex,
                payload: { resolution: "double" },
              });
            }}
          >
            Double
          </Button>
          <Button
            variant="outline"
            className="h-full"
            disabled={!sessionActive}
            onClick={() => {
              dispatch(split());
              handleMove("SPLIT");
            }}
          >
            Split
          </Button>
          <Button
            variant="outline"
            className="text-white border-0 bg-red-700 hover:text-gray-200 hover:bg-red-800 dark:border-1 dark:text-red-400 h-full"
            disabled={!sessionActive}
            onClick={() => {
              dispatch(surrender());
              handleMove("SURRENDER");
              onMove?.({
                type: "END_HAND",
                handIndex: currentHandIndex,
                payload: { resolution: "surrender" },
              });
            }}
          >
            Surrender
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameControls;
