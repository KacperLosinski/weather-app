"use client";

import { useState, useEffect } from "react";
import { getWeather } from "@/lib/weather";
import { motion } from "framer-motion";
import Switch from "@/components/Switch"; // Upewnij się, że ścieżka jest poprawna

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isNightMode, setIsNightMode] = useState(false); // 🌙 Przełącznik dla nocy



  // 🔥 Pobieranie pogody dla miasta
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWeather(city);
      setWeather(data);
      setWeatherCondition(data.current.condition.text.toLowerCase());
      setHistory((prev) => [...new Set([city, ...prev])].slice(0, 5)); // Ostatnie 5 wyszukiwań
    } catch (err) {
      setError("Nie znaleziono miasta.");
      setWeather(null);
    }
    setLoading(false);
  };

  // 📍 Pobieranie pogody dla aktualnej lokalizacji
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setError("");
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const data = await getWeather(`${lat},${lon}`);
            setWeather(data);
            setWeatherCondition(data.current.condition.text.toLowerCase());
          } catch (err) {
            setError("Nie udało się pobrać danych pogodowych dla Twojej lokalizacji.");
          }
        },
        () => {
          setError("Nie udało się uzyskać dostępu do lokalizacji.");
        }
      );
    } else {
      setError("Twoja przeglądarka nie obsługuje geolokalizacji.");
    }
  };

  // ⏳ Pobieranie prognozy godzinowej od aktualnej godziny do 24h w przód
  const getUpcomingHours = () => {
    if (!weather || !weather.forecast) return [];
  
    const localTime = weather.location.localtime; // Pobieramy lokalny czas miasta
    const localHour = parseInt(localTime.split(" ")[1].split(":")[0]); // Pobieramy aktualną godzinę w danym mieście
  
    // Pobieramy godziny dla wybranego dnia
    let hours = weather.forecast.forecastday[selectedDay].hour;
  
    // Jeśli wybrano dzisiejszy dzień → pokażemy godziny tylko od teraz w górę
    if (selectedDay === 0) {
      hours = hours.filter((hour: any) => parseInt(hour.time.split(" ")[1].split(":")[0]) >= localHour);
    }
  
    // Pokazujemy tylko godziny co 2 godziny
    return hours.filter((_, index) => index % 2 === 0);
  };
  
  

  const getBackgroundClass = (): string => {
    if (!weather || !weather.forecast) return "bg-gradient-to-r from-blue-500 to-indigo-600";
  
    let conditionText: string = "";
  
    if (isNightMode) {
      // Pobieranie warunków pogodowych na noc (najniższa temperatura)
      const nightHours = weather.forecast.forecastday[selectedDay].hour.filter((hour: any) => {
        const hourNumber = parseInt(hour.time.split(" ")[1].split(":")[0]);
        return hourNumber >= 18 || hourNumber <= 6;
      });
  
      const coldestHour = nightHours.reduce((min: any, curr: any) =>
        curr.temp_c < min.temp_c ? curr : min
      );
  
      conditionText = coldestHour.condition.text.toLowerCase();
    } else {
      conditionText = weather.forecast.forecastday[selectedDay].day.condition.text.toLowerCase();
    }
  
    // 🔆 **DZIENNE TŁA**
    if (!isNightMode) {
      if (conditionText.includes("słonecznie") || conditionText.includes("bezchmurnie"))
        return "bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 animate-slow-pulse";
  
      if (conditionText.includes("częściowe zachmurzenie"))
        return "bg-gradient-to-r from-gray-300 to-blue-400 animate-clouds-move";
  
      if (conditionText.includes("pochmurno") || conditionText.includes("całkowite zachmurzenie"))
        return "bg-gradient-to-b from-gray-500 to-gray-700";
  
      if (conditionText.includes("mgła") || conditionText.includes("zamglenie"))
        return "bg-gray-400 opacity-90 animate-mist-flow";
  
      if (conditionText.includes("mżawka") || conditionText.includes("deszcz") || conditionText.includes("przelotne opady"))
        return "bg-blue-700 animate-rain-light";
  
      if (conditionText.includes("burza") || conditionText.includes("ulewa") || conditionText.includes("intensywne opady"))
        return "bg-gray-900 text-white animate-thunderstorm";
  
      if (conditionText.includes("śnieg") || conditionText.includes("śnieżyca") || conditionText.includes("marznące opady"))
        return "bg-white text-black animate-snowfall";
  
      if (conditionText.includes("lodowy deszcz") || conditionText.includes("grad"))
        return "bg-blue-300 animate-hailstorm";
  
      if (conditionText.includes("wiatr") || conditionText.includes("zawieja") || conditionText.includes("wichura"))
        return "bg-gradient-to-r from-gray-700 to-blue-900 animate-windy";
  
      return "bg-indigo-600";
    }
  
    // 🌙 **NOCNE TŁA**
    if (isNightMode) {
      if (conditionText.includes("bezchmurnie") || conditionText.includes("słonecznie"))
        return "bg-gray-900 animate-stars-twinkle";
  
      if (conditionText.includes("częściowe zachmurzenie"))
        return "bg-gray-800 animate-clouds-move";
  
      if (conditionText.includes("pochmurno") || conditionText.includes("całkowite zachmurzenie"))
        return "bg-gray-700";
  
      if (conditionText.includes("mgła") || conditionText.includes("zamglenie"))
        return "bg-gray-600 opacity-90 animate-mist-flow";
  
      if (conditionText.includes("mżawka") || conditionText.includes("deszcz") || conditionText.includes("przelotne opady"))
        return "bg-blue-900 animate-rain-light";
  
      if (conditionText.includes("burza") || conditionText.includes("ulewa") || conditionText.includes("intensywne opady"))
        return "bg-black text-white animate-thunderstorm";
  
      if (conditionText.includes("śnieg") || conditionText.includes("śnieżyca") || conditionText.includes("marznące opady"))
        return "bg-gray-400 text-black animate-snowfall";
  
      if (conditionText.includes("lodowy deszcz") || conditionText.includes("grad"))
        return "bg-blue-800 animate-hailstorm";
  
      if (conditionText.includes("wiatr") || conditionText.includes("zawieja") || conditionText.includes("wichura"))
        return "bg-gradient-to-r from-gray-900 to-blue-900 animate-windy";
  
      return "bg-gray-900";
    }
  
    return "bg-indigo-600";
  };
  
  
  
  

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all ${getBackgroundClass()}`}>
      <h1 className="text-4xl font-bold mb-6">🌤 Sprawdź pogodę</h1>
      {/* 🔎 Pole wyszukiwania + przyciski */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          className="p-3 border rounded-lg shadow-md text-black w-64 text-lg"
          placeholder="Wpisz miasto"
          value={city || ""}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="bg-white text-blue-600 px-5 py-3 rounded-lg shadow-md font-semibold text-lg hover:bg-gray-200 transition" onClick={handleSearch}>
          Sprawdź
        </button>
        <button className="bg-green-500 text-white px-5 py-3 rounded-lg shadow-md font-semibold text-lg hover:bg-green-600 transition" onClick={getUserLocation}>
          📍 Użyj mojej lokalizacji
        </button>
      </div>

        {/* 🌞🌙 Przełącznik między dniem a nocą */}
        <div className="mt-4 flex items-center">
        <p className="mr-3 text-lg font-semibold">Dzień</p>
        <Switch isNightMode={isNightMode} setIsNightMode={setIsNightMode} />
        <p className="ml-3 text-lg font-semibold">Noc</p>
      </div>

      {/* ⏳ Spinner ładowania */}
      {loading && (
        <div className="mt-4 flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white mt-2">Ładowanie...</p>
        </div>
      )}

      {/* ⚠️ Obsługa błędów */}
      {error && <p className="text-red-300 mt-4 text-lg">{error}</p>}

{/* ⏳ Prognoza godzinowa (z możliwością zmiany dnia) */}
{weather && weather.forecast && (
  <motion.div className="mt-6 p-6 bg-white shadow-lg rounded-lg text-center max-w-4xl text-black">
   

      {/* 📅 Przełącznik dni */}
      {weather && weather.forecast && (
        <div className="flex justify-center mt-4 gap-2">
          {weather.forecast.forecastday.map((day: any, index: number) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-lg text-sm font-semibold shadow-sm transition ${
                selectedDay === index ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setSelectedDay(index)}
            >
              {new Date(day.date).toLocaleDateString("pl-PL", { weekday: "short", day: "numeric" })}
            </button>
          ))}
        </div>
      )}

{/* 🌡️ Pogoda na wybrany dzień i porę (dzień/noc) */}
{weather && weather.forecast && (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 max-w-sm mx-auto mb-4"
  >
    <h2 className="text-xl font-bold">
      {isNightMode ? "Pogoda nocna" : "Pogoda dzienna"} na wybrany dzień
    </h2>
    <div className="flex items-center gap-4 mt-2">
      {/* Pobieranie ikony i opisu warunków pogodowych */}
      {isNightMode ? (
        (() => {
          // Pobieranie godzin nocnych (18:00 - 06:00)
          const nightHours = weather.forecast.forecastday[selectedDay].hour.filter((hour: any) => {
            const hourNumber = parseInt(hour.time.split(" ")[1].split(":")[0]);
            return hourNumber >= 18 || hourNumber <= 6;
          });

          // Znalezienie godziny z najniższą temperaturą
          const coldestHour = nightHours.reduce((min: any, curr: any) =>
            curr.temp_c < min.temp_c ? curr : min
          );

          return (
            <>
              <img 
                src={coldestHour.condition.icon} 
                alt={coldestHour.condition.text} 
                className="w-16 h-16" 
              />
              <div>
                <p className="text-3xl font-semibold">
                  {coldestHour.temp_c}°C
                </p>
                <p className="text-gray-600 text-lg">
                  {coldestHour.condition.text}
                </p>
              </div>
            </>
          );
        })()
      ) : (
        <>
          <img 
            src={weather.forecast.forecastday[selectedDay].day.condition.icon} 
            alt={weather.forecast.forecastday[selectedDay].day.condition.text} 
            className="w-16 h-16" 
          />
          <div>
            <p className="text-3xl font-semibold">
              {weather.forecast.forecastday[selectedDay].day.maxtemp_c}°C
            </p>
            <p className="text-gray-600 text-lg">
              {weather.forecast.forecastday[selectedDay].day.condition.text}
            </p>
          </div>
        </>
      )}
    </div>
  </motion.div>
)}




{/* 🔄 Prognoza godzinowa dla wybranego dnia */}
<div className="overflow-x-auto flex gap-4 p-2 mt-4">
  {getUpcomingHours().map((hour: any, index: number) => (
    <div key={index} className="flex flex-col items-center p-2 border rounded-lg bg-gray-100 shadow-sm min-w-[80px]">
      <p className="text-sm font-semibold">{hour.time.split(" ")[1]}</p>
      <img src={hour.condition.icon} alt={hour.condition.text} className="w-10 h-10" />
      <p className="text-lg font-semibold">{hour.temp_c}°C</p>
      <p className="text-xs text-gray-600">{hour.condition.text}</p>
    </div>
  ))}
</div>

  </motion.div>
)}

    </div>
  );
}
