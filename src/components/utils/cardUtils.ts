export type Card = {
  value: string;
  suit: string;
  score: number;
};

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'] as const;
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

const cardValues: { [key in typeof values[number]]: number } = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
  'A': 11,
};

export const createDeck = (numDecks: number): Card[] => {
  const deck: Card[] = [];

  // Loop to create multiple decks
  for (let i = 0; i < numDecks; i++) {
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ value, suit, score: cardValues[value] });
      }
    }
  }

  return deck;
};

// Shuffle the deck
// Fisher–Yates shuffle, O(n), done in-place
export const shuffleDeck = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
  }
  return deck;
};

export const dealInitialHands = (deck: Card[]): { playerHand: Card[]; dealerHand: Card[] } => {
  const playerHand: Card[] = [];
  const dealerHand: Card[] = [];

  playerHand.push(deck.pop() as Card);  // 1st card to player
  dealerHand.push(deck.pop() as Card);  // 1st card to dealer
  playerHand.push(deck.pop() as Card);  // 2nd card to player
  dealerHand.push(deck.pop() as Card);  // 2nd card to dealer

  return { playerHand, dealerHand };
};


// Deal a single card
export const dealCard = (deck: Card[]): Card => {
  return deck.pop() as Card;
};

export function calculateHandScore(hand: Card[]): number {
  let score = 0;
  let aceCount = 0;

  for (const card of hand) {
    score += card.score;
    if (card.value === "A") aceCount++;
  }

  // Adjust for Aces if score > 21
  while (score > 21 && aceCount > 0) {
    score -= 10; // count one Ace as 1 instead of 11
    aceCount--;
  }

  return score;
}


export { cardValues };