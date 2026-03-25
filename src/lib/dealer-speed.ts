export const DEALER_SPEED_MIN = 0;
export const DEALER_SPEED_MAX = 1500;
export const DEALER_SPEED_DEFAULT = 700;
export const DEALER_SPEED_STEP = 100;

export function getDealerSpeedLabel(dealerSpeed: number) {
  if (dealerSpeed === 0) {
    return "Instant";
  }

  if (dealerSpeed <= 500) {
    return "Fast";
  }

  if (dealerSpeed <= 900) {
    return "Normal";
  }

  return "Slow";
}

export function getCardDealAnimationDuration(dealerSpeed: number) {
  if (dealerSpeed === 0) {
    return 0;
  }

  const minDuration = 0.12;
  const maxDuration = 0.45;

  return minDuration + (dealerSpeed / DEALER_SPEED_MAX) * (maxDuration - minDuration);
}
