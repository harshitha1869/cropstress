import { useState } from "react";
import { useArea } from "../context/AreaContext";

export default function PredictForm() {
  const { area } = useArea();

  const [formData, setFormData] = useState({
  
    avgTemp: "",
    maxTemp: "",
    minTemp: "",
    humidity: "",
    rainfall: "",
    dryDays: "",
    soilMoisture: "",
    solarRadiation: "",
    heatStress: "",
    dayOfYear: "",
    season: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    if (!area) {
      alert("Please select an area first");
      return;
    }

    const payload = {

      Location: area,

      Day_Of_Year: Number(formData.dayOfYear),

      Avg_Temperature_C: Number(formData.avgTemp),
      Max_Temperature_C: Number(formData.maxTemp),
      Min_Temperature_C: Number(formData.minTemp),

      Relative_Humidity: Number(formData.humidity),
      Daily_Rainfall_mm: Number(formData.rainfall),
      Consecutive_Dry_Days: Number(formData.dryDays),
      Soil_Moisture_Index: Number(formData.soilMoisture),

      Solar_Radiation: Number(formData.solarRadiation),
      Heat_Stress_Index: Number(formData.heatStress),

      Season: formData.season,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        throw new Error(data.error || "Prediction failed");
      }

      alert(`🌾 Crop Damage Risk: ${data.prediction}`);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Prediction failed. Check backend.");
    }
  };

  return (
    <section id="predict" className="py-20 flex justify-center">
      <div className="bg-white rounded-xl shadow-lg p-10 w-[900px]">

        <h2 className="text-2xl font-serif font-semibold">
          Field Parameters
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your paddy field conditions
        </p>

        <p className="text-sm text-primary mt-2">
          Selected Area: <strong>{area}</strong>
        </p>

        {/* TEMPERATURE */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-green-700 mb-3">
            🌡 TEMPERATURE
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <input className="input" name="avgTemp" placeholder="Average (°C)" onChange={handleChange} />
            <input className="input" name="maxTemp" placeholder="Maximum (°C)" onChange={handleChange} />
            <input className="input" name="minTemp" placeholder="Minimum (°C)" onChange={handleChange} />
          </div>
        </div>

        {/* MOISTURE & RAINFALL */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-green-700 mb-3">
            💧 MOISTURE & RAINFALL
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <input className="input" name="humidity" placeholder="Relative Humidity (%)" onChange={handleChange} />
            <input className="input" name="rainfall" placeholder="Daily Rainfall (mm)" onChange={handleChange} />
            <input className="input" name="dryDays" placeholder="Consecutive Dry Days" onChange={handleChange} />
            <input className="input" name="soilMoisture" placeholder="Soil Moisture Index" onChange={handleChange} />
          </div>
        </div>

        {/* SOLAR & HEAT STRESS */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-green-700 mb-3">
            ☀ SOLAR & HEAT STRESS
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <input className="input" name="solarRadiation" placeholder="Solar Radiation (MJ/m²)" onChange={handleChange} />
            <input className="input" name="heatStress" placeholder="Heat Stress Index (0-1)" onChange={handleChange} />
          </div>
        </div>

        {/* LOCATION & TIMING */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-green-700 mb-3">
            📍 LOCATION & TIMING
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <input className="input" name="dayOfYear" placeholder="Day of Year (1-365)" onChange={handleChange} />
          
            <select className="input" name="season" onChange={handleChange}>
              <option value="">Season</option>
              <option value="Summer">Summer</option>
              <option value="Monsoon">Monsoon</option>
              <option value="Winter">Winter</option>
            </select>

            <select className="input" disabled>
              <option>Auto from Area</option>
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          className="mt-10 w-full bg-primary text-white py-3 rounded-lg"
        >
          🌱 Predict Crop Damage Risk
        </button>
      </div>
    </section>
  );
}
