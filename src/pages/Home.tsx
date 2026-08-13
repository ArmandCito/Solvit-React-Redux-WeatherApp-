import { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar.tsx";
import CityResults from "../components/CityResults/CityResults.tsx";
import ForeCastSection from "../components/ForeCastSection/ForeCastSection.tsx";
import WeatherDetails from "../components/WeatherDetails/WeatherDetails.tsx";
import Footer from "../components/Footer/Footer.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks"; 
import { fetchWeatherByCity, fetchWeatherByLocation } from "../store/weatherSlice"; 
import { getWeatherTip } from "../services/weatherIcons";
import "./Home.css";

const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || "London";

function Home() {
  const dispatch = useAppDispatch();

  
  const { current, forecast, loading, error } = useAppSelector((state) => state.weather);

  function handleSearch(city: string) {
    dispatch(fetchWeatherByCity(city));
  }

  function handleLocate() {
    dispatch(fetchWeatherByLocation(DEFAULT_CITY));
  }

  useEffect(() => {
    //on first render
    dispatch(fetchWeatherByLocation(DEFAULT_CITY));
    
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
