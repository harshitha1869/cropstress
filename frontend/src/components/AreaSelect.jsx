import { useState } from "react";
import { useArea } from "../context/AreaContext";

export default function AreaSelect() {
  const { setArea } = useArea();
  const [selected, setSelected] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[400px] text-center">
        <h1 className="text-2xl font-serif font-bold">
          Select Paddy Growing Area
        </h1>

        <select
          className="input w-full mt-6"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Select Area --</option>
          <option value="Palakolu">Palakolu</option>
          <option value="Bhimavaram">Bhimavaram</option>
          <option value="Tanuku">Tanuku</option>
        </select>

        <button
          disabled={!selected}
          onClick={() => setArea(selected)}
          className="mt-6 w-full bg-primary text-white py-3 rounded-lg disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
