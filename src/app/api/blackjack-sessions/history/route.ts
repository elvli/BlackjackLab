import { NextResponse } from "next/server";

import { requireClerkUserId } from "@/lib/auth";
import { getPastBlackjackSessions } from "@/lib/blackjack-sessions";

export async function GET() {
  try {
    const clerkUserId = await requireClerkUserId();
    const sessions = await getPastBlackjackSessions(clerkUserId);

    return NextResponse.json(sessions);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch session history";

    return NextResponse.json({ error: message }, { status: 401 });
  }
}
