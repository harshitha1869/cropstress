import { useEffect } from "react";
import { speak } from "../utils/speak";

export default function LoadingScreen(){

  useEffect(()=>{
    speak("మీ పంట పరిస్థితి విశ్లేషించబడుతోంది. దయచేసి వేచి ఉండండి.");
  },[]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-green-600"></div>

      <p className="mt-6 text-xl font-semibold">
        విశ్లేషణ జరుగుతోంది...
      </p>

    </div>
  );
}
