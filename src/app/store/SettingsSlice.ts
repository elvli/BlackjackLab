import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  numDecks: number;
  numHands: number;
  bjMultiplier: number;
}

const initialState = { numDecks: 4, numHands: 1, bjMultiplier: 1.5 } satisfies SettingsState as SettingsState

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    increment(state) {
      state.numDecks++
    },
    decrement(state) {
      state.numDecks--
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.numDecks += action.payload
    },
    incrNumHands(state) {
      state.numHands++
    },
    decrNumHands(state) {
      state.numHands--
    },
    setNumHands(state, action) {
      state.numHands = action.payload;
    },

  },
})

export const { increment, decrement, incrementByAmount, incrNumHands, decrNumHands, setNumHands } = settingsSlice.actions
export default settingsSlice.reducer