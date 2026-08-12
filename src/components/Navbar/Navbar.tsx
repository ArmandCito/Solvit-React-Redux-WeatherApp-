import { useState } from "react";
import type { FormEvent } from "react";
import { MapPin, Sun } from "lucide-react";
import type { NavbarProps } from "./Navbar.ts";
import "./Navbar.css";

function Navbar({ onSearch, onLocate, loading }: NavbarProps) {
  const [city, setCity] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = city.trim();
    if (trimmed.length > 0) {
      onSearch(trimmed);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">
          <Sun size={24} />
        </span>
        <div className="navbar-title">
          <h1>SolvitCast</h1>
          <p>Real-Time Weather</p>
        </div>
      </div>

      <form className="navbar-search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Search city"
          aria-label="Search city"
        />
        <button type="submit" className="navbar-search-button" disabled={loading}>
          Search
        </button>
        <button
          type="button"
          className="navbar-locate-button"
          onClick={onLocate}
          disabled={loading}
          title="Use my location"
          aria-label="Use my location"
        >
          <MapPin size={18} />
        </button>
      </form>
    </header>
  );
}

export default Navbar;