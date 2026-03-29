const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

// 🔥 Common fetch wrapper (better error handling)
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    console.error("API Error:", data);
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// 🌱 Predict Crop Stress
export async function predictCropDamage(formData) {
  console.log("📡 Calling:", `${BASE_URL}/predict`);

  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return handleResponse(response);
}

// 🌦 Get Weather + Stress
export async function getWeather(lat, lon) {
  if (!lat || !lon) {
    throw new Error("Latitude and Longitude are required");
  }

  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}`;
  console.log("📡 Calling:", url);

  const response = await fetch(url);

  return handleResponse(response);
}