import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // createSlice generates reducers+actions, createAsyncThunk handles async API calls
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getBrowserLocation,
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
} from "../services/weatherApi";
import type { CurrentWeather, ForecastDay } from "../types/weather";

// Shape of the "weather" slice of the Redux store.
// This replaces the local useState<WeatherState> that used to live in Home.tsx.
export interface WeatherSliceState {
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherSliceState = {
  current: null,
  forecast: [],
  loading: false,
  error: null,
};

/**
 * Thunk: fetch current weather + forecast for a given city name.
 * createAsyncThunk automatically dispatches pending/fulfilled/rejected
 * actions for us, which we handle below in extraReducers.
 */
export const fetchWeatherByCity = createAsyncThunk(
  "weather/fetchByCity", // action type prefix, shown in Redux DevTools
  async (city: string) => {
    // Fetch current weather first, then forecast sequentially.
    const current = await getCurrentWeatherByCity(city);
    const forecast = await getForecastByCity(city);
    return { current, forecast }; // becomes action.payload on success
  }
);

/**
 * Thunk: fetch current weather + forecast for given coordinates
 * (used after successful geolocation).
 */
export const fetchWeatherByCoords = createAsyncThunk(
  "weather/fetchByCoords",
  async (coords: { lat: number; lon: number }) => {
    const current = await getCurrentWeatherByCoords(coords);
    const forecast = await getForecastByCoords(coords);
    return { current, forecast };
  }
);

/**
 * Thunk: try to use the browser's geolocation first; if it's denied,
 * unsupported, or fails, fall back to a default city instead.
 * `thunkAPI.dispatch` lets one thunk dispatch another thunk internally.
 */
export const fetchWeatherByLocation = createAsyncThunk(
  "weather/fetchByLocation",
  async (defaultCity: string, thunkAPI) => {
    try {
      const coords = await getBrowserLocation();
      // unwrap() re-throws so our catch block below can react to a failure
      return await thunkAPI.dispatch(fetchWeatherByCoords(coords)).unwrap();
    } catch {
      // Geolocation denied/unsupported/failed -> fall back to default city
      return await thunkAPI.dispatch(fetchWeatherByCity(defaultCity)).unwrap();
    }
  }
);

const weatherSlice = createSlice({
  name: "weather", // used as the prefix for auto-generated action types
  initialState,
  reducers: {
    // Simple synchronous reducer: lets the UI dismiss/clear an error banner.
    clearError(state) {
      state.error = null; // Redux Toolkit uses Immer, so "mutating" state here is safe
    },
  },
  // extraReducers listen for actions created OUTSIDE this slice —
  // in our case, the pending/fulfilled/rejected actions from the thunks above.
  extraReducers: (builder) => {
    builder
      // --- fetchWeatherByCity ---
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true; // show loading UI
        state.error = null; // clear any previous error while retrying
      })
      .addCase(
        fetchWeatherByCity.fulfilled,
        (state, action: PayloadAction<{ current: CurrentWeather; forecast: ForecastDay[] }>) => {
          state.loading = false;
          state.current = action.payload.current; // store fetched current weather
          state.forecast = action.payload.forecast; // store fetched 5-day forecast
        }
      )
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong."; // surface the error message to the UI
      })

      // --- fetchWeatherByCoords ---
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWeatherByCoords.fulfilled,
        (state, action: PayloadAction<{ current: CurrentWeather; forecast: ForecastDay[] }>) => {
          state.loading = false;
          state.current = action.payload.current;
          state.forecast = action.payload.forecast;
        }
      )
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong.";
      })

      // --- fetchWeatherByLocation (wraps the two thunks above) ---
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        // Only reached if BOTH geolocation and the default-city fallback fail
        state.loading = false;
        state.error = action.error.message ?? "Unable to load weather data.";
      });
    // Note: fetchWeatherByLocation.fulfilled isn't handled here because it
    // internally dispatches fetchWeatherByCity/fetchWeatherByCoords, whose
    // own .fulfilled cases already update state.current and state.forecast.
  },
});

export const { clearError } = weatherSlice.actions; // export the plain action creator for components to use
export default weatherSlice.reducer; // exported as the default and registered in store.ts