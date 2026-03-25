"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BlackjackMovePayload,
  BlackjackSessionSnapshotPayload,
  BlackjackSessionSummaryDto,
  SerializableSettingsState,
} from "@/lib/blackjack-session-types";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new Error(errorBody.error ?? "Request failed");
  }

  return (await response.json()) as T;
}

export function useBlackjackSession() {
  const [activeSession, setActiveSession] =
    useState<BlackjackSessionSummaryDto | null>(null);
  const [suspendedSession, setSuspendedSession] =
    useState<BlackjackSessionSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOverview = useCallback(async () => {
    try {
      setError(null);
      const data = await readJson<{
        activeSession: BlackjackSessionSummaryDto | null;
        suspendedSession: BlackjackSessionSummaryDto | null;
      }>(await fetch("/api/blackjack-sessions", { cache: "no-store" }));

      setActiveSession(data.activeSession);
      setSuspendedSession(data.suspendedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load sessions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshOverview();
  }, [refreshOverview]);

  const startSession = useCallback(async (settingsSnapshot: SerializableSettingsState) => {
    setIsMutating(true);
    setError(null);

    try {
      const session = await readJson<BlackjackSessionSummaryDto>(
        await fetch("/api/blackjack-sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ settingsSnapshot }),
        })
      );

      setActiveSession(session);
      setSuspendedSession(null);
      return session;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to start session";
      setError(message);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const resumeSession = useCallback(async (sessionId: string) => {
    setIsMutating(true);
    setError(null);

    try {
      const session = await readJson<BlackjackSessionSummaryDto>(
        await fetch(`/api/blackjack-sessions/${sessionId}/resume`, {
          method: "POST",
        })
      );

      setActiveSession(session);
      setSuspendedSession(null);
      return session;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to resume session";
      setError(message);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const endSession = useCallback(async (sessionId: string, reason?: string) => {
    setIsMutating(true);
    setError(null);

    try {
      await readJson(
        await fetch(`/api/blackjack-sessions/${sessionId}/end`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        })
      );

      setActiveSession(null);
      await refreshOverview();
    } finally {
      setIsMutating(false);
    }
  }, [refreshOverview]);

  const suspendSession = useCallback(async (sessionId: string, reason?: string) => {
    setError(null);

    await readJson(
      await fetch(`/api/blackjack-sessions/${sessionId}/suspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
        keepalive: true,
      })
    );

    setActiveSession(null);
  }, []);

  const touchSession = useCallback(async (sessionId: string) => {
    await readJson(
      await fetch(`/api/blackjack-sessions/${sessionId}/touch`, {
        method: "POST",
      })
    );
  }, []);

  const logMove = useCallback(async (
    sessionId: string,
    move: Omit<BlackjackMovePayload, "sessionId">
  ) => {
    await readJson(
      await fetch(`/api/blackjack-sessions/${sessionId}/moves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(move),
      })
    );
  }, []);

  const logSnapshot = useCallback(async (
    sessionId: string,
    payload: BlackjackSessionSnapshotPayload
  ) => {
    await readJson(
      await fetch(`/api/blackjack-sessions/${sessionId}/snapshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      })
    );
  }, []);

  return {
    activeSession,
    suspendedSession,
    isLoading,
    isMutating,
    error,
    refreshOverview,
    startSession,
    resumeSession,
    endSession,
    suspendSession,
    touchSession,
    logMove,
    logSnapshot,
  };
}
