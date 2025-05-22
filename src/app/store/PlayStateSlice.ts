import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createDeck, shuffleDeck, dealInitialHands, dealCard, calculateHandScore, Card } from "@/components/utils/cardUtils";
import { Draft } from "immer";

export enum GameResult {
  WIN = "WIN",
  LOSE = "LOSE",
  PUSH = "PUSH",
  SURRENDER = "SURRENDER",
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
  doubledHands: number[];
  blackjackHands: number[];
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
  doubledHands: [],
  blackjackHands: [],
};


function resolveDealerAndOutcomes(state: Draft<PlayState>) {
  // Dealer draws until at least 17
  while (state.dealerScore < 17 && state.deck.length > 0) {
    const dealerCard = dealCard(state.deck);
    state.dealerHand.push(dealerCard);
    state.dealerScore = calculateHandScore(state.dealerHand);
  }

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


    hit(state) {
      const handIndex = state.currentHandIndex;
      if (state.deck.length === 0) return;
      if (handIndex < 0 || handIndex >= state.playerHands.length) return;

      const card = dealCard(state.deck);
      state.playerHands[handIndex].push(card);

      state.playerScores[handIndex] = calculateHandScore(state.playerHands[handIndex]);

      // Check if busted
      if (state.playerScores[handIndex] > 21) {
        state.endState[handIndex] = GameResult.BUST;
        console.log(JSON.parse(JSON.stringify(state.endState)));

        // Move to next hand or dealer logic
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
        resolveDealerAndOutcomes(state);

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
      state.playerHands[handIndex].push(card);
      state.playerScores[handIndex] = calculateHandScore(state.playerHands[handIndex]);

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

        resolveDealerAndOutcomes(state);
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

      // Move to next hand if available
      if (handIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
      } else {
        resolveDealerAndOutcomes(state);
      }
    },


    setCurrentHandIndex(state, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.playerHands.length) {
        state.currentHandIndex = action.payload;
      }
    },
  },
});

export const { placeBet, startGame, hit, stand, double, split, surrender, setCurrentHandIndex } = playSlice.actions;

export default playSlice.reducer;