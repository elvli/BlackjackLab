export const MIN_STARTING_BANKROLL = 1;
export const MAX_STARTING_BANKROLL = 999999;
export const MIN_STARTING_BET = 1;
export const MAX_STARTING_BET = 10000;
export const MIN_BETTING_INCREMENT = 1;
export const MAX_BETTING_INCREMENT = 5000;

function toWholeDollar(value: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.trunc(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function sanitizeStartingBankroll(value: number) {
  return clamp(
    toWholeDollar(value, MIN_STARTING_BANKROLL),
    MIN_STARTING_BANKROLL,
    MAX_STARTING_BANKROLL
  );
}

export function getMaxStartingBet(bankroll: number) {
  return Math.min(MAX_STARTING_BET, Math.max(MIN_STARTING_BET, bankroll));
}

export function sanitizeStartingBet(value: number, bankroll: number) {
  return clamp(
    toWholeDollar(value, MIN_STARTING_BET),
    MIN_STARTING_BET,
    getMaxStartingBet(bankroll)
  );
}

export function getMaxBettingIncrement(bankroll: number) {
  return Math.min(MAX_BETTING_INCREMENT, Math.max(MIN_BETTING_INCREMENT, bankroll));
}

export function sanitizeBettingIncrement(value: number, bankroll: number) {
  return clamp(
    toWholeDollar(value, MIN_BETTING_INCREMENT),
    MIN_BETTING_INCREMENT,
    getMaxBettingIncrement(bankroll)
  );
}

export function sanitizeBetAmount(value: number, bankroll: number) {
  if (bankroll <= 0) {
    return 0;
  }

  return clamp(
    toWholeDollar(value, MIN_STARTING_BET),
    MIN_STARTING_BET,
    Math.max(MIN_STARTING_BET, bankroll)
  );
}
