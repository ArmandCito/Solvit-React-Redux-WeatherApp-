import { MapPin } from "lucide-react";
import type { CityResultsProps } from "./CityResults.ts";
import { getWeatherIcon } from "../../services/weatherIcons";
import "./CityResults.css";

function CityResults({ weather, loading, error }: CityResultsProps) {
  if (loading && !weather) {
    return (
      <section className="city-results city-results-state">
        <p>Loading weather…</p>
      </section>
    );
  }

  if (error && !weather) {
    return (
      <section className="city-results city-results-state">
        <p className="city-results-error">{error}</p>
      </section>
    );
  }

  if (!weather) {
    return (
      <section className="city-results city-results-state">
        <p>No weather data available yet.</p>
      </section>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <section className="city-results">
      <div className="city-results-info">
        {error ? (
          <p className="city-results-location city-results-error">{error}</p>
        ) : (
          <p className="city-results-location">
            <MapPin size={16} className="city-results-location-icon" />
            {weather.city}
          </p>
        )}
        <div className="city-results-temp">
          <span className="city-results-temp-value">{weather.temp}°</span>
          <span className="city-results-temp-unit">C</span>
        </div>
        <p className="city-results-condition">
          <WeatherIcon size={22} aria-hidden="true" /> {weather.condition}
        </p>
        <div className="city-results-minmax">
          <span className="city-results-badge">H: {weather.tempMax}°</span>
          <span className="city-results-badge">L: {weather.tempMin}°</span>
        </div>
      </div>
      <div className="city-results-icon" aria-hidden="true">
        <WeatherIcon size={190} strokeWidth={1.2} />
      </div>
    </section>
  );
}

export default CityResults;