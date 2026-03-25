"use client";

import { useEffect, useMemo, useRef } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/app/store/store";
import {
  PlayState,
  hydratePlayState,
  resetPlayState,
} from "@/app/store/PlayStateSlice";
import { hydrateSettingsState } from "@/app/store/SettingsSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameControls from "@/components/GameControls";
import HandDisplay from "@/components/HandDisplay";
import { SessionInactivityDialog } from "@/components/SessionInactivityDialog";
import { SessionStartPanel } from "@/components/SessionStartPanel";
import { useBlackjackSession } from "@/hooks/use-blackjack-session";
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout";
import {
  BlackjackSessionSnapshotPayload,
  SerializablePlayState,
  SerializableSettingsState,
} from "@/lib/blackjack-session-types";

function getAngles(n: number) {
  if (n === 1) return [90];
  if (n === 2) return [65, 115];
  const start = 40;
  const end = 140;
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

function toSerializablePlayState(
  playState: RootState["play"]
): SerializablePlayState {
  return {
    bankroll: playState.bankroll,
    currentBet: playState.currentBet,
    betPlaced: playState.betPlaced,
    deck: playState.deck,
    playerHands: playState.playerHands,
    dealerHand: playState.dealerHand,
    playerScores: playState.playerScores,
    dealerScore: playState.dealerScore,
    showDealerCards: playState.showDealerCards,
    currentHandIndex: playState.currentHandIndex,
    endState: playState.endState,
    doubledHands: playState.doubledHands,
    blackjackHands: playState.blackjackHands,
  };
}

function toSerializableSettingsState(
  settingsState: RootState["settings"]
): SerializableSettingsState {
  return { ...settingsState };
}

export default function Home() {
  const { isSignedIn } = useAuth();
  const dispatch = useDispatch();
  const playState = useSelector((state: RootState) => state.play);
  const settingsState = useSelector((state: RootState) => state.settings);
  const {
    activeSession,
    suspendedSession,
    isLoading,
    isMutating,
    error,
    startSession,
    resumeSession,
    endSession,
    touchSession,
    logMove,
    logSnapshot,
  } = useBlackjackSession();
  const snapshotSignatureRef = useRef<string | null>(null);
  const previousBetPlacedRef = useRef(playState.betPlaced);
  const suspendBeaconSentRef = useRef(false);
  const hydratedSessionRef = useRef<string | null>(null);
  const sessionId = activeSession?.id ?? null;

  const snapshotPayload = useMemo<BlackjackSessionSnapshotPayload>(
    () => ({
      playState: toSerializablePlayState(playState),
      settingsState: toSerializableSettingsState(settingsState),
      metadata: {
        source: "table",
      },
    }),
    [playState, settingsState]
  );

  const { isIdle, reset: resetInactivityTimer, dismiss: dismissIdleDialog } =
    useInactivityTimeout({
      enabled: Boolean(sessionId),
      onTimeout: () => undefined,
    });

  useEffect(() => {
    if (!sessionId) {
      snapshotSignatureRef.current = null;
      suspendBeaconSentRef.current = false;
      hydratedSessionRef.current = null;
      return;
    }

    const signature = JSON.stringify(snapshotPayload);

    if (snapshotSignatureRef.current === signature) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void logSnapshot(sessionId, snapshotPayload);
      snapshotSignatureRef.current = signature;
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [logSnapshot, sessionId, snapshotPayload]);

  useEffect(() => {
    if (!activeSession?.id || hydratedSessionRef.current === activeSession.id) {
      return;
    }

    const latestSnapshot = activeSession.latestSnapshot;

    if (latestSnapshot?.settingsState) {
      dispatch(hydrateSettingsState(latestSnapshot.settingsState));
    }

    if (latestSnapshot?.playState) {
      dispatch(hydratePlayState(latestSnapshot.playState as PlayState));
    }

    hydratedSessionRef.current = activeSession.id;
  }, [activeSession, dispatch]);

  useEffect(() => {
    if (!sessionId) return;

    const hadBetPlaced = previousBetPlacedRef.current;
    const endedHand = hadBetPlaced && !playState.betPlaced;

    if (!endedHand) return;

    void logMove(sessionId, {
      type: "END_HAND",
      handIndex: playState.currentHandIndex,
      payload: {
        endState: playState.endState,
        bankroll: playState.bankroll,
      },
    });
  }, [
    logMove,
    playState.bankroll,
    playState.betPlaced,
    playState.currentHandIndex,
    playState.endState,
    sessionId,
  ]);

  useEffect(() => {
    previousBetPlacedRef.current = playState.betPlaced;
  }, [playState.betPlaced]);

  useEffect(() => {
    if (!sessionId) return;

    const suspendWithBeacon = () => {
      if (suspendBeaconSentRef.current || !navigator.sendBeacon) {
        return;
      }

      const body = new Blob([JSON.stringify({ reason: "pagehide" })], {
        type: "application/json",
      });

      // sendBeacon is the most reliable browser option for tab close/pagehide.
      // It is still best-effort, so the server also tolerates missed beacons.
      const sent = navigator.sendBeacon(
        `/api/blackjack-sessions/${sessionId}/suspend`,
        body
      );

      if (sent) {
        suspendBeaconSentRef.current = true;
      }
    };

    const handlePageHide = () => suspendWithBeacon();

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);

      if (!suspendBeaconSentRef.current) {
        void fetch(`/api/blackjack-sessions/${sessionId}/suspend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: "route-change" }),
          keepalive: true,
        }).catch(() => undefined);
      }
    };
  }, [sessionId]);

  const handleStartSession = async () => {
    dispatch(resetPlayState());
    await startSession(toSerializableSettingsState(settingsState));
    resetInactivityTimer();
  };

  const handleResumeSession = async (targetSessionId: string) => {
    const session = await resumeSession(targetSessionId);
    const latestSnapshot = session.latestSnapshot;

    if (latestSnapshot?.settingsState) {
      dispatch(hydrateSettingsState(latestSnapshot.settingsState));
    }

    if (latestSnapshot?.playState) {
      dispatch(hydratePlayState(latestSnapshot.playState as PlayState));
    }

    resetInactivityTimer();
  };

  const handleEndSession = async (reason = "manual") => {
    if (!sessionId) return;

    await endSession(sessionId, reason);
    dismissIdleDialog();
    dispatch(resetPlayState());
  };

  const handleContinueSession = async () => {
    if (!sessionId) return;

    await touchSession(sessionId);
    dismissIdleDialog();
    resetInactivityTimer();
  };

  const handleMove = (move: {
    type:
      | "PLACE_BET"
      | "START_HAND"
      | "HIT"
      | "STAND"
      | "DOUBLE"
      | "SPLIT"
      | "SURRENDER"
      | "END_HAND";
    handIndex?: number;
    payload?: Record<string, unknown>;
  }) => {
    if (!sessionId) return;

    void logMove(sessionId, {
      type: move.type,
      handIndex: move.handIndex,
      payload: move.payload,
    });
    resetInactivityTimer();
  };

  return (
    <>
      {!isSignedIn ? (
        <div className="flex h-full items-center justify-center p-6">
          <Card className="max-w-lg">
            <CardContent className="space-y-4 p-6 text-center">
              <h1 className="text-2xl font-semibold">Sign in to track sessions</h1>
              <p className="text-sm text-muted-foreground leading-6">
                Sessions are tied to your account so you can suspend, resume,
                and review your blackjack training history later.
              </p>
              <SignInButton mode="modal">
                <Button size="lg">Sign In to Start Session</Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isSignedIn ? (
        <>
          <div className="relative h-screen overflow-hidden p-4 flex flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {sessionId
                    ? `Session ${sessionId.slice(0, 8)} is active.`
                    : "Start a session to save moves, cards, and table state."}
                </p>
              </div>

              {sessionId ? (
                <Button variant="outline" onClick={() => void handleEndSession()}>
                  End Session
                </Button>
              ) : null}
            </div>

            {error ? (
              <div className="mb-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex-1 overflow-hidden">
              <Card className="h-full bg-green-900 overflow-auto border-0">
                <CardContent>
                  <div className="relative min-h-[60vh] w-full flex-grow m-auto flex items-center justify-center">
                    {!sessionId ? (
                      <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                        <SessionStartPanel
                          isLoading={isLoading}
                          isMutating={isMutating}
                          suspendedSession={suspendedSession}
                          onStartSession={() => void handleStartSession()}
                          onResumeSession={(targetSessionId) =>
                            void handleResumeSession(targetSessionId)
                          }
                        />
                      </div>
                    ) : null}

                    <div className="absolute top-[5vh] dark:text-black">
                      <div className="flex space-x-2 p-2">
                        <HandDisplay hand={playState.dealerHand} />
                      </div>
                    </div>

                    {getAngles(playState.playerHands.length).map((deg, i) => {
                      const angle = (deg * Math.PI) / 180;
                      const radius = 280;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius + 60;

                      return (
                        <div
                          key={i}
                          className="absolute rounded-lg dark:text-black mt-14 lg:mt-20 w-max text-center"
                          style={{
                            top: `calc(10vh + ${y}px)`,
                            left: `calc(50% + ${x}px)`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div className="flex flex-col items-center p-2">
                            <span
                              className={`bg-white font-semibold rounded-md p-2 mb-2 shadow animate-border-pulse ${
                                i === playState.currentHandIndex
                                  ? "border-4 border-blue-500"
                                  : ""
                              }`}
                            >
                              Hand {i + 1} (Score: {playState.playerScores[i] ?? 0})
                            </span>

                            <HandDisplay hand={playState.playerHands[i]} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <GameControls
              sessionActive={Boolean(sessionId)}
              onMove={handleMove}
            />
          </div>

          <SessionInactivityDialog
            open={Boolean(sessionId) && isIdle}
            onContinue={() => void handleContinueSession()}
            onEnd={() => void handleEndSession("inactive-timeout")}
          />
        </>
      ) : null}
    </>
  );
}
