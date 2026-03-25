import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import {
  BlackjackMovePayload,
  BlackjackSessionDetailDto,
  BlackjackSessionHistoryItemDto,
  BlackjackSessionSnapshotPayload,
  BlackjackSessionSummaryDto,
  SerializableSettingsState,
} from "@/lib/blackjack-session-types";

type SessionStatus = "ACTIVE" | "SUSPENDED" | "ENDED";
type MoveType = BlackjackMovePayload["type"];
type SnapshotKind = "TABLE_STATE";

type SessionRecord = {
  id: string;
  status: SessionStatus;
  startedAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  endedAt: Date | null;
  suspendedAt: Date | null;
  moveCount: number;
  snapshotCount: number;
  settingsSnapshot: Prisma.JsonValue | null;
  snapshots: Array<{
    id: string;
    type: string;
    createdAt: Date;
    payload: Prisma.JsonValue;
  }>;
  moves?: Array<{
    id: string;
    type: string;
    handIndex: number | null;
    createdAt: Date;
    payload: Prisma.JsonValue | null;
  }>;
};

type SessionDetailRecord = SessionRecord & {
  moves: Array<{
    id: string;
    type: string;
    handIndex: number | null;
    createdAt: Date;
    payload: Prisma.JsonValue | null;
  }>;
};

type BlackjackSessionDelegate = {
  findFirst(args: unknown): Promise<unknown>;
  findMany(args: unknown): Promise<unknown>;
  findFirstOrThrow(args: unknown): Promise<unknown>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  updateMany(args: unknown): Promise<unknown>;
};

const sessionInclude = {
  snapshots: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
};

const sessionStatus = {
  active: "ACTIVE" as SessionStatus,
  suspended: "SUSPENDED" as SessionStatus,
  ended: "ENDED" as SessionStatus,
};

const snapshotType = {
  tableState: "TABLE_STATE" as SnapshotKind,
};

const db = prisma as typeof prisma & {
  blackjackSession: BlackjackSessionDelegate;
};

function toSummaryDto(session: SessionRecord): BlackjackSessionSummaryDto {
  return {
    id: session.id,
    status: session.status,
    startedAt: session.startedAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    lastActivityAt: session.lastActivityAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    suspendedAt: session.suspendedAt?.toISOString() ?? null,
    moveCount: session.moveCount,
    snapshotCount: session.snapshotCount,
    settingsSnapshot:
      (session.settingsSnapshot as SerializableSettingsState | null) ?? null,
    latestSnapshot:
      (session.snapshots[0]?.payload as BlackjackSessionSnapshotPayload | undefined) ??
      null,
  };
}

export async function createBlackjackSession(params: {
  clerkUserId: string;
  settingsSnapshot: SerializableSettingsState;
}) {
  const { clerkUserId, settingsSnapshot } = params;

  const session = await prisma.$transaction(async (tx) => {
    const sessionDb = tx as typeof tx & {
      blackjackSession: BlackjackSessionDelegate;
    };

    await sessionDb.blackjackSession.updateMany({
      where: { clerkUserId, status: sessionStatus.active },
      data: {
        status: sessionStatus.suspended,
        suspendedAt: new Date(),
      },
    });

    return sessionDb.blackjackSession.create({
      data: {
        clerkUserId,
        settingsSnapshot: settingsSnapshot as Prisma.InputJsonValue,
        moves: {
          create: {
            type: "START_SESSION" satisfies MoveType,
            payload: { startedFrom: "game-table" },
          },
        },
        moveCount: 1,
      },
      include: sessionInclude,
    });
  }) as SessionRecord;

  return toSummaryDto(session);
}

export async function getActiveBlackjackSession(clerkUserId: string) {
  const session = (await db.blackjackSession.findFirst({
    where: {
      clerkUserId,
      status: sessionStatus.active,
    },
    orderBy: { updatedAt: "desc" },
    include: sessionInclude,
  })) as SessionRecord | null;

  return session ? toSummaryDto(session) : null;
}

export async function getLatestSuspendedBlackjackSession(clerkUserId: string) {
  const session = (await db.blackjackSession.findFirst({
    where: {
      clerkUserId,
      status: sessionStatus.suspended,
    },
    orderBy: { suspendedAt: "desc" },
    include: sessionInclude,
  })) as SessionRecord | null;

  return session ? toSummaryDto(session) : null;
}

export async function getUserBlackjackSessionOverview(clerkUserId: string) {
  const [activeSession, suspendedSession] = await Promise.all([
    getActiveBlackjackSession(clerkUserId),
    getLatestSuspendedBlackjackSession(clerkUserId),
  ]);

  return { activeSession, suspendedSession };
}

export async function getPastBlackjackSessions(
  clerkUserId: string
): Promise<BlackjackSessionHistoryItemDto[]> {
  const sessions = (await db.blackjackSession.findMany({
    where: {
      clerkUserId,
      status: {
        in: [sessionStatus.suspended, sessionStatus.ended],
      },
    },
    orderBy: { startedAt: "desc" },
    include: sessionInclude,
  })) as SessionRecord[];

  return sessions.map(toSummaryDto);
}

export async function getBlackjackSessionDetail(params: {
  clerkUserId: string;
  sessionId: string;
}): Promise<BlackjackSessionDetailDto | null> {
  const session = (await db.blackjackSession.findFirst({
    where: {
      id: params.sessionId,
      clerkUserId: params.clerkUserId,
    },
    include: {
      snapshots: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      moves: {
        orderBy: { createdAt: "asc" },
        take: 500,
      },
    },
  })) as SessionDetailRecord | null;

  if (!session) {
    return null;
  }

  return {
    id: session.id,
    status: session.status,
    startedAt: session.startedAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    lastActivityAt: session.lastActivityAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    suspendedAt: session.suspendedAt?.toISOString() ?? null,
    moveCount: session.moveCount,
    snapshotCount: session.snapshotCount,
    settingsSnapshot:
      (session.settingsSnapshot as SerializableSettingsState | null) ?? null,
    latestSnapshot:
      (session.snapshots[0]?.payload as BlackjackSessionSnapshotPayload | undefined) ??
      null,
    moves: session.moves.map((move) => ({
      id: move.id,
      type: move.type,
      handIndex: move.handIndex,
      createdAt: move.createdAt.toISOString(),
      payload: (move.payload as Record<string, unknown> | null) ?? null,
    })),
    snapshots: session.snapshots.map((snapshot) => ({
      id: snapshot.id,
      type: snapshot.type,
      createdAt: snapshot.createdAt.toISOString(),
      payload: snapshot.payload as BlackjackSessionSnapshotPayload,
    })),
  };
}

export async function resumeBlackjackSession(params: {
  clerkUserId: string;
  sessionId: string;
}) {
  const existing = await db.blackjackSession.findFirst({
    where: {
      id: params.sessionId,
      clerkUserId: params.clerkUserId,
      status: sessionStatus.suspended,
    },
  });

  if (!existing) {
    throw new Error("Session not found");
  }

  const session = (await prisma.$transaction(async (tx) => {
    const sessionDb = tx as typeof tx & {
      blackjackSession: BlackjackSessionDelegate;
    };

    await sessionDb.blackjackSession.updateMany({
      where: {
        clerkUserId: params.clerkUserId,
        status: sessionStatus.active,
        NOT: { id: params.sessionId },
      },
      data: {
        status: sessionStatus.suspended,
        suspendedAt: new Date(),
      },
    });

    await sessionDb.blackjackSession.update({
      where: {
        id: params.sessionId,
      },
      data: {
        status: sessionStatus.active,
        suspendedAt: null,
        lastActivityAt: new Date(),
        moves: {
          create: {
            type: "RESUME_SESSION" satisfies MoveType,
            payload: { resumedFrom: "prompt" },
          },
        },
        moveCount: {
          increment: 1,
        },
      },
    });

    return sessionDb.blackjackSession.findFirstOrThrow({
      where: {
        id: params.sessionId,
        clerkUserId: params.clerkUserId,
      },
      include: sessionInclude,
    });
  })) as SessionRecord;

  return toSummaryDto(session);
}

export async function suspendBlackjackSession(params: {
  clerkUserId: string;
  sessionId: string;
  reason?: string;
}) {
  const existing = await db.blackjackSession.findFirst({
    where: {
      id: params.sessionId,
      clerkUserId: params.clerkUserId,
    },
  });

  if (!existing) {
    return null;
  }

  const session = (await db.blackjackSession.update({
    where: { id: params.sessionId },
    data: {
      status: sessionStatus.suspended,
      suspendedAt: new Date(),
      lastActivityAt: new Date(),
      moves: {
        create: {
          type: "SUSPEND_SESSION" satisfies MoveType,
          payload: { reason: params.reason ?? "pagehide" },
        },
      },
      moveCount: {
        increment: 1,
      },
    },
    include: sessionInclude,
  })) as SessionRecord;

  return toSummaryDto(session);
}

export async function endBlackjackSession(params: {
  clerkUserId: string;
  sessionId: string;
  reason?: string;
}) {
  const existing = await db.blackjackSession.findFirst({
    where: {
      id: params.sessionId,
      clerkUserId: params.clerkUserId,
    },
  });

  if (!existing) {
    return null;
  }

  const session = (await db.blackjackSession.update({
    where: { id: params.sessionId },
    data: {
      status: sessionStatus.ended,
      endedAt: new Date(),
      suspendedAt: null,
      lastActivityAt: new Date(),
      moves: {
        create: {
          type: "END_SESSION" satisfies MoveType,
          payload: { reason: params.reason ?? "manual" },
        },
      },
      moveCount: {
        increment: 1,
      },
    },
    include: sessionInclude,
  })) as SessionRecord;

  return toSummaryDto(session);
}

export async function touchBlackjackSession(params: {
  clerkUserId: string;
  sessionId: string;
}) {
  const session = (await db.blackjackSession.findFirst({
    where: {
      id: params.sessionId,
      clerkUserId: params.clerkUserId,
      status: sessionStatus.active,
    },
    include: sessionInclude,
  })) as SessionRecord | null;

  if (!session) {
    return null;
  }

  const updated = (await db.blackjackSession.update({
    where: { id: params.sessionId },
    data: {
      lastActivityAt: new Date(),
      suspendedAt: null,
    },
    include: sessionInclude,
  })) as SessionRecord;

  return toSummaryDto(updated);
}

export async function logBlackjackMove(params: {
  clerkUserId: string;
  move: BlackjackMovePayload;
}) {
  const session = await db.blackjackSession.findFirst({
    where: {
      id: params.move.sessionId,
      clerkUserId: params.clerkUserId,
      status: sessionStatus.active,
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  await db.blackjackSession.update({
    where: { id: params.move.sessionId },
    data: {
      lastActivityAt: new Date(),
      moves: {
        create: {
          type: params.move.type as MoveType,
          handIndex: params.move.handIndex ?? null,
          payload: (params.move.payload ?? null) as Prisma.InputJsonValue | null,
        },
      },
      moveCount: {
        increment: 1,
      },
    },
  });
}

export async function logBlackjackSnapshot(params: {
  clerkUserId: string;
  sessionId: string;
  payload: BlackjackSessionSnapshotPayload;
  type?: SnapshotKind;
}) {
  const session = await db.blackjackSession.findFirst({
    where: {
      id: params.sessionId,
      clerkUserId: params.clerkUserId,
      status: sessionStatus.active,
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  await db.blackjackSession.update({
    where: { id: params.sessionId },
    data: {
      lastActivityAt: new Date(),
      settingsSnapshot:
        params.payload.settingsState as unknown as Prisma.InputJsonValue,
      snapshots: {
        create: {
          type: params.type ?? snapshotType.tableState,
          payload: params.payload as unknown as Prisma.InputJsonValue,
        },
      },
      snapshotCount: {
        increment: 1,
      },
    },
  });
}
