import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Thermometer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";


export function getWeatherIcon(condition: string): LucideIcon {
  const normalized = condition.toLowerCase();

  if (normalized.includes("thunder")) return CloudLightning;
  if (normalized.includes("drizzle")) return CloudDrizzle;
  if (normalized.includes("rain")) return CloudRain;
  if (normalized.includes("snow")) return CloudSnow;
  if (normalized.includes("clear")) return Sun;
  if (normalized.includes("cloud")) return Cloud;
  if (
    normalized.includes("mist") ||
    normalized.includes("fog") ||
    normalized.includes("haze")
  )
    return CloudFog;

  return Thermometer;
}

export function getWeatherTip(condition: string, temp: number): string {
  const normalized = condition.toLowerCase();

  if (normalized.includes("rain") || normalized.includes("drizzle")) {
    return "Don't forget your umbrella today, rain is expected throughout the day.";
  }
  if (normalized.includes("thunder")) {
    return "Thunderstorms are expected. Stay indoors and avoid open areas if possible.";
  }
  if (normalized.includes("snow")) {
    return "Snow is on the way. Bundle up and watch out for slippery roads.";
  }
  if (temp <= 5) {
    return "It's quite cold outside. A heavy jacket is recommended.";
  }
  if (temp <= 15) {
    return "The current temperature is perfect for a light jacket.";
  }
  if (temp <= 25) {
    return "Mild and pleasant weather. Great day to be outdoors.";
  }
  return "It's warm out there. Stay hydrated and use sun protection.";
}