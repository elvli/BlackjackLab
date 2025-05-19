import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from "./SettingsSlice"

export const store = configureStore({
  reducer: { settings: settingsReducer }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;