import { NextResponse } from "next/server";

import { requireClerkUserId } from "@/lib/auth";
import { suspendBlackjackSession } from "@/lib/blackjack-sessions";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const clerkUserId = await requireClerkUserId();
    const { sessionId } = await params;
    const body = request.headers.get("content-type")?.includes("application/json")
      ? ((await request.json()) as { reason?: string })
      : {};

    const session = await suspendBlackjackSession({
      clerkUserId,
      sessionId,
      reason: body.reason,
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to suspend session";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
