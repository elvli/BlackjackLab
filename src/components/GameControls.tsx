"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { sanitizeBetAmount } from "@/lib/betting-settings";

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
  const { numDecks, dealerSpeed, startingBet, bettingIncrement } =
    useSelector((state: RootState) => state.settings);

  const [betAmount, setBetAmount] = useState<number | null>(null);
  const dealerTurnRunningRef = useRef(false);
  const displayedBetAmount = sanitizeBetAmount(betAmount ?? startingBet, bankroll);

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

  const handlePlaceBet = useCallback((amount: number) => {
    if (!sessionActive || bankroll <= 0) return;

    const sanitizedAmount = sanitizeBetAmount(amount, bankroll);

    dispatch(placeBet(sanitizedAmount));
    dispatch(startGame(numDecks));
    onMove?.({
      type: "PLACE_BET",
      payload: {
        amount: sanitizedAmount,
      },
    });
    onMove?.({
      type: "START_HAND",
      handIndex: 0,
      payload: {
        amount: sanitizedAmount,
        numDecks,
      },
    });
  }, [bankroll, dispatch, numDecks, onMove, sessionActive]);

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
    <div className="mx-auto w-full max-w-5xl text-center text-white">
      {!betPlaced ? (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 backdrop-blur-sm sm:px-4">
          <div className="inline-flex h-10 overflow-hidden rounded-md border border-gray-300 text-sm font-medium">
            <div className="flex h-full items-center bg-gray-200 px-3 py-2 text-gray-700">
              Bankroll
            </div>
            <div className="flex h-full items-center bg-white px-3 py-2 text-gray-900">
              ${bankroll}
            </div>
          </div>

          <div className="flex h-10 items-center space-x-2">
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 h-full flex items-center justify-center"
              onClick={() =>
                setBetAmount(sanitizeBetAmount(displayedBetAmount - bettingIncrement, bankroll))
              }
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
              value={displayedBetAmount}
              min={1}
              max={bankroll}
              onChange={(e) =>
                setBetAmount(sanitizeBetAmount(Number(e.target.value), bankroll))
              }
            />
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 h-full flex items-center justify-center"
              onClick={() =>
                setBetAmount(sanitizeBetAmount(displayedBetAmount + bettingIncrement, bankroll))
              }
            >
              <Plus className="w-4 h-4 text-black" />
            </button>
          </div>

          <Button
            variant="outline"
            className="h-10 text-black hover:text-black"
            disabled={!sessionActive || bankroll <= 0}
            onClick={() => handlePlaceBet(displayedBetAmount)}
          >
            Place Bet
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 backdrop-blur-sm sm:gap-3 sm:px-4">
          <span className="inline-flex h-10 items-center rounded-md border border-white/10 bg-white/10 px-3 text-sm">
            Bankroll: {bankroll}
          </span>
          <Button
            variant="outline"
            className="h-10 text-black hover:text-black"
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
            className="h-10 text-black hover:text-black"
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
            className="h-10 text-black hover:text-black"
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
            className="h-10 text-black hover:text-black"
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
            className="h-10 border-0 bg-red-700 text-white hover:bg-red-800 hover:text-white dark:border-1 dark:text-white"
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
            <span className="inline-flex items-center text-sm text-white/70">
              Dealer playing...
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GameControls;
