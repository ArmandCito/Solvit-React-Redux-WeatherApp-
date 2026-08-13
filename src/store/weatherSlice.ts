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


//createAsyncThunk nous aide a dispatcher directement les actions: pending, fulfilled, rejected, on les definit en bas dans ex-reducers
export const fetchWeatherByCity = createAsyncThunk(
  "weather/fetchByCity", // action type prefix
  async (city: string) => {
    // Un puis deux
    const current = await getCurrentWeatherByCity(city);
    const forecast = await getForecastByCity(city);
    return { current, forecast }; // devient action.payload si reussit
  }
);

//la meme chose mais ici c'est par lat et long
export const fetchWeatherByCoords = createAsyncThunk(
  "weather/fetchByCoords",
  async (coords: { lat: number; lon: number }) => {
    const current = await getCurrentWeatherByCoords(coords);
    const forecast = await getForecastByCoords(coords);
    return { current, forecast };
  }
);

//la meme chose mais ici c'est par location
export const fetchWeatherByLocation = createAsyncThunk(
  "weather/fetchByLocation",
  async (defaultCity: string, thunkAPI) => {
    try {
      const coords = await getBrowserLocation();
      // unwrap() va re throw pour que le catch intercepte si cela echoue
      return await thunkAPI.dispatch(fetchWeatherByCoords(coords)).unwrap();
    } catch {
      //si pas autorise, default city
      return await thunkAPI.dispatch(fetchWeatherByCity(defaultCity)).unwrap();
    }
  }
);

const weatherSlice = createSlice({
  name: "weather", // used as the prefix for auto-generated action types
  initialState,
  reducers: {
    clearError(state) {
      state.error = null; 
    },
  },
  //ecoute les actions initiees par createAsyncThunk.
  extraReducers: (builder) => {
    builder
      // fetchWeatherByCity
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true; 
        state.error = null; 
      })
      .addCase(
        fetchWeatherByCity.fulfilled,
        (state, action: PayloadAction<{ current: CurrentWeather; forecast: ForecastDay[] }>) => {
          state.loading = false;
          state.current = action.payload.current; 
          state.forecast = action.payload.forecast; 
        }
      )
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong."; 
      })

      // fetchWeatherByCoords
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

      // fetchWeatherByLocation
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unable to load weather data.";
      });
    
  },
});

export const { clearError } = weatherSlice.actions; 
export default weatherSlice.reducer;