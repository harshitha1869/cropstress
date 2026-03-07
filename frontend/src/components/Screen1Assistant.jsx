import { speak } from "../utils/speak";
import { useEffect, useState } from "react";
import farmBg from "../assets/crop.jpg";
import assistant from "../assets/assistant.png";

export default function Screen1Assistant({ onLocationClick }) {

  const [isTalking, setIsTalking] = useState(false);


 
  

  const handleSpeak = () => {
    speak(
      "మీ పంట ఆరోగ్యాన్ని తెలుసుకుందాం",
      () => setIsTalking(true),
      () => setIsTalking(false)
    );
  };
useEffect(() => {
  return () => {
    window.speechSynthesis.cancel();
  };
}, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url(${farmBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-md text-center">

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
          🌾 Surakshita Panta
        </h1>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">

          {/* ⭐ ASSISTANT IMAGE WITH TALKING ANIMATION */}
          <img
            src={assistant}
            alt="AI Assistant"
            className={`
              w-40 md:w-52 lg:w-60
              h-auto object-contain mx-auto mb-4
              rounded-xl shadow-md 
              ${isTalking ? "talking talkingGlow" : ""}
            `}
          />

          <button
            onClick={onLocationClick}
            className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition mb-3 w-full"
          >
            📍 నా ప్రాంతాన్ని గుర్తించండి
          </button>

          <button
            onClick={handleSpeak}
            className="bg-black text-white px-6 py-2 rounded-lg w-full"
          >
            🔊 మళ్ళీ వినండి
          </button>

        </div>
      </div>
    </div>
  );
}
