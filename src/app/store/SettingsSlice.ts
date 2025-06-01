import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
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
  showHiddenCard: boolean;
  showOptimalPlay: boolean;

  // Betting settings
  startingBankroll: number;
  startingBet: number;
  bettingIncrement: number;
  autoBet: boolean;
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
  showHiddenCard: false,
  showOptimalPlay: false,

  // Betting settings
  startingBankroll: 1000,
  startingBet: 10,
  bettingIncrement: 10,
  autoBet: false,
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
    setShowHiddenCard(state, action: PayloadAction<boolean>) {
      state.showHiddenCard = action.payload;
    },
    setShowOptimalPlay(state, action: PayloadAction<boolean>) {
      state.showOptimalPlay = action.payload;
    },

    // Betting settings
    setStartingBankroll(state, action: PayloadAction<number>) {
      state.startingBankroll = action.payload;
    },
    setStartingBet(state, action: PayloadAction<number>) {
      state.startingBet = action.payload;
    },
    setBettingIncrement(state, action: PayloadAction<number>) {
      state.bettingIncrement = action.payload;
    },
    setAutoBet(state, action: PayloadAction<boolean>) {
      state.autoBet = action.payload;
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
  setShowHiddenCard,
  setShowOptimalPlay,
  setStartingBankroll,
  setStartingBet,
  setBettingIncrement,
  setAutoBet,
} = settingsSlice.actions;

export default settingsSlice.reducer;
