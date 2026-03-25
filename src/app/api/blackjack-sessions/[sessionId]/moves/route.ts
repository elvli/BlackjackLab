import { NextResponse } from "next/server";

import { requireClerkUserId } from "@/lib/auth";
import { logBlackjackMove } from "@/lib/blackjack-sessions";
import { BlackjackMovePayload } from "@/lib/blackjack-session-types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const clerkUserId = await requireClerkUserId();
    const { sessionId } = await params;
    const body = (await request.json()) as Omit<BlackjackMovePayload, "sessionId">;

    await logBlackjackMove({
      clerkUserId,
      move: {
        sessionId,
        type: body.type,
        handIndex: body.handIndex,
        payload: body.payload,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to log move";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
