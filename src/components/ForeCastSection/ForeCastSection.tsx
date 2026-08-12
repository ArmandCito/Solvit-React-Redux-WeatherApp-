import { Cloud, Lightbulb } from "lucide-react";
import type { ForeCastSectionProps } from "./ForeCastSection.ts";
import { getWeatherIcon } from "../../services/weatherIcons";
import "./ForeCastSection.css";

function ForeCastSection({ forecast, tip, loading }: ForeCastSectionProps) {
  return (
    <aside className="forecast-section">
      <h2 className="forecast-title">
        <Cloud size={20} aria-hidden="true" /> 5-Day Forecast
      </h2>

      <ul className="forecast-list">
        {loading && forecast.length === 0 && (
          <li className="forecast-empty">Loading forecast…</li>
        )}

        {!loading && forecast.length === 0 && (
          <li className="forecast-empty">No forecast data available.</li>
        )}

        {forecast.map((day) => {
          const DayIcon = getWeatherIcon(day.condition);
          return (
            <li className="forecast-item" key={day.id}>
              <span className="forecast-day">{day.dayLabel}</span>
              <span className="forecast-condition">
                <DayIcon size={18} aria-hidden="true" />
                {day.condition}
              </span>
              <span className="forecast-temp">{day.temp}°</span>
            </li>
          );
        })}
      </ul>

      {tip && (
        <div className="forecast-tip">
          <p className="forecast-tip-title">
            <Lightbulb size={16} aria-hidden="true" /> Weather Tip
          </p>
          <p className="forecast-tip-text">{tip}</p>
        </div>
      )}
    </aside>
  );
}

export default ForeCastSection;