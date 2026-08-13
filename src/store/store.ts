import { configureStore } from "@reduxjs/toolkit"; 
import weatherReducer from "./weatherSlice"; 


export const store = configureStore({
  reducer: {
    weather: weatherReducer, // state.weather will have { current, forecast, loading, error } at once
  },
});


export type RootState = ReturnType<typeof store.getState>;

// includes thunk typing
export type AppDispatch = typeof store.dispatch;
