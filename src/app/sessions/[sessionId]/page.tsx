import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getBlackjackSessionDetail } from "@/lib/blackjack-sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { sessionId } = await params;
  const session = await getBlackjackSessionDetail({
    clerkUserId: userId,
    sessionId,
  });

  if (!session) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Session {session.id.slice(0, 8)}</h1>
          <p className="text-sm text-muted-foreground">
            Status: {session.status} • Moves: {session.moveCount} • Snapshots:{" "}
            {session.snapshotCount}
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/sessions">Back to History</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Started: {new Date(session.startedAt).toLocaleString()}</p>
          <p>Last activity: {new Date(session.lastActivityAt).toLocaleString()}</p>
          <p>
            Ended/Suspended:{" "}
            {new Date(
              session.endedAt ?? session.suspendedAt ?? session.updatedAt
            ).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moves</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {session.moves.length === 0 ? (
            <p className="text-sm text-muted-foreground">No moves logged.</p>
          ) : (
            session.moves.map((move) => (
              <div
                key={move.id}
                className="rounded-md border p-3 text-sm text-muted-foreground"
              >
                <p className="font-medium text-foreground">{move.type}</p>
                <p>{new Date(move.createdAt).toLocaleString()}</p>
                {move.handIndex !== null ? <p>Hand: {move.handIndex + 1}</p> : null}
                {move.payload ? (
                  <pre className="mt-2 overflow-auto rounded bg-muted p-3 text-xs">
                    {JSON.stringify(move.payload, null, 2)}
                  </pre>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Snapshots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {session.snapshots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No snapshots logged.</p>
          ) : (
            session.snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="rounded-md border p-3 text-sm text-muted-foreground"
              >
                <p className="font-medium text-foreground">{snapshot.type}</p>
                <p>{new Date(snapshot.createdAt).toLocaleString()}</p>
                <pre className="mt-2 overflow-auto rounded bg-muted p-3 text-xs">
                  {JSON.stringify(snapshot.payload, null, 2)}
                </pre>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
