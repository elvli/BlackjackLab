const CARD_ASPECT_RATIO = 1065 / 769;

const MIN_CARD_WIDTH = 72;
const MAX_CARD_WIDTH = 136;
const FALLBACK_CARD_WIDTH = 104;
const MIN_STEP_RATIO = 0.12;
const MAX_STEP_RATIO = 0.52;

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export type CardFanMetrics = {
  cardWidth: number;
  cardHeight: number;
  fanWidth: number;
  step: number;
  overlap: number;
};

export function getResponsiveCardWidth(containerWidth: number) {
  if (containerWidth <= 0) {
    return FALLBACK_CARD_WIDTH;
  }

  if (containerWidth < 280) {
    return MIN_CARD_WIDTH;
  }

  if (containerWidth < 360) {
    return 92;
  }

  if (containerWidth < 480) {
    return 112;
  }

  return MAX_CARD_WIDTH;
}

export function getCardFanMetrics(
  containerWidth: number,
  cardCount: number
): CardFanMetrics {
  const safeCount = Math.max(cardCount, 1);
  const cardWidth = getResponsiveCardWidth(containerWidth);
  const cardHeight = cardWidth * CARD_ASPECT_RATIO;

  if (safeCount === 1) {
    return {
      cardWidth,
      cardHeight,
      fanWidth: cardWidth,
      step: cardWidth,
      overlap: 0,
    };
  }

  const usableWidth = Math.max(containerWidth - 8, cardWidth);
  const rawStep = (usableWidth - cardWidth) / (safeCount - 1);
  const minStep = cardWidth * MIN_STEP_RATIO;
  const maxStep = cardWidth * MAX_STEP_RATIO;
  const step = clampNumber(rawStep, minStep, maxStep);
  const fanWidth = cardWidth + step * (safeCount - 1);

  return {
    cardWidth,
    cardHeight,
    fanWidth,
    step,
    overlap: Math.max(cardWidth - step, 0),
  };
}
