"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "@/app/store/store";
import {
  dealerHitOne,
  finishDealerTurn,
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
  const dispatch = useDispatch<AppDispatch>();
  const {
    bankroll,
    betPlaced,
    currentHandIndex,
    playerHands,
    currentBet,
    dealerPhasePending,
  } =
    useSelector((state: RootState) => state.play);
  const { numDecks, dealerSpeed } = useSelector((state: RootState) => state.settings);

  const [betAmount, setBetAmount] = useState(50);
  const dealerTurnRunningRef = useRef(false);

  useEffect(() => {
    if (!sessionActive || !dealerPhasePending || dealerTurnRunningRef.current) {
      return;
    }

    let cancelled = false;
    dealerTurnRunningRef.current = true;

    const delay = (ms: number) =>
      new Promise((resolve) => window.setTimeout(resolve, ms));

    const runDealerTurn = async () => {
      while (!cancelled) {
        const state = store.getState();
        const { play, settings } = state;

        if (!play.dealerPhasePending) {
          break;
        }

        if (play.dealerScore >= 17 || play.deck.length === 0) {
          dispatch(finishDealerTurn());
          break;
        }

        if (settings.dealerSpeed > 0) {
          await delay(settings.dealerSpeed);
        }

        if (cancelled) {
          break;
        }

        const latestState = store.getState();

        if (
          !latestState.play.dealerPhasePending ||
          latestState.play.dealerScore >= 17 ||
          latestState.play.deck.length === 0
        ) {
          dispatch(finishDealerTurn());
          break;
        }

        dispatch(dealerHitOne());
      }
    };

    void runDealerTurn().finally(() => {
      dealerTurnRunningRef.current = false;
    });

    return () => {
      cancelled = true;
    };
  }, [dealerPhasePending, dealerSpeed, dispatch, sessionActive]);

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
            disabled={!sessionActive || dealerPhasePending}
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
            disabled={!sessionActive || dealerPhasePending}
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
            disabled={!sessionActive || dealerPhasePending}
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
            disabled={!sessionActive || dealerPhasePending}
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
            disabled={!sessionActive || dealerPhasePending}
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
          {dealerPhasePending ? (
            <span className="inline-flex items-center text-sm text-muted-foreground">
              Dealer playing...
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GameControls;
