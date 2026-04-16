import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEALER_SPEED_DEFAULT } from "@/lib/dealer-speed";
import {
  sanitizeBettingIncrement,
  sanitizeStartingBankroll,
  sanitizeStartingBet,
} from "@/lib/betting-settings";

export interface SettingsState {
  // Game settings
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

  // Training settings
  showCount: boolean;
  showDealerScore: boolean;
  showOwnScore: boolean;
  showHiddenCard: boolean;
  showOptimalPlay: boolean;
  dealerSpeed: number;

  // Betting settings
  startingBankroll: number;
  startingBet: number;
  bettingIncrement: number;
}

const initialState: SettingsState = {
  // Game settings
  numDecks: 6,
  numHands: 1,
  soft17: 'hits',
  reshuffle: 'auto',
  allowSurrender: true,
  allowLateSurrender: true,
  allowDoubleSplit: true,
  allowResplitAces: false,
  allowInsurance: false,
  bjPayout: '3:2',
  shoePenetration: 0.75,

  // Training settings
  showCount: false,
  showDealerScore: true,
  showOwnScore: true,
  showHiddenCard: false,
  showOptimalPlay: false,
  dealerSpeed: DEALER_SPEED_DEFAULT,

  // Betting settings
  startingBankroll: 1000,
  startingBet: 10,
  bettingIncrement: 10,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Gameplay settings
    setNumDecks(state, action: PayloadAction<number>) {
      state.numDecks = action.payload;
    },
    incrNumHands(state) {
      state.numHands++;
    },
    decrNumHands(state) {
      state.numHands--;
    },
    setNumHands(state, action: PayloadAction<number>) {
      state.numHands = action.payload;
    },
    setSoft17(state, action: PayloadAction<string>) {
      state.soft17 = action.payload;
    },
    setReshuffle(state, action: PayloadAction<string>) {
      state.reshuffle = action.payload;
    },
    setAllowSurrender(state, action: PayloadAction<boolean>) {
      state.allowSurrender = action.payload;
    },
    setAllowLateSurrender(state, action: PayloadAction<boolean>) {
      state.allowLateSurrender = action.payload;
    },
    setAllowDoubleSplit(state, action: PayloadAction<boolean>) {
      state.allowDoubleSplit = action.payload;
    },
    setAllowResplitAces(state, action: PayloadAction<boolean>) {
      state.allowResplitAces = action.payload;
    },
    setAllowInsurance(state, action: PayloadAction<boolean>) {
      state.allowInsurance = action.payload;
    },
    setBjPayout(state, action: PayloadAction<string>) {
      state.bjPayout = action.payload;
    },
    setShoePenetration(state, action: PayloadAction<number>) {
      state.shoePenetration = action.payload;
    },

    // Training settings
    setShowCount(state, action: PayloadAction<boolean>) {
      state.showCount = action.payload;
    },
    setShowDealerScore(state, action: PayloadAction<boolean>) {
      state.showDealerScore = action.payload;
    },
    setShowOwnScore(state, action: PayloadAction<boolean>) {
      state.showOwnScore = action.payload;
    },
    setShowHiddenCard(state, action: PayloadAction<boolean>) {
      state.showHiddenCard = action.payload;
    },
    setShowOptimalPlay(state, action: PayloadAction<boolean>) {
      state.showOptimalPlay = action.payload;
    },
    setDealerSpeed(state, action: PayloadAction<number>) {
      state.dealerSpeed = action.payload;
    },

    // Betting settings
    setStartingBankroll(state, action: PayloadAction<number>) {
      state.startingBankroll = sanitizeStartingBankroll(action.payload);
      state.startingBet = sanitizeStartingBet(state.startingBet, state.startingBankroll);
      state.bettingIncrement = sanitizeBettingIncrement(
        state.bettingIncrement,
        state.startingBankroll
      );
    },
    setStartingBet(state, action: PayloadAction<number>) {
      state.startingBet = sanitizeStartingBet(action.payload, state.startingBankroll);
    },
    setBettingIncrement(state, action: PayloadAction<number>) {
      state.bettingIncrement = sanitizeBettingIncrement(
        action.payload,
        state.startingBankroll
      );
    },
    hydrateSettingsState(_state, action: PayloadAction<SettingsState>) {
      return action.payload;
    },
  },
});

export const {
  setNumDecks,
  incrNumHands,
  decrNumHands,
  setNumHands,
  setSoft17,
  setReshuffle,
  setAllowSurrender,
  setAllowLateSurrender,
  setAllowDoubleSplit,
  setAllowResplitAces,
  setAllowInsurance,
  setBjPayout,
  setShoePenetration,
  setShowCount,
  setShowDealerScore,
  setShowOwnScore,
  setShowHiddenCard,
  setShowOptimalPlay,
  setDealerSpeed,
  setStartingBankroll,
  setStartingBet,
  setBettingIncrement,
  hydrateSettingsState,
} = settingsSlice.actions;

export default settingsSlice.reducer;
