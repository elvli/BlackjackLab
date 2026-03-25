"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlackjackSessionSummaryDto } from "@/lib/blackjack-session-types";

type SessionStartPanelProps = {
  isLoading?: boolean;
  isMutating?: boolean;
  suspendedSession?: BlackjackSessionSummaryDto | null;
  onStartSession: () => void;
  onResumeSession: (sessionId: string) => void;
};

export function SessionStartPanel({
  isLoading = false,
  isMutating = false,
  suspendedSession,
  onStartSession,
  onResumeSession,
}: SessionStartPanelProps) {
  return (
    <Card className="mx-auto mt-10 max-w-2xl border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Start a training session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-6">
          Sessions keep your hands, moves, and table state together so you can
          come back later and review exactly what happened.
        </p>

        {suspendedSession ? (
          <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
            <p className="text-sm font-medium">You have a suspended session ready to resume.</p>
            <p className="text-sm text-muted-foreground">
              Started {new Date(suspendedSession.startedAt).toLocaleString()} and
              last updated {new Date(suspendedSession.updatedAt).toLocaleString()}.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={() => onResumeSession(suspendedSession.id)}
                disabled={isMutating}
              >
                Resume Session
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onStartSession}
                disabled={isMutating}
              >
                Start New Session
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onStartSession}
            disabled={isLoading || isMutating}
          >
            Start Session
          </Button>
        )}

        <Button variant="link" asChild className="px-0">
          <Link href="/sessions">View past sessions</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
