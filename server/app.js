const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node Server Running");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
app.post("/weather", async (req, res) => {
  const { lat, lon } = req.body;

  try {
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`
    );

    res.json(weather.data);
  } catch (error) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

app.post("/predict", async (req, res) => {
  console.log("🔥 Request reached Node first");

  try {
    const response = await axios.post(
      "http://localhost:5000/predict",
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML service failed" });
  }
});