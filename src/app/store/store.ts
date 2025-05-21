import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from "@/app/store/SettingsSlice"
import playStateReducer from "@/app/store/PlayStateSlice"

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    play: playStateReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;