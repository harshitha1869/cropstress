const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function predictCropDamage(formData) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  return response.json();
}

export async function getWeather(lat, lon) {
  const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}`);

  if (!response.ok) {
    throw new Error("Weather fetch failed");
  }

  return response.json();
}