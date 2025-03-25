import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Sun, CloudRain, CloudSnow, Clock, MoonStar } from "lucide-react";
import im1 from "./images/image.png";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  const RealTimeClock = () => {
    const timeRef = useRef(new Date().toLocaleString());
    const [, forceUpdate] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        timeRef.current = new Date().toLocaleString();
        forceUpdate((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return <span>{timeRef.current}</span>;
  }
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11 && hour >= 1) {
      return "Good Morning!";
    } else if (hour >= 12 && hour <= 15) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };
  const fetchWeather = async () => {
    if (!city) return;
    setError(null);
    try {
      const apiKey = "7eb6d61e5646dfe27b6671032f590bf4";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
    } catch (err) {
      setError("City not found. Try again!");
      setWeather(null);
    }
  };
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;
  const greetingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    fontStyle: 'italic',
    color: "black",
    textShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
    fontFamily: 'Georgia',
    marginLeft: '40px'
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="flex justify-center items-center gap-2 text-gray-600 mt-2">
        <div id="clock">
          <img id="im1" src={im1} alt="" width={150} height={80} />

          <div id="greet"> {isDaytime ? <Sun size={80} className="text-yellow-400" /> : <MoonStar size={80} className="text-gray-200" />}<h1 style={greetingStyle}>{greeting}</h1>
          </div>
          <h3 className="text-lg font-semibold" >
            <Clock size={15} /><RealTimeClock />
          </h3>
        </div>
      </div>
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg text-black" id="main-div">
        <div id="div-2">
          <h1 className="text-2xl font-bold text-center" id="weat">Weather Forecast</h1>
        </div>
        <div id="div-3">
          <div className="flex mt-4" id="div-input-search">
            <input id="input-search"
              type="text"
              placeholder="Search City Here!!.."
              className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button id="btn-search"
              onClick={fetchWeather}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {weather && (
          <div className="mt-6 text-center" id="weather-data">
            <h2 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h2>
            <p className="text-5xl font-bold mt-2">{Math.round(weather.main.temp)}°C</p>
            <div className="flex justify-center items-center gap-3 mt-3">
              {weather.weather[0].main === "Clear" ? (
                <Sun size={50} className="text-yellow-500" />
              ) : weather.weather[0].main === "Rain" ? (
                <CloudRain size={50} className="text-blue-400" />
              ) : (
                <CloudSnow size={50} className="text-gray-500" />
              )}
              <p className="text-lg">{weather.weather[0].description}</p>
            </div>
            <p className="mt-2">Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
