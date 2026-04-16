import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createDeck, shuffleDeck, dealInitialHands, dealCard, calculateHandScore, Card } from "@/components/utils/cardUtils";
// createRiggedDeckForBlackjack
import { Draft } from "immer";
import { updateRunningCount } from "@/lib/cardCount";
import { sanitizeBetAmount, sanitizeStartingBankroll } from "@/lib/betting-settings";

export enum GameResult {
  WIN = "WIN",
  LOSE = "LOSE",
  PUSH = "PUSH",
  SURRENDER = "SURRENDER",
  BUST = "BUST",
}

export interface PlayState {
  bankroll: number;
  currentBet: number;
  betPlaced: boolean;
  runningCount: number;
  dealerPhasePending: boolean;
  deck: Card[];
  playerHands: Card[][];
  dealerHand: Card[];
  playerScores: number[];
  dealerScore: number;
  showDealerCards: boolean;
  currentHandIndex: number;
  endState: (GameResult | null)[];
  doubledHands: number[];
  blackjackHands: number[];
}

export const initialPlayState: PlayState = {
  bankroll: 1000,
  currentBet: 0,
  betPlaced: false,
  runningCount: 0,
  dealerPhasePending: false,
  deck: [],
  playerHands: [],
  dealerHand: [],
  playerScores: [],
  dealerScore: 0,
  showDealerCards: false,
  currentHandIndex: 0,
  endState: [],
  doubledHands: [],
  blackjackHands: [],
};

function addRevealedCardToHand(
  state: Draft<PlayState>,
  target: "player" | "dealer",
  card: Card,
  handIndex = 0
) {
  if (target === "dealer") {
    state.dealerHand.push(card);
    state.dealerScore = calculateHandScore(state.dealerHand);
  } else {
    state.playerHands[handIndex].push(card);
    state.playerScores[handIndex] = calculateHandScore(state.playerHands[handIndex]);
  }

  state.runningCount = updateRunningCount(state.runningCount, card);
}


function beginDealerTurn(state: Draft<PlayState>) {
  state.showDealerCards = true;
  state.dealerPhasePending = true;
}

function resolveDealerOutcomes(state: Draft<PlayState>) {
  // Evaluate each player's hand against the dealer and calculate payout
  state.playerScores.forEach((score, i) => {
    const isDoubled = state.doubledHands.includes(i);
    const isBlackjack = state.blackjackHands.includes(i);
    const baseBet = isDoubled ? state.currentBet * 2 : state.currentBet;

    if (state.endState[i] === GameResult.SURRENDER) {
      state.bankroll += baseBet / 2;
      return;
    }

    if (state.endState[i] === GameResult.BUST) return;

    const dealerHasBlackjack = state.dealerHand.length === 2 && calculateHandScore(state.dealerHand) === 21;

    if (isBlackjack) {
      if (dealerHasBlackjack) {
        state.endState[i] = GameResult.PUSH;
        state.bankroll += baseBet;
      } else {
        state.endState[i] = GameResult.WIN;
        state.bankroll += baseBet + baseBet * 1.5; //BJ multiplier
      }
      return;
    }

    if (score > 21) {
      state.endState[i] = GameResult.BUST;
    } else if (state.dealerScore > 21 || score > state.dealerScore) {
      state.endState[i] = GameResult.WIN;
      state.bankroll += baseBet * 2;
    } else if (score === state.dealerScore) {
      state.endState[i] = GameResult.PUSH;
      state.bankroll += baseBet;
    } else {
      state.endState[i] = GameResult.LOSE;
    }
  });


  state.endState.forEach((hand, i) => {
    console.log("hand", i + 1, JSON.parse(JSON.stringify(hand)));
  });

  console.log("doubledHands", JSON.parse(JSON.stringify(state.doubledHands)));
  console.log("blackjackHands", JSON.parse(JSON.stringify(state.blackjackHands)));

  // Reset bet state
  state.betPlaced = false;
  state.currentBet = 0;
  state.doubledHands = [];
  state.blackjackHands = [];
  state.dealerPhasePending = false;
}


const playSlice = createSlice({
  name: "play",
  initialState: initialPlayState,
  reducers: {
    placeBet(state, action: PayloadAction<number>) {
      if (state.bankroll <= 0) {
        return;
      }

      const betAmount = sanitizeBetAmount(action.payload, state.bankroll);
      const finalBet = Math.min(betAmount, state.bankroll);

      if (finalBet <= 0) {
        return;
      }

      state.currentBet = finalBet;
      state.bankroll -= finalBet;
      state.betPlaced = true;
    },


    startGame(state, action: PayloadAction<number | undefined>) {
      if (!state.betPlaced) {
        console.log("Error. Can't start game, bet has not been placed");
        return;
      }


      const numDecks = action.payload ?? 1;
      console.log("numDecks:", numDecks)
      if (state.deck.length < 4) {
        state.deck = shuffleDeck(createDeck(numDecks));
        state.runningCount = 0;
      }

      const { playerHand, dealerHand } = dealInitialHands(state.deck);

      state.playerHands = [[]];
      state.dealerHand = [];
      state.playerScores = [0];
      state.dealerScore = 0;
      state.showDealerCards = false;
      state.dealerPhasePending = false;
      state.blackjackHands = [];
      state.doubledHands = [];

      addRevealedCardToHand(state, "player", playerHand[0], 0);
      addRevealedCardToHand(state, "dealer", dealerHand[0]);
      addRevealedCardToHand(state, "player", playerHand[1], 0);
      addRevealedCardToHand(state, "dealer", dealerHand[1]);

      state.currentHandIndex = 0;
      state.endState = new Array(state.playerHands.length).fill(null);

      // === New Blackjack Logic ===
      const playerHasBlackjack = playerHand.length === 2 && state.playerScores[0] === 21;
      const dealerHasBlackjack = dealerHand.length === 2 && state.dealerScore === 21;

      if (playerHasBlackjack) {
        if (dealerHasBlackjack) {
          // Push
          state.endState[0] = GameResult.PUSH;
          state.bankroll += state.currentBet; // Refund bet
        } else {
          // Immediate Blackjack payout
          state.endState[0] = GameResult.WIN;
          state.bankroll += state.currentBet + state.currentBet * 1.5; // Original bet + 1.5x payout
        }

        state.blackjackHands.push(0); // Record this as a blackjack hand

        // Reset bet state immediately
        state.betPlaced = false;
        state.currentBet = 0;
      }
    },


    hit(state) {
      const handIndex = state.currentHandIndex;
      if (state.deck.length === 0) return;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      const card = dealCard(state.deck);
      addRevealedCardToHand(state, "player", card, handIndex);

      // Check if busted
      if (state.playerScores[handIndex] > 21) {
        state.endState[handIndex] = GameResult.BUST;
        console.log(JSON.parse(JSON.stringify(state.endState)));

        // Move to next hand or dealer logic
        if (state.currentHandIndex < state.playerHands.length - 1) {
          state.currentHandIndex += 1;
        } else {
          beginDealerTurn(state);

          console.log("endState hit", JSON.parse(JSON.stringify(state.endState)));
        }
      }
    },

    stand(state) {
      console.log("stand");

      const handIndex = state.currentHandIndex;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      // Check for Blackjack
      const hand = state.playerHands[handIndex];
      const score = state.playerScores[handIndex];
      if (hand.length === 2 && score === 21) {
        if (!state.blackjackHands.includes(handIndex)) {
          console.log("blackjack!!!")
          state.blackjackHands.push(handIndex);
        }
      }

      // Move to next hand or dealer logic
      if (state.currentHandIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        beginDealerTurn(state);

        console.log("endState stand", JSON.parse(JSON.stringify(state.endState)));
      }
    },


    double(state) {
      console.log("double");
      const handIndex = state.currentHandIndex;
      if (state.deck.length === 0) return;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      // Double the bet by deducting currentBet from bankroll
      state.bankroll -= state.currentBet;

      const card = dealCard(state.deck);
      addRevealedCardToHand(state, "player", card, handIndex);

      // Stand after double
      if (state.playerScores[handIndex] > 21) {
        console.log("Bust");
        state.endState[handIndex] = GameResult.BUST;
      }

      // Move to next hand or resolve game
      if (state.currentHandIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        // Mark this hand as doubled for special payout
        if (!state.doubledHands) state.doubledHands = [];
        if (!state.doubledHands.includes(handIndex)) {
          state.doubledHands.push(handIndex);
        }

        beginDealerTurn(state);
        console.log("endState double", JSON.parse(JSON.stringify(state.endState)));
      }
    },


    split(state) {
      console.log("split");
      const handIndex = state.currentHandIndex;
      const handToSplit = state.playerHands[handIndex];

      console.log(handIndex, JSON.parse(JSON.stringify(handToSplit)));

      if (
        handToSplit.length === 2 &&
        handToSplit[0].value === handToSplit[1].value &&
        state.deck.length > 0
      ) {
        const firstCard = handToSplit[0];
        const secondCard = handToSplit[1];
        console.log("cards", firstCard, secondCard);

        // Remove original hand's data
        state.playerHands.splice(handIndex, 1);
        state.playerScores.splice(handIndex, 1);
        state.endState.splice(handIndex, 1);

        // Create new hands
        const newHand1 = [firstCard, dealCard(state.deck)];
        const newHand2 = [secondCard, dealCard(state.deck)];

        // Insert new hands
        state.playerHands.splice(handIndex, 0, [firstCard], [secondCard]);
        state.playerScores.splice(handIndex, 0, calculateHandScore([firstCard]), calculateHandScore([secondCard]));
        state.endState.splice(handIndex, 0, null, null);
        addRevealedCardToHand(state, "player", newHand1[1], handIndex);
        addRevealedCardToHand(state, "player", newHand2[1], handIndex + 1);

        // Charge player for the second hand's bet
        state.bankroll -= state.currentBet;

        state.currentHandIndex = handIndex;
        ;
      }
    },


    surrender(state) {
      console.log("surrender");
      const handIndex = state.currentHandIndex;

      // Mark this hand as surrendered
      state.endState[handIndex] = GameResult.SURRENDER;

      // Move to next hand if available
      if (handIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        beginDealerTurn(state);
      }
    },
    dealerHitOne(state) {
      if (!state.dealerPhasePending || state.deck.length === 0) return;

      const dealerCard = dealCard(state.deck);
      addRevealedCardToHand(state, "dealer", dealerCard);
    },
    finishDealerTurn(state) {
      resolveDealerOutcomes(state);
    },


    setCurrentHandIndex(state, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.playerHands.length) {
        state.currentHandIndex = action.payload;
      }
    },
    hydratePlayState(_state, action: PayloadAction<PlayState>) {
      return {
        ...action.payload,
        runningCount: action.payload.runningCount ?? 0,
        dealerPhasePending: action.payload.dealerPhasePending ?? false,
      };
    },
    resetPlayState(_state, action: PayloadAction<number | undefined>) {
      return {
        ...initialPlayState,
        bankroll: sanitizeStartingBankroll(action.payload ?? initialPlayState.bankroll),
      };
    },
  },
});

export const {
  placeBet,
  startGame,
  hit,
  stand,
  double,
  split,
  surrender,
  dealerHitOne,
  finishDealerTurn,
  setCurrentHandIndex,
  hydratePlayState,
  resetPlayState,
} = playSlice.actions;

export default playSlice.reducer;
