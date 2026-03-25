-- CreateEnum
CREATE TYPE "BlackjackSessionStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ENDED');

-- CreateEnum
CREATE TYPE "BlackjackMoveType" AS ENUM ('START_SESSION', 'RESUME_SESSION', 'PLACE_BET', 'START_HAND', 'HIT', 'STAND', 'DOUBLE', 'SPLIT', 'SURRENDER', 'INSURANCE', 'END_HAND', 'END_SESSION', 'SUSPEND_SESSION');

-- CreateEnum
CREATE TYPE "SnapshotType" AS ENUM ('TABLE_STATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "pushes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "numDecks" INTEGER NOT NULL,
    "numHands" INTEGER NOT NULL,
    "soft17" TEXT NOT NULL,
    "reshuffle" TEXT NOT NULL,
    "allowSurrender" BOOLEAN NOT NULL,
    "allowLateSurrender" BOOLEAN NOT NULL,
    "allowDoubleSplit" BOOLEAN NOT NULL,
    "allowResplitAces" BOOLEAN NOT NULL,
    "allowInsurance" BOOLEAN NOT NULL,
    "bjPayout" TEXT NOT NULL,
    "shoePenetration" DOUBLE PRECISION NOT NULL,
    "showCount" BOOLEAN NOT NULL,
    "showHiddenCard" BOOLEAN NOT NULL,
    "showOptimalPlay" BOOLEAN NOT NULL,
    "startingBankroll" INTEGER NOT NULL,
    "startingBet" INTEGER NOT NULL,
    "bettingIncrement" INTEGER NOT NULL,
    "autoBet" BOOLEAN NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlackjackSession" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "status" "BlackjackSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "settingsSnapshot" JSONB,
    "summary" JSONB,
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "snapshotCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BlackjackSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlackjackSessionMove" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "BlackjackMoveType" NOT NULL,
    "handIndex" INTEGER,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlackjackSessionMove_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlackjackSessionSnapshot" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "SnapshotType" NOT NULL DEFAULT 'TABLE_STATE',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlackjackSessionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE INDEX "BlackjackSession_clerkUserId_status_updatedAt_idx" ON "BlackjackSession"("clerkUserId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "BlackjackSession_clerkUserId_startedAt_idx" ON "BlackjackSession"("clerkUserId", "startedAt");

-- CreateIndex
CREATE INDEX "BlackjackSessionMove_sessionId_createdAt_idx" ON "BlackjackSessionMove"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "BlackjackSessionSnapshot_sessionId_createdAt_idx" ON "BlackjackSessionSnapshot"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlackjackSession" ADD CONSTRAINT "BlackjackSession_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlackjackSessionMove" ADD CONSTRAINT "BlackjackSessionMove_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "BlackjackSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlackjackSessionSnapshot" ADD CONSTRAINT "BlackjackSessionSnapshot_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "BlackjackSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
