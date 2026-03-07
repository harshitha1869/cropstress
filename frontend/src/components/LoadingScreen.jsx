import { useEffect } from "react";


export default function LoadingScreen(){

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-green-600"></div>

      <p className="mt-6 text-xl font-semibold">
        విశ్లేషణ జరుగుతోంది...
      </p>

    </div>
  );
}
