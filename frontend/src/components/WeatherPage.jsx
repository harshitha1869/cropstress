import { useState, useEffect } from "react";
import { speak, toTeluguDigits } from "../utils/speak";
import farmBg from "../assets/crop.jpg";

export default function WeatherPage({ weather, onPredict, onBack }) {
  const [lang, setLang] = useState("te");

  if (!weather) return null;

  const normalizeString = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const normalizedLocation = normalizeString(weather.location);

  const locationTeluguMap = {
    Bhimavaram: "భీమవరం",
    Hyderabad: "హైదరాబాద్",
    Vijayawada: "విజయవాడ",
  };

  const locationTelugu =
    locationTeluguMap[normalizedLocation] || normalizedLocation;

  const countryTeluguMap = {
    IN: "ఇండియా",
    US: "అమెరికా",
    UK: "యునైటెడ్ కింగ్డమ్",
  };

  const countryTelugu =
    countryTeluguMap[weather.country] || weather.country;

  const weatherTeluguMap = {
    "clear sky": "ఆకాశం నిర్మలం",
    "few clouds": "కొన్ని మేఘాలు",
    "scattered clouds": "చిన్న మేఘాలు",
    "broken clouds": "మేఘావృతం",
    "overcast clouds": "పూర్తిగా మేఘాలు",
    "light rain": "తేలికపాటి వర్షం",
    "moderate rain": "మోస్తరు వర్షం",
    "heavy rain": "భారీ వర్షం",
  };

  const weatherTelugu =
    weatherTeluguMap[weather.description?.toLowerCase()] ||
    weather.description;

  // Telugu-friendly numbers
  const tempTelugu = toTeluguDigits(
    Math.round(weather.temperature)
  );

  const feelsTelugu = toTeluguDigits(
    Math.round(weather.feels_like)
  );

  const humidityTelugu = toTeluguDigits(
    Math.round(weather.humidity)
  );

  const windTelugu = toTeluguDigits(
    Math.round(weather.wind_speed)
  );

  const pressureTelugu = toTeluguDigits(
    Math.round(weather.pressure)
  );

  const visibilityTelugu = toTeluguDigits(
    Math.round(weather.visibility)
  );

  // =============================================
  // SPEAK WEATHER
  // =============================================
  const speakWeather = () => {
    if (lang === "te") {
      const text = `
      రైతు గారు.

      ఈ రోజు మీ ప్రాంతం ${locationTelugu},
      ${countryTelugu} లో వాతావరణ వివరాలు ఇలా ఉన్నాయి.

      ఉష్ణోగ్రత ${tempTelugu} డిగ్రీలు.

      అనుభూతి ఉష్ణోగ్రత ${feelsTelugu} డిగ్రీలు.

      ఆర్ద్రత ${humidityTelugu} శాతం.

      గాలి వేగం ${windTelugu} మీటర్లు ప్రతిసెకను.

      వాయు పీడనం ${pressureTelugu} హెచ్ పి ఏ.

      వాతావరణ పరిస్థితి ${weatherTelugu}.

      దర్శన దూరం ${visibilityTelugu} మీటర్లు.

      మీ పంట ఒత్తిడి తెలుసుకోవడానికి
      పచ్చ రంగు బటన్‌ను నొక్కండి.

      ధన్యవాదాలు రైతు గారు.
      `;

      speak(text);
    } else {
      const text = `
      Hello farmer.

      Today's weather in
      ${weather.location},
      ${weather.country}
      is as follows.

      Temperature is
      ${Math.round(weather.temperature)}
      degrees Celsius.

      Feels like
      ${Math.round(weather.feels_like)}
      degrees.

      Humidity is
      ${Math.round(weather.humidity)}
      percent.

      Wind speed is
      ${Math.round(weather.wind_speed)}
      meters per second.

      Pressure is
      ${Math.round(weather.pressure)}
      hectopascals.

      Weather condition is
      ${weather.description}.

      Visibility is
      ${Math.round(weather.visibility)}
      meters.

      To check crop stress,
      please click the green button.
      `;

      speak(text);
    }
  };

  // =============================================
  // AUTO SPEAK
  // =============================================
 // useEffect(() => {
    /*const timer = setTimeout(() => {
      speakWeather();
    }, 800);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [lang]);*/

  // =============================================
  // LABELS
  // =============================================
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
      back: "వెనక్కి",
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
      back: "Back",
    },
  };

  const t = labels[lang];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${farmBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-end mb-4">
          <button
            onClick={() =>
              setLang(lang === "te" ? "en" : "te")
            }
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {lang === "te" ? "English" : "తెలుగు"}
          </button>
        </div>

        <h2 className="text-2xl font-bold text-green-700 mb-4">
          {t.title}
        </h2>

        <div className="space-y-2 text-lg">
          <p>
            📍 {t.location}:{" "}
            {lang === "te"
              ? locationTelugu
              : weather.location}
            ,{" "}
            {lang === "te"
              ? countryTelugu
              : weather.country}
          </p>

          <p>
            🌡 {t.temp}:{" "}
            {Math.round(weather.temperature)} °C
          </p>

          <p>
            🤒 {t.feels}:{" "}
            {Math.round(weather.feels_like)} °C
          </p>

          <p>
            💧 {t.humidity}:{" "}
            {Math.round(weather.humidity)} %
          </p>

          <p>
            🌬 {t.wind}:{" "}
            {Math.round(weather.wind_speed)} m/s
          </p>

          <p>
            🌫 {t.pressure}:{" "}
            {Math.round(weather.pressure)} hPa
          </p>

          <p>
            ☁ {t.weather}:{" "}
            {lang === "te"
              ? weatherTelugu
              : weather.description}
          </p>

          <p>
            👁 {t.visibility}:{" "}
            {Math.round(weather.visibility)} m
          </p>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={speakWeather}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {t.speak}
          </button>

          <button
            onClick={onPredict}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {t.predict}
          </button>

          <button
            onClick={onBack}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
}