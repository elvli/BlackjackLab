import { NextResponse } from "next/server";

import { requireClerkUserId } from "@/lib/auth";
import { endBlackjackSession } from "@/lib/blackjack-sessions";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const clerkUserId = await requireClerkUserId();
    const { sessionId } = await params;
    const body = (await request.json().catch(() => ({}))) as { reason?: string };

    const session = await endBlackjackSession({
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
      error instanceof Error ? error.message : "Unable to end session";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
