import type { Coordinates, CurrentWeather, ForecastDay } from "../types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL =
  import.meta.env.VITE_OPENWEATHER_BASE_URL ||
  "https://api.openweathermap.org/data/2.5";

/**
 * Raw shapes returned by OpenWeatherMap. Only the fields we actually
 * use are typed here, kept intentionally small and simple.
 */
interface RawWeatherResponse {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  wind: { speed: number };
  weather: { main: string; description: string; icon: string }[];
}

interface RawForecastItem {
  dt: number;
  dt_txt: string;
  main: { temp: number };
  weather: { main: string; icon: string }[];
}

interface RawForecastResponse {
  list: RawForecastItem[];
}

function formatTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapCurrentWeather(raw: RawWeatherResponse): CurrentWeather {
  const weather = raw.weather[0];
  return {
    city: raw.name,
    country: raw.sys.country,
    temp: Math.round(raw.main.temp),
    tempMin: Math.round(raw.main.temp_min),
    tempMax: Math.round(raw.main.temp_max),
    humidity: raw.main.humidity,
    windSpeed: Math.round(raw.wind.speed * 3.6), // m/s -> km/h
    sunrise: formatTime(raw.sys.sunrise),
    sunset: formatTime(raw.sys.sunset),
    condition: weather.main,
    description: weather.description,
    icon: weather.icon,
  };
}

function mapForecast(raw: RawForecastResponse): ForecastDay[] {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const byDate = new Map<string, RawForecastItem[]>();

  raw.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const bucket = byDate.get(date) ?? [];
    bucket.push(item);
    byDate.set(date, bucket);
  });

  const days = Array.from(byDate.entries()).slice(0, 5);

  return days.map(([date, items], index) => {
    // Prefer the entry closest to midday for a representative condition/temp
    const midday =
      items.find((item) => item.dt_txt.includes("12:00:00")) ?? items[0];

    return {
      id: date,
      dayLabel: index === 0 ? "Today" : dayNames[new Date(date).getUTCDay()],
      condition: midday.weather[0].main,
      temp: Math.round(midday.main.temp),
      icon: midday.weather[0].icon,
    };
  });
}

async function fetchJson<T>(url: string): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      "Missing OpenWeatherMap API key. Add VITE_OPENWEATHER_API_KEY to your .env file."
    );
  }

  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("City not found. Please check the spelling and try again.");
    }
    if (res.status === 401) {
      throw new Error("Invalid API key. Please check your .env configuration.");
    }
    throw new Error("Unable to fetch weather data right now.");
  }

  return (await res.json()) as T;
}

export async function getCurrentWeatherByCity(city: string) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${API_KEY}`;
  const raw = await fetchJson<RawWeatherResponse>(url);
  return mapCurrentWeather(raw);
}

export async function getCurrentWeatherByCoords(coords: Coordinates) {
  const url = `${BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;
  const raw = await fetchJson<RawWeatherResponse>(url);
  return mapCurrentWeather(raw);
}

export async function getForecastByCity(city: string) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${API_KEY}`;
  const raw = await fetchJson<RawForecastResponse>(url);
  return mapForecast(raw);
}

export async function getForecastByCoords(coords: Coordinates) {
  const url = `${BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;
  const raw = await fetchJson<RawForecastResponse>(url);
  return mapForecast(raw);
}

/**
 * Uses a fetch-based IP geolocation service to determine the user's
 * approximate coordinates, avoiding the callback-based browser API.
 */
export async function getBrowserLocation() {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) {
    throw new Error("Unable to determine your location.");
  }
  const data = await res.json();
  return { lat: data.latitude, lon: data.longitude };
}