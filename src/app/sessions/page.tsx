import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getPastBlackjackSessions } from "@/lib/blackjack-sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SessionsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const sessions = await getPastBlackjackSessions(userId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Session History</h1>
          <p className="text-sm text-muted-foreground">
            Review suspended and completed blackjack training sessions.
          </p>
        </div>

        <Button asChild>
          <Link href="/">Back to Table</Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No past sessions yet. Start a session at the table and your history
            will show up here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Session {session.id.slice(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-muted-foreground">
                  <p>Started: {new Date(session.startedAt).toLocaleString()}</p>
                  <p>Status: {session.status}</p>
                  <p>
                    Ended/Suspended:{" "}
                    {new Date(
                      session.endedAt ?? session.suspendedAt ?? session.updatedAt
                    ).toLocaleString()}
                  </p>
                  <p>Moves logged: {session.moveCount}</p>
                </div>

                <Button variant="outline" asChild>
                  <Link href={`/sessions/${session.id}`}>View Session</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
