export interface Coordinates {
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  condition: string;
  description: string;
  icon: string;
}

export interface ForecastDay {
  id: string;
  dayLabel: string;
  condition: string;
  temp: number;
  icon: string;
}

export interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
}
