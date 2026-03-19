import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Screen1Assistant from "./components/Screen1Assistant";
import LoadingScreen from "./components/LoadingScreen";
import ResultScreen from "./components/ResultScreen";
import WeatherPage from "./components/WeatherPage";
import FarmingTips from "./components/FarmingTips";
import HelpPage from "./components/HelpPage";
import { speak } from "./utils/speak";

// ✅ ADD THIS LINE
const BASE_URL = process.env.REACT_APP_API_URL || "";

function App() {

  const [screen, setScreen] = useState("welcome");
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // =============================================
  // 🔊 GREETING
  // =============================================
  useEffect(() => {

    const welcomeText =
      "నమస్కారం రైతు గారు. మీ పంట ఆరోగ్యాన్ని తెలుసుకోవడానికి నేను మీకు సహాయం చేస్తాను.దయచేసి కింద ఉన్న బటన్ నొక్కండి.";

    const voiceUnlocked = localStorage.getItem("voiceUnlocked");

    if (voiceUnlocked === "true") {
      setTimeout(() => speak(welcomeText), 600);
      return;
    }

    const unlockVoice = () => {
      localStorage.setItem("voiceUnlocked", "true");
      speak(welcomeText);
      window.removeEventListener("click", unlockVoice);
    };

    window.addEventListener("click", unlockVoice);
    return () => window.removeEventListener("click", unlockVoice);

  }, []);

  // =============================================
  // 📍 GET LOCATION + WEATHER
  // =============================================
  const getLocation = () => {

    speak("మీ ప్రాంతాన్ని గుర్తిస్తున్నాం");

    if (!navigator.geolocation) {
      speak("మీ బ్రౌజర్ లొకేషన్ సపోర్ట్ చేయదు");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        setScreen("loading");

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // ✅ FIXED HERE
        fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            setWeatherData(data);
            setScreen("weather");
            speak("మీ ప్రాంతం వాతావరణ సమాచారం సిద్ధంగా ఉంది");
          })
          .catch(() => {
            speak("సమాచారం పొందలేకపోయాం");
            setScreen("welcome");
          });

      },

      () => speak("లొకేషన్ అనుమతి అవసరం")
    );
  };

  // =============================================
  // 🌱 PREDICT CROP STRESS
  // =============================================
  const predictStress = () => {

    if (!weatherData) {
      speak("ముందు వాతావరణ సమాచారం తీసుకోండి");
      return;
    }

    speak("మీ పంట ఒత్తిడి స్థాయిని విశ్లేషిస్తున్నాం");
    setScreen("loading");

    // ✅ FIXED HERE
    fetch(`${BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(weatherData)
    })
      .then(res => res.json())
      .then(data => {
        setPrediction(data.stressLevel);
        setScreen("result");
        speak("విశ్లేషణ పూర్తైంది");
      })
      .catch(() => {
        speak("పంట విశ్లేషణలో సమస్య వచ్చింది");
        setScreen("weather");
      });
  };

  // =============================================
  // NAVIGATION
  // =============================================
  const goHome = () => setScreen("welcome");

  const goWeather = () => {
    if (weatherData) {
      setScreen("weather");
      return;
    }
    speak("ముందు మీ ప్రాంతాన్ని గుర్తించండి");
    setScreen("welcome");
  };

  const goResult = () => {
    if (prediction) {
      setScreen("result");
      return;
    }

    if (weatherData) {
      speak("ముందు పంట ఒత్తిడి అంచనా వేస్తున్నాం");
      predictStress();
      return;
    }

    speak("ముందు మీ ప్రాంతాన్ని గుర్తించండి");
    setScreen("welcome");
  };

  const goTips = () => setScreen("tips");
  const goHelp = () => setScreen("help");

  // =============================================
  // UI
  // =============================================
  return (
    <div className="min-h-screen bg-green-50">

      <Navbar
        currentScreen={screen}
        goHome={goHome}
        goWeather={goWeather}
        goResult={goResult}
        goTips={goTips}
        goHelp={goHelp}
      />

      {screen === "welcome" &&
        <Screen1Assistant onLocationClick={getLocation} />
      }

      {screen === "loading" &&
        <LoadingScreen />
      }

      {screen === "weather" &&
        <WeatherPage
          weather={weatherData}
          onPredict={predictStress}
          onBack={() => setScreen("welcome")}
        />
      }

      {screen === "result" &&
        <ResultScreen
          result={prediction}
          onBack={() => setScreen("weather")}
          goTips={() => setScreen("tips")}
        />
      }

      {screen === "tips" &&
        <FarmingTips
          onBack={() => setScreen("welcome")}
          goHelp={() => setScreen("help")}
        />
      }

      {screen === "help" &&
        <HelpPage onBack={() => setScreen("welcome")} />
      }

    </div>
  );
}

export default App;