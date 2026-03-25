import { NextResponse } from "next/server";

import { requireClerkUserId } from "@/lib/auth";
import { resumeBlackjackSession } from "@/lib/blackjack-sessions";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const clerkUserId = await requireClerkUserId();
    const { sessionId } = await params;
    const session = await resumeBlackjackSession({ clerkUserId, sessionId });

    return NextResponse.json(session);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to resume session";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
