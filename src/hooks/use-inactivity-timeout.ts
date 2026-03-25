"use client";

import { useEffect, useRef, useState } from "react";

type UseInactivityTimeoutOptions = {
  enabled: boolean;
  timeoutMs?: number;
  onTimeout?: () => void;
};

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
] as const;

export function useInactivityTimeout({
  enabled,
  timeoutMs = 10 * 60 * 1000,
  onTimeout,
}: UseInactivityTimeoutOptions) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      setIsIdle(false);
      return;
    }

    const resetTimer = () => {
      setIsIdle(false);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setIsIdle(true);
        onTimeout?.();
      }, timeoutMs);
    };

    resetTimer();

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [enabled, onTimeout, timeoutMs]);

  const reset = () => {
    setIsIdle(false);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    if (enabled) {
      timerRef.current = window.setTimeout(() => {
        setIsIdle(true);
        onTimeout?.();
      }, timeoutMs);
    }
  };

  return {
    isIdle,
    reset,
    dismiss: () => setIsIdle(false),
  };
}
