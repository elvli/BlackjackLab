import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createDeck, shuffleDeck, dealInitialHands, dealCard, calculateHandScore, Card } from "@/components/utils/cardUtils";

export enum GameResult {
  WIN = "WIN",
  LOSE = "LOSE",
  PUSH = "PUSH",
  SURRENDER = "SURRENDER",
  BLACKJACK = "BLACKJACK",
  BUST = "BUST",
}

interface PlayState {
  bankroll: number;
  currentBet: number;
  betPlaced: boolean;
  deck: Card[];
  playerHands: Card[][];
  dealerHand: Card[];
  playerScores: number[];
  dealerScore: number;
  currentHandIndex: number;
  endState: (GameResult | null)[];
}

const initialState: PlayState = {
  bankroll: 1000,
  currentBet: 0,
  betPlaced: false,
  deck: [],
  playerHands: [],
  dealerHand: [],
  playerScores: [],
  dealerScore: 0,
  currentHandIndex: 0,
  endState: [],
};

const playSlice = createSlice({
  name: "play",
  initialState,
  reducers: {
    placeBet(state, action: PayloadAction<number>) {
      const betAmount = action.payload;
      const finalBet = Math.min(betAmount, state.bankroll);

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
      let deck = createDeck(numDecks);
      deck = shuffleDeck(deck);

      state.deck = deck;

      const { playerHand, dealerHand } = dealInitialHands(deck);

      state.playerHands = [playerHand];
      state.dealerHand = dealerHand;

      state.playerScores = [calculateHandScore(playerHand)];
      state.dealerScore = calculateHandScore(dealerHand);

      state.currentHandIndex = 0;
      state.endState = new Array(state.playerHands.length).fill(null);
    },

    endRound(state, action: PayloadAction<(GameResult | null)[]>) {
      state.endState = action.payload;
      state.betPlaced = false;
    },

    hit(state) {
      const handIndex = state.currentHandIndex;
      if (state.deck.length === 0) return;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      const card = dealCard(state.deck);
      state.playerHands[handIndex].push(card);

      state.playerScores[handIndex] = calculateHandScore(state.playerHands[handIndex]);

      // Check if busted
      if (state.playerScores[handIndex] > 21) {
        console.log("Bust");
        state.endState[handIndex] = GameResult.BUST;

        // Move to next hand if available
        if (state.currentHandIndex < state.playerHands.length - 1) {
          state.currentHandIndex += 1;
        } else {
          // All hands played, trigger dealer logic
          // Example: reveal dealer cards and compute results
          while (state.dealerScore < 17 && state.deck.length > 0) {
            const dealerCard = dealCard(state.deck);
            state.dealerHand.push(dealerCard);
            state.dealerScore = calculateHandScore(state.dealerHand);
          }

          // Resolve each player's result
          state.playerScores.forEach((score, i) => {
            if (state.endState[i] !== null) return; // already busted

            if (score > 21) {
              state.endState[i] = GameResult.BUST;
            } else if (state.dealerScore > 21 || score > state.dealerScore) {
              state.endState[i] = GameResult.WIN;
              state.bankroll += state.currentBet * 2; // Optional: winnings logic
            } else if (score === state.dealerScore) {
              state.endState[i] = GameResult.PUSH;
              state.bankroll += state.currentBet; // Return bet
            } else {
              state.endState[i] = GameResult.LOSE;
            }
          });

          // Reset betPlaced so new round can start
          state.betPlaced = false;
          state.currentBet = 0;
        }
      }
    },


    stand(state) {
      console.log("stand");

      const handIndex = state.currentHandIndex;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      // Move to next hand if there is one
      if (state.currentHandIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        // All player hands played – dealer plays now
        while (state.dealerScore < 17 && state.deck.length > 0) {
          const dealerCard = dealCard(state.deck);
          state.dealerHand.push(dealerCard);
          state.dealerScore = calculateHandScore(state.dealerHand);
        }

        // Evaluate each player's hand against the dealer's
        state.playerScores.forEach((score, i) => {
          if (state.endState[i] === GameResult.BUST) return;

          if (score > 21) {
            state.endState[i] = GameResult.BUST;
          } else if (state.dealerScore > 21 || score > state.dealerScore) {
            state.endState[i] = GameResult.WIN;
            state.bankroll += state.currentBet * 2;
          } else if (score === state.dealerScore) {
            state.endState[i] = GameResult.PUSH;
            state.bankroll += state.currentBet;
          } else {
            state.endState[i] = GameResult.LOSE;
          }
        });

        // Cleanup for next round
        state.betPlaced = false;
        state.currentBet = 0;
      }
    },

    double(state) {
      console.log("double");
      const handIndex = state.currentHandIndex;
      if (state.deck.length === 0) return;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      const card = dealCard(state.deck);
      state.playerHands[handIndex].push(card);
      state.playerScores[handIndex] = calculateHandScore(state.playerHands[handIndex]);

      // Usually player stands after doubling
      if (state.playerScores[handIndex] > 21) {
        state.endState[handIndex] = GameResult.BUST;
      }

      if (handIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        // Dealer turn or end game
      }
    },

    split(state) {
      console.log("split");
      const handIndex = state.currentHandIndex;
      const handToSplit = state.playerHands[handIndex];

      if (
        handToSplit.length === 2 &&
        handToSplit[0].value === handToSplit[1].value &&
        state.deck.length > 0
      ) {
        const firstCard = handToSplit[0];
        const secondCard = handToSplit[1];

        state.playerHands.splice(handIndex, 1);
        state.playerScores.splice(handIndex, 1);
        state.endState.splice(handIndex, 1);

        const newHand1 = [firstCard, dealCard(state.deck)];
        const newHand2 = [secondCard, dealCard(state.deck)];

        state.playerHands.splice(handIndex, 0, newHand1, newHand2);
        state.playerScores.splice(handIndex, 0, calculateHandScore(newHand1), calculateHandScore(newHand2));
        state.endState.splice(handIndex, 0, null, null);

        // Keep currentHandIndex on first of split hands
        state.currentHandIndex = handIndex;
      }
    },

    surrender(state) {
      console.log("surrender");
      const handIndex = state.currentHandIndex;
      state.endState[handIndex] = GameResult.SURRENDER;
      // Player forfeits hand, usually ends turn on this hand
      if (handIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      }
    },

    // Call this once dealer has finished and you want to finalize results for each player hand
    finalizeResults(state) {
      const dealerScore = state.dealerScore;
      const dealerBust = dealerScore > 21;

      state.playerHands.forEach((hand, i) => {
        if (state.endState[i] !== null) {
          // Hand already has a result like BUST or SURRENDER, skip
          return;
        }

        const score = state.playerScores[i];

        if (score > 21) {
          state.endState[i] = GameResult.BUST;
          return;
        }

        if (score === 21 && hand.length === 2) {
          // Blackjack check (natural 21 with 2 cards)
          if (!(state.dealerScore === 21 && state.dealerHand.length === 2)) {
            state.endState[i] = GameResult.BLACKJACK;
            return;
          }
        }

        if (dealerBust) {
          state.endState[i] = GameResult.WIN;
          return;
        }

        if (score > dealerScore) {
          state.endState[i] = GameResult.WIN;
        } else if (score < dealerScore) {
          state.endState[i] = GameResult.LOSE;
        } else {
          state.endState[i] = GameResult.PUSH;
        }
      });
    },

    setCurrentHandIndex(state, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.playerHands.length) {
        state.currentHandIndex = action.payload;
      }
    },
  },
});

export const { placeBet, startGame, endRound, hit, stand, double, split, surrender, setCurrentHandIndex, finalizeResults } = playSlice.actions;

export default playSlice.reducer;