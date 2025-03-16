"use client";

import { useState, useEffect } from "react";
import { getWeather } from "@/lib/weather";
import { motion } from "framer-motion";
import Switch from "@/components/Switch"; // Upewnij się, że ścieżka jest poprawna
import Layout from "@/app/layout";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isNightMode, setIsNightMode] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const data = await getWeather(city);
      setWeather(data);
      setLocationName(data.location.name);
      setCountry(data.location.country);
    } catch (err) {
      setError("Nie znaleziono miasta.");
      setWeather(null);
    }
    setLoading(false);
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setError("");
          setLoading(true);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const data = await getWeather(`${lat},${lon}`);
            setWeather(data);
            setLocationName(data.location.name);
            setCountry(data.location.country);
            setCity(data.location.name);
          } catch (err) {
            setError("Nie udało się pobrać danych pogodowych.");
          }
          setLoading(false);
        },
        () => {
          setError("Nie udało się uzyskać dostępu do lokalizacji.");
        }
      );
    } else {
      setError("Twoja przeglądarka nie obsługuje geolokalizacji.");
    }
  };

  // ⏳ Pobieranie prognozy godzinowej dla wybranego dnia
  const getUpcomingHours = () => {
    if (!weather || !weather.forecast) return [];

    const localTime = weather.location.localtime;
    const localHour = parseInt(localTime.split(" ")[1].split(":")[0]);

    let hours = weather.forecast.forecastday[selectedDay].hour;

    if (selectedDay === 0) {
      hours = hours.filter((hour: any) => parseInt(hour.time.split(" ")[1].split(":")[0]) >= localHour);
    }

    return hours.filter((_, index) => index % 2 === 0);
  };
  

  const getBackgroundClass = (weather: any, isNight: boolean, selectedDay: number): string => {
    if (!weather || !weather.forecast || !weather.forecast.forecastday[selectedDay]) return "dsunny";
  
    let conditionText = "";
    
    if (isNight) {
      // Pobieranie godzin nocnych (18:00 - 06:00)
      const nightHours = weather.forecast.forecastday[selectedDay].hour.filter((hour: any) => {
        const hourNumber = parseInt(hour.time.split(" ")[1].split(":")[0]);
        return hourNumber >= 18 || hourNumber <= 6;
      });
  
      if (nightHours.length === 0) return "nclear";
  
      // Pobieramy najbliższą godzinę w przyszłości lub najzimniejszą nocną
      const now = new Date();
      const closestHour = nightHours.reduce((prev: any, curr: any) => 
        Math.abs(new Date(curr.time).getHours() - now.getHours()) < 
        Math.abs(new Date(prev.time).getHours() - now.getHours()) 
          ? curr 
          : prev
      );
  
      conditionText = closestHour.condition.text.toLowerCase();
    } else {
      // Pobieramy warunki dzienne
      conditionText = weather.forecast.forecastday[selectedDay].day.condition.text.toLowerCase();
    }
  
    console.log(`Aktualna pogoda dla ${selectedDay} dnia, tryb nocny: ${isNight}, warunki: ${conditionText}`);
  
    if (conditionText.includes("bezchmurnie") || conditionText.includes("słonecznie")) return isNight ? "nclear moon stars" : "dsunny sun sun-rays";
    if (conditionText.includes("częściowe zachmurzenie")) return isNight ? "ncloudy" : "dcloudy";
    if (conditionText.includes("pochmurno") || conditionText.includes("całkowite zachmurzenie")) return isNight ? "nverycloudy" : "dverycloudy";
    if (conditionText.includes("mgła") || conditionText.includes("zamglenie")) return isNight ? "nfog" : "dfog";
    if (conditionText.includes("deszcz") || conditionText.includes("mżawka")) return isNight ? "nrainy" : "drainy";
    if (conditionText.includes("burza") || conditionText.includes("ulewa")) return isNight ? "nstorm" : "dstorm";
    if (conditionText.includes("śnieg")) return isNight ? "nsnowfall" : "dsnowfall";
    if (conditionText.includes("grad")) return isNight ? "nhailstorm" : "dhailstorm";
    if (conditionText.includes("wiatr") || conditionText.includes("wichura")) return isNight ? "nwindy" : "dwindy";
  
    return isNight ? "nclear" : "dsunny";
  };
  
  
  
  useEffect(() => {
    if (weather) {
      console.log("Aktualizacja pogody:", weather.forecast.forecastday[selectedDay]);
      console.log("Wybrany dzień:", selectedDay);
      console.log("Tryb nocny:", isNightMode);
  
      setWeatherCondition(getBackgroundClass(weather, isNightMode, selectedDay));
    }
  }, [weather, isNightMode, selectedDay]);
  
  

  
  

  return (
    
    <Layout>

<div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all ${weatherCondition}`}>
{weatherCondition && weatherCondition.includes("dsunny") && <div className="sun"></div>}

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
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center">
            <p className="mr-3 text-lg font-semibold">Dzień</p>
            <Switch isNightMode={isNightMode} setIsNightMode={setIsNightMode} />
            <p className="ml-3 text-lg font-semibold">Noc</p>
          </div>

                    {/* 📍 Wyświetlanie miasta i kraju */}
                    {locationName && country && (
            <p className="text-lg font-semibold mt-2">
              📍 {locationName}, {country}
            </p>
          )}
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
    {isNightMode ? (() => {
    // Pobieramy godziny nocne (18:00 - 06:00)
    const nightHours = weather.forecast.forecastday[selectedDay].hour.filter((hour: any) => {
        const hourNumber = parseInt(hour.time.split(" ")[1].split(":")[0]);
        return hourNumber >= 18 || hourNumber <= 6;
    });

    if (nightHours.length === 0) {
        console.warn("Brak danych o godzinach nocnych");
        return null; // Jeśli nie ma danych nocnych, nie renderujemy niczego
    }

    // Pobieramy aktualną godzinę
    const now = new Date();
    const currentHour = now.getHours();

    // Znajdujemy godzinę najbliższą obecnej
    const closestHour = nightHours.reduce((prev: any, curr: any) =>
        Math.abs(parseInt(curr.time.split(" ")[1].split(":")[0]) - currentHour) <
        Math.abs(parseInt(prev.time.split(" ")[1].split(":")[0]) - currentHour)
            ? curr
            : prev
    );

    console.log("Wybrana godzina nocna:", closestHour);

    return (
        <>
            <img
                src={closestHour.condition.icon}
                alt={closestHour.condition.text}
                className="w-16 h-16"
            />
            <div>
                <p className="text-3xl font-semibold">{closestHour.temp_c}°C</p>
                <p className="text-gray-600 text-lg">{closestHour.condition.text}</p>
            </div>
        </>
    );
})() : (
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
    </Layout>

  );
}
