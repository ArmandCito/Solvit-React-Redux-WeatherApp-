import { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar.tsx";
import CityResults from "../components/CityResults/CityResults.tsx";
import ForeCastSection from "../components/ForeCastSection/ForeCastSection.tsx";
import WeatherDetails from "../components/WeatherDetails/WeatherDetails.tsx";
import Footer from "../components/Footer/Footer.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks"; // typed Redux hooks
import { fetchWeatherByCity, fetchWeatherByLocation } from "../store/weatherSlice"; // async thunks
import { getWeatherTip } from "../services/weatherIcons";
import "./Home.css";

const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || "London";

function Home() {
  // useAppDispatch gives us a dispatch function that knows how to
  // handle thunks (async actions), not just plain action objects.
  const dispatch = useAppDispatch();

  // useAppSelector reads the "weather" slice from the Redux store.
  // Any component anywhere in the tree could read this same state
  // without props being passed down manually.
  const { current, forecast, loading, error } = useAppSelector((state) => state.weather);

  function handleSearch(city: string) {
    // Dispatching a thunk triggers pending -> fulfilled/rejected
    // actions automatically; the slice's extraReducers update the store.
    dispatch(fetchWeatherByCity(city));
  }

  function handleLocate() {
    dispatch(fetchWeatherByLocation(DEFAULT_CITY));
  }

  useEffect(() => {
    // On first render, try geolocation; the thunk itself falls back
    // to DEFAULT_CITY internally if permission is denied or unavailable.
    dispatch(fetchWeatherByLocation(DEFAULT_CITY));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tip = current ? getWeatherTip(current.condition, current.temp) : null;

  return (
    <div className="home">
      <Navbar onSearch={handleSearch} onLocate={handleLocate} loading={loading} />

      <main className="home-main">
        <div className="home-top-row">
          <div className="home-left-column">
            <CityResults weather={current} loading={loading} error={error} />
            <WeatherDetails
              humidity={current?.humidity ?? null}
              windSpeed={current?.windSpeed ?? null}
              sunrise={current?.sunrise ?? null}
              sunset={current?.sunset ?? null}
            />
          </div>

          <ForeCastSection forecast={forecast} tip={tip} loading={loading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
