import type { CurrentWeather } from "../../types/weather";

export interface CityResultsProps {
  weather: CurrentWeather | null;
  loading: boolean;
  error: string | null;
}
