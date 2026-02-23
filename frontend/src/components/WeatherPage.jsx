import { useState, useEffect } from "react";
import { speak } from "../utils/speak";
import farmBg from "../assets/crop.jpg";

export default function WeatherPage({ weather, onPredict, onBack }) {

  const [lang, setLang] = useState("te");

  if (!weather) return null;

  // =================================================
  // WEATHER DESCRIPTION TELUGU MAP
  // =================================================
  const weatherTeluguMap = {
    "clear sky": "ఆకాశం నిర్మలం",
    "few clouds": "కొన్ని మేఘాలు",
    "scattered clouds": "చిన్న మేఘాలు",
    "broken clouds": "మేఘావృతం",
    "overcast clouds": "పూర్తిగా మేఘాలు",
    "light rain": "తేలికపాటి వర్షం",
    "moderate rain": "మోస్తరు వర్షం",
    "heavy rain": "భారీ వర్షం"
  };

  const weatherTelugu =
    weatherTeluguMap[weather.description?.toLowerCase()] ||
    weather.description;

  // =================================================
  // LOCATION TELUGU PRONUNCIATION FIX
  // =================================================
  const locationTeluguMap = {
    "Bhimavaram": "భీమవరం",
    "Hyderabad": "హైదరాబాద్",
    "Vijayawada": "విజయవాడ"
  };

  const locationTelugu =
    locationTeluguMap[weather.location] || weather.location;

  // =================================================
  // SPEAK WEATHER
  // =================================================
  const speakWeather = () => {

    if (lang === "te") {

      const text = `
      రైతు గారు.
      ఈ రోజు మీ ప్రాంతం ${locationTelugu} లో వాతావరణ వివరాలు ఇలా ఉన్నాయి.

      ఉష్ణోగ్రత ${weather.temperature} డిగ్రీలు.
      అనుభూతి ఉష్ణోగ్రత ${weather.feels_like} డిగ్రీలు.
      ఆర్ద్రత ${weather.humidity} శాతం.
      గాలి వేగం ${weather.wind_speed} మీటర్లు ప్రతిసెకను.
      వాయు పీడనం ${weather.pressure} హెచ్పిఏ.
      వాతావరణ పరిస్థితి ${weatherTelugu}.
      దర్శన దూరం ${weather.visibility} మీటర్లు.

      మీ పంట ఒత్తిడి తెలుసుకోవడానికి పచ్చ రంగు బటన్‌ను నొక్కండి.
      ధన్యవాదాలు రైతు గారు.
      `;

      speak(text);

    } else {

      const text = `
      Hello farmer.
      Today's weather in ${weather.location} is as follows.

      Temperature is ${weather.temperature} degrees Celsius.
      Feels like ${weather.feels_like} degrees.
      Humidity is ${weather.humidity} percent.
      Wind speed is ${weather.wind_speed} meters per second.
      Pressure is ${weather.pressure} hectopascals.
      Weather condition is ${weather.description}.
      Visibility is ${weather.visibility} meters.

      To check crop stress please click green button.
      `;

      speak(text);
    }
  };

  // =================================================
  // AUTO SPEAK WHEN PAGE LOADS
  // =================================================
  useEffect(() => {
    setTimeout(speakWeather, 800);
  }, []);

  // =================================================
  // LABELS
  // =================================================
  const labels = {
    te: {
      title: "🌿 వాతావరణ సమాచారం",
      location: "స్థలం",
      temp: "ఉష్ణోగ్రత",
      feels: "అనుభూతి ఉష్ణోగ్రత",
      humidity: "ఆర్ద్రత",
      wind: "గాలి వేగం",
      pressure: "పీడనం",
      weather: "వాతావరణం",
      visibility: "దర్శన దూరం",
      speak: "🔊 వినండి",
      predict: "🌱 పంట ఒత్తిడి అంచనా",
      back: "వెనక్కి"
    },
    en: {
      title: "Weather Information",
      location: "Location",
      temp: "Temperature",
      feels: "Feels Like",
      humidity: "Humidity",
      wind: "Wind Speed",
      pressure: "Pressure",
      weather: "Condition",
      visibility: "Visibility",
      speak: "Speak",
      predict: "Predict Stress",
      back: "Back"
    }
  };

  const t = labels[lang];

  // =================================================
  // UI
  // =================================================
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${farmBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        {/* LANGUAGE BUTTON */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === "te" ? "en" : "te")}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {lang === "te" ? "English" : "తెలుగు"}
          </button>
        </div>

        <h2 className="text-2xl font-bold text-green-700 mb-4">
          {t.title}
        </h2>

        <div className="space-y-2 text-lg">
          <p>📍 {t.location}: {lang === "te" ? locationTelugu : weather.location}, {weather.country}</p>
          <p>🌡 {t.temp}: {weather.temperature} °C</p>
          <p>🤒 {t.feels}: {weather.feels_like} °C</p>
          <p>💧 {t.humidity}: {weather.humidity} %</p>
          <p>🌬 {t.wind}: {weather.wind_speed} m/s</p>
          <p>🌫 {t.pressure}: {weather.pressure} hPa</p>
          <p>☁ {t.weather}: {lang === "te" ? weatherTelugu : weather.description}</p>
          <p>👁 {t.visibility}: {weather.visibility} m</p>
        </div>

        <div className="flex gap-3 justify-center mt-6">

          <button onClick={speakWeather} className="bg-black text-white px-4 py-2 rounded">
            {t.speak}
          </button>

          <button onClick={onPredict} className="bg-green-600 text-white px-4 py-2 rounded">
            {t.predict}
          </button>

          <button onClick={onBack} className="bg-gray-400 text-white px-4 py-2 rounded">
            {t.back}
          </button>

        </div>

      </div>
    </div>
  );
}