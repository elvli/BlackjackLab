import type { Card } from "@/components/utils/cardUtils";

export type HiLoCountValue = -1 | 0 | 1;

/**
 * Standard Hi-Lo counting:
 * 2-6 = +1, 7-9 = 0, 10/J/Q/K/A = -1
 */
export function getHiLoCountValue(cardValue: string): HiLoCountValue {
  if (["2", "3", "4", "5", "6"].includes(cardValue)) {
    return 1;
  }

  if (["7", "8", "9"].includes(cardValue)) {
    return 0;
  }

  return -1;
}

export function getHiLoCountValueFromCardCode(cardCode: string): HiLoCountValue {
  const [cardValue] = cardCode.split("-");
  return getHiLoCountValue(cardValue);
}

export function updateRunningCount(
  currentCount: number,
  card: Pick<Card, "value"> | string
): number {
  const cardValue = typeof card === "string" ? card.split("-")[0] : card.value;
  return currentCount + getHiLoCountValue(cardValue);
}
