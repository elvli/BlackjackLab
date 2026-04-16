export type SerializableCard = {
  value: string;
  suit: string;
  score: number;
};

export type SerializablePlayState = {
  bankroll: number;
  currentBet: number;
  betPlaced: boolean;
  runningCount: number;
  dealerPhasePending: boolean;
  deck: SerializableCard[];
  playerHands: SerializableCard[][];
  dealerHand: SerializableCard[];
  playerScores: number[];
  dealerScore: number;
  showDealerCards: boolean;
  currentHandIndex: number;
  endState: Array<string | null>;
  doubledHands: number[];
  blackjackHands: number[];
};

export type SerializableSettingsState = {
  numDecks: number;
  numHands: number;
  soft17: string;
  reshuffle: string;
  allowSurrender: boolean;
  allowLateSurrender: boolean;
  allowDoubleSplit: boolean;
  allowResplitAces: boolean;
  allowInsurance: boolean;
  bjPayout: string;
  shoePenetration: number;
  showCount: boolean;
  showDealerScore: boolean;
  showOwnScore: boolean;
  showHiddenCard: boolean;
  showOptimalPlay: boolean;
  dealerSpeed: number;
  startingBankroll: number;
  startingBet: number;
  bettingIncrement: number;
};

export type BlackjackSessionSnapshotPayload = {
  playState: SerializablePlayState;
  settingsState: SerializableSettingsState;
  metadata?: {
    source?: string;
    note?: string;
  };
};

export type BlackjackMovePayload = {
  sessionId: string;
  type:
    | "START_SESSION"
    | "RESUME_SESSION"
    | "PLACE_BET"
    | "START_HAND"
    | "HIT"
    | "STAND"
    | "DOUBLE"
    | "SPLIT"
    | "SURRENDER"
    | "INSURANCE"
    | "END_HAND"
    | "END_SESSION"
    | "SUSPEND_SESSION";
  handIndex?: number | null;
  payload?: Record<string, unknown> | null;
};

export type BlackjackSessionSummaryDto = {
  id: string;
  status: "ACTIVE" | "SUSPENDED" | "ENDED";
  startedAt: string;
  updatedAt: string;
  lastActivityAt: string;
  endedAt: string | null;
  suspendedAt: string | null;
  moveCount: number;
  snapshotCount: number;
  settingsSnapshot: SerializableSettingsState | null;
  latestSnapshot: BlackjackSessionSnapshotPayload | null;
};

export type BlackjackSessionHistoryItemDto = BlackjackSessionSummaryDto;

export type BlackjackSessionDetailDto = BlackjackSessionSummaryDto & {
  moves: Array<{
    id: string;
    type: string;
    handIndex: number | null;
    createdAt: string;
    payload: Record<string, unknown> | null;
  }>;
  snapshots: Array<{
    id: string;
    type: string;
    createdAt: string;
    payload: BlackjackSessionSnapshotPayload;
  }>;
};
