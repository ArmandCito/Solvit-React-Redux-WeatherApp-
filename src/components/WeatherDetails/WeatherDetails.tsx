import { Droplets, Sunrise, Sunset, Wind } from "lucide-react";
import type { WeatherDetailItem, WeatherDetailsProps } from "./WeatherDetails.ts";
import "./WeatherDetails.css";

function WeatherDetails({ humidity, windSpeed, sunrise, sunset }: WeatherDetailsProps) {
  const items: WeatherDetailItem[] = [
    {
      id: "humidity",
      label: "Humidity",
      value: humidity !== null ? `${humidity}%` : "—",
      icon: Droplets,
    },
    {
      id: "wind",
      label: "Wind Speed",
      value: windSpeed !== null ? `${windSpeed} km/h` : "—",
      icon: Wind,
    },
    {
      id: "sunrise",
      label: "Sunrise",
      value: sunrise ?? "—",
      icon: Sunrise,
    },
    {
      id: "sunset",
      label: "Sunset",
      value: sunset ?? "—",
      icon: Sunset,
    },
  ];

  return (
    <section className="weather-details">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div className="weather-details-card" key={item.id}>
            <span className="weather-details-icon">
              <Icon size={20} />
            </span>
            <p className="weather-details-label">{item.label}</p>
            <p className="weather-details-value">{item.value}</p>
          </div>
        );
      })}
    </section>
  );
}

export default WeatherDetails;