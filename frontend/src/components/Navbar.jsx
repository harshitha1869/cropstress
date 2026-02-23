import logo from "../assets/logo1.png";
export default function Navbar({
  currentScreen,
  goHome,
  goWeather,
  goResult,
  goTips,
  goHelp
}) {

  const activeStyle = "border-b-4 border-green-600 text-green-700 font-semibold";
  const normalStyle = "hover:text-green-600";

  return (
    <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

      <h1 className="text-xl font-bold text-green-700">
        Crop Stress Prediction System
      </h1>

      <div className="flex gap-6 text-lg">

        <button
          onClick={goHome}
          className={currentScreen === "welcome" ? activeStyle : normalStyle}
        >
          Home
        </button>

        <button
          onClick={goWeather}
          className={currentScreen === "weather" ? activeStyle : normalStyle}
        >
          Weather Info
        </button>

        <button
          onClick={goResult}
          className={currentScreen === "result" ? activeStyle : normalStyle}
        >
          Check Crop Stress
        </button>

        <button
          onClick={goTips}
          className={currentScreen === "tips" ? activeStyle : normalStyle}
        >
          Farming Tips
        </button>

        <button
          onClick={goHelp}
          className={currentScreen === "help" ? activeStyle : normalStyle}
        >
          Help
        </button>

      </div>
    </div>
  );
}