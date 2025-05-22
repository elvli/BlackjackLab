import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createDeck, shuffleDeck, dealInitialHands, dealCard, calculateHandScore, Card } from "@/components/utils/cardUtils";
import { Draft } from "immer";

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

function resolveDealerAndOutcomes(state: Draft<PlayState>) {
  // Dealer draws until at least 17
  while (state.dealerScore < 17 && state.deck.length > 0) {
    const dealerCard = dealCard(state.deck);
    state.dealerHand.push(dealerCard);
    state.dealerScore = calculateHandScore(state.dealerHand);
  }

  // Evaluate each player's hand against the dealer
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

  // Reset bet state
  state.betPlaced = false;
  state.currentBet = 0;
}



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
        console.log(JSON.parse(JSON.stringify(state.endState)));
        // Move to next hand if available
        if (state.currentHandIndex < state.playerHands.length - 1) {
          state.currentHandIndex += 1;
        } else {
          resolveDealerAndOutcomes(state);

          console.log("endState hit", JSON.parse(JSON.stringify(state.endState)));
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
        resolveDealerAndOutcomes(state);

        console.log("endState stand", JSON.parse(JSON.stringify(state.endState)));
      }
    },

    double(state) {
      console.log("double");
      const handIndex = state.currentHandIndex;
      if (state.deck.length === 0) return;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      // Take one card and double the bet
      const card = dealCard(state.deck);
      state.playerHands[handIndex].push(card);
      state.playerScores[handIndex] = calculateHandScore(state.playerHands[handIndex]);

      // Immediate stand after double
      if (state.playerScores[handIndex] > 21) {
        console.log("Bust");
        state.endState[handIndex] = GameResult.BUST;
      }

      // Move to next hand or dealer logic
      if (state.currentHandIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        resolveDealerAndOutcomes(state);

        console.log("endState double", JSON.parse(JSON.stringify(state.endState)));
      }
    }
    ,

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
        console.log("actually splitting");
        const firstCard = handToSplit[0];
        const secondCard = handToSplit[1];
        console.log(firstCard, secondCard);

        // Remove original hand's data
        state.playerHands.splice(handIndex, 1);
        state.playerScores.splice(handIndex, 1);
        state.endState.splice(handIndex, 1);

        // Create new hands
        const newHand1 = [firstCard, dealCard(state.deck)];
        const newHand2 = [secondCard, dealCard(state.deck)];

        // Insert new hands
        state.playerHands.splice(handIndex, 0, newHand1, newHand2);
        state.playerScores.splice(handIndex, 0, calculateHandScore(newHand1), calculateHandScore(newHand2));
        state.endState.splice(handIndex, 0, null, null);

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

      // Refund half of the bet
      state.bankroll += state.currentBet / 2;

      // Move to next hand if available
      if (handIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        resolveDealerAndOutcomes(state);
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