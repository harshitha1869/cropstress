import { useState, useEffect } from "react";
import { speak } from "../utils/speak";
import farmBg from "../assets/crop.jpg";

export default function HelpPage({ onBack }) {

  const [lang, setLang] = useState("te");

  // =====================================
  // TEXT CONTENT
  // =====================================

  const content = {
    te: {
      title: "🧑‍🌾 సహాయం",
      intro: "ఈ యాప్ రైతులకు పంట ఒత్తిడి స్థాయి తెలుసుకోవడంలో సహాయం చేస్తుంది.",
      stepsTitle: "వాడే విధానం",
      steps: [
        "1. నా ప్రాంతాన్ని గుర్తించండి బటన్ నొక్కండి",
        "2. మీ వాతావరణ సమాచారం చూడండి",
        "3. పచ్చ బటన్ నొక్కి పంట ఒత్తిడి తెలుసుకోండి",
        "4. వ్యవసాయ సూచనలు కోసం Farming Tips చూడండి"
      ],
      stressTitle: "పంట ఒత్తిడి అర్ధం",
      stress: [
        "Low → పంట ఆరోగ్యంగా ఉంది",
        "Moderate → కొంత ఒత్తిడి ఉంది",
        "High → ప్రమాదం ఎక్కువ — వెంటనే చర్య అవసరం"
      ],
      voice: "ఈ యాప్ మీకు వాయిస్ ద్వారా సమాచారం చెబుతుంది.",
      speakBtn: "🔊 వినండి",
      back: "వెనక్కి"
    },

    en: {
      title: "🧑‍🌾 Help",
      intro: "This app helps farmers check crop stress using weather data.",
      stepsTitle: "How to use",
      steps: [
        "1. Click Detect My Location",
        "2. View weather information",
        "3. Click green button to check crop stress",
        "4. Check Farming Tips for guidance"
      ],
      stressTitle: "Crop stress meaning",
      stress: [
        "Low → Crop is healthy",
        "Moderate → Some stress present",
        "High → Serious stress — take action immediately"
      ],
      voice: "This app provides voice guidance.",
      speakBtn: "🔊 Speak",
      back: "Back"
    }
  };

  const t = content[lang];

  // =====================================
  // SPEAK HELP
  // =====================================

  const speakHelp = () => {
    const text = `
      ${t.intro}.
      ${t.steps.join(". ")}.
      ${t.stress.join(". ")}.
      ${t.voice}.
    `;
    speak(text);
  };

  // AUTO SPEAK ON LOAD
  useEffect(() => {
    setTimeout(speakHelp, 600);
  }, [lang]);

  // =====================================
  // UI
  // =====================================

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${farmBg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">

        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === "te" ? "en" : "te")}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {lang === "te" ? "English" : "తెలుగు"}
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          {t.title}
        </h2>

        {/* Intro */}
        <p className="mb-4 text-lg">{t.intro}</p>

        {/* Steps */}
        <h3 className="font-bold text-xl mt-4">{t.stepsTitle}</h3>
        <ul className="text-left mt-2 space-y-1">
          {t.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        {/* Stress */}
        <h3 className="font-bold text-xl mt-5">{t.stressTitle}</h3>
        <ul className="text-left mt-2 space-y-1">
          {t.stress.map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        <p className="mt-4">{t.voice}</p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={speakHelp}
            className="bg-black text-white px-5 py-2 rounded"
          >
            {t.speakBtn}
          </button>

          <button
            onClick={onBack}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            {t.back}
          </button>
        </div>

      </div>
    </div>
  );
}