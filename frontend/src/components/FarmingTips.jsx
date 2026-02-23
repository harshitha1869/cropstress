import { useState } from "react";
import { speak } from "../utils/speak";
import farmBg from "../assets/crop.jpg";

export default function FarmingTips({ onBack, goHelp }) {

  const [lang, setLang] = useState("te");

  // ================================
  // 🌱 FARMING TIPS DATA
  // ================================

  const tips = {
    te: [
      "పంటకు సరైన సమయానికి నీరు పెట్టండి.",
      "నేల తేమను తరచుగా పరిశీలించండి.",
      "ఎక్కువ ఎరువు వేయడం నివారించండి.",
      "కీటకాలు కనిపిస్తే వెంటనే నివారణ చేయండి.",
      "ఉదయం లేదా సాయంత్రం నీరు పెట్టడం మంచిది.",
      "వాతావరణ మార్పులను గమనిస్తూ వ్యవసాయం చేయండి.",
      "పంట మధ్య దూరం సరైన విధంగా ఉంచండి.",
      "సేంద్రియ ఎరువులు ఉపయోగించడం మంచిది."
    ],

    en: [
      "Water crops at the right time regularly.",
      "Check soil moisture frequently.",
      "Avoid overuse of fertilizers.",
      "Control pests immediately when noticed.",
      "Water crops in morning or evening.",
      "Monitor weather changes regularly.",
      "Maintain proper spacing between plants.",
      "Use organic fertilizers whenever possible."
    ]
  };

  const currentTips = tips[lang];

  // ================================
  // 🔊 SPEAK ALL TIPS
  // ================================

  const speakTips = () => {

    const text =
      lang === "te"
        ? `రైతు గారు, ముఖ్యమైన వ్యవసాయ సూచనలు వినండి. ${currentTips.join(". ")}`
        : `Farmer, here are some important farming tips. ${currentTips.join(". ")}`;

    speak(text);
  };

  // ================================
  // UI
  // ================================

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${farmBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        {/* LANGUAGE SWITCH */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === "te" ? "en" : "te")}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {lang === "te" ? "English" : "తెలుగు"}
          </button>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-green-700 mb-5">
          {lang === "te" ? "🌾 వ్యవసాయ సూచనలు" : "🌾 Farming Tips"}
        </h2>

        {/* TIPS LIST */}
        <div className="space-y-3 text-lg text-left">

          {currentTips.map((tip, index) => (
            <p key={index}>✅ {tip}</p>
          ))}

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 justify-center mt-6">

          <button
            onClick={speakTips}
            className="bg-black text-white px-4 py-2 rounded"
          >
            🔊 {lang === "te" ? "వినండి" : "Listen"}
          </button>

          <button
            onClick={onBack}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {lang === "te" ? "వెనక్కి" : "Back"}
          </button>
          <button
    onClick={goHelp}
    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
  >
    ❓ సహాయం
  </button>

        </div>

      </div>
    </div>
  );
}