import { NextResponse } from "next/server";

import { ensureCurrentUserRecord, requireClerkUserId } from "@/lib/auth";
import {
  createBlackjackSession,
  getUserBlackjackSessionOverview,
} from "@/lib/blackjack-sessions";
import { SerializableSettingsState } from "@/lib/blackjack-session-types";

export async function GET() {
  try {
    const clerkUserId = await requireClerkUserId();
    const overview = await getUserBlackjackSessionOverview(clerkUserId);

    return NextResponse.json(overview);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch sessions";

    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureCurrentUserRecord();
    const clerkUserId = await requireClerkUserId();
    const body = (await request.json()) as {
      settingsSnapshot: SerializableSettingsState;
    };

    const session = await createBlackjackSession({
      clerkUserId,
      settingsSnapshot: body.settingsSnapshot,
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create session";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
