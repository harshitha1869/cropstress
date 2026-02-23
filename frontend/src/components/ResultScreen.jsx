import { speak } from "../utils/speak";
import { useEffect, useState } from "react";
import farmBg from "../assets/crop.jpg";

export default function ResultScreen({ result, onBack, goTips }) {

  const [lastSpeech, setLastSpeech] = useState("");

  const safeResult =
    result && ["Low", "Moderate", "High"].includes(result)
      ? result
      : "Moderate";

  const config = {
    Low: {
      emoji: "🌱",
      msg: "మీ పంట ఆరోగ్యంగా ఉంది. ప్రస్తుతం ఎలాంటి ప్రమాదం లేదు."
    },
    Moderate: {
      emoji: "⚠️",
      msg: "మీ పంటకు కొంత ఒత్తిడి ఉంది. నీటి పరిమాణం మరియు నేల తేమను గమనించండి."
    },
    High: {
      emoji: "🚨",
      msg: "హెచ్చరిక! మీ పంటకు ఎక్కువ ఒత్తిడి ఉంది. వెంటనే నీరు పెట్టండి."
    }
  };

  const data = config[safeResult];

  // ✅ AUTO SPEAK + STORE MESSAGE
  useEffect(() => {

    const message = `
    పంట ఒత్తిడి స్థాయి ${safeResult}.
    ${data.msg}
    వ్యవసాయ సూచనలు తెలుసుకోవడానికి కింద ఉన్న నీలం రంగు బటన్‌ను నొక్కండి.
    `;

    setLastSpeech(message);

    setTimeout(() => speak(message), 500);

  }, [safeResult]);

  // ✅ LISTEN AGAIN
  const speakResult = () => {
    if (!lastSpeech) return;
    speak(lastSpeech);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${farmBg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center w-96">

        <div className="text-7xl mb-4">{data.emoji}</div>

        <h1 className="text-3xl font-bold mb-3 text-green-700">
          పంట ఒత్తిడి స్థాయి
        </h1>

        <h2 className="text-2xl font-semibold mb-4">
          {safeResult}
        </h2>

        <p className="text-lg mb-6">{data.msg}</p>

        <button
          onClick={speakResult}
          className="bg-black text-white px-6 py-3 rounded-lg mb-3 w-full"
        >
          🔊 మళ్ళీ వినండి
        </button>

        <button
          onClick={onBack}
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-full"
        >
          తిరిగి వెళ్ళండి
        </button>

        <button
          onClick={goTips}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mt-3"
        >
          🌿 వ్యవసాయ సూచనలు చూడండి
        </button>

      </div>
    </div>
  );
}