import type { LucideIcon } from "lucide-react";

export interface WeatherDetailItem {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface WeatherDetailsProps {
  humidity: number | null;
  windSpeed: number | null;
  sunrise: string | null;
  sunset: string | null;
}