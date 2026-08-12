import type { ForecastDay } from "../../types/weather";

export interface ForeCastSectionProps {
  forecast: ForecastDay[];
  tip: string | null;
  loading: boolean;
}
