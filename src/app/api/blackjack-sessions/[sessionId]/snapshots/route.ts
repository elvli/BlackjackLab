import { NextResponse } from "next/server";

import { requireClerkUserId } from "@/lib/auth";
import { logBlackjackSnapshot } from "@/lib/blackjack-sessions";
import { BlackjackSessionSnapshotPayload } from "@/lib/blackjack-session-types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const clerkUserId = await requireClerkUserId();
    const { sessionId } = await params;
    const body = (await request.json()) as {
      payload: BlackjackSessionSnapshotPayload;
    };

    await logBlackjackSnapshot({
      clerkUserId,
      sessionId,
      payload: body.payload,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to log snapshot";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
