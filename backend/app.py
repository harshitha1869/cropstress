from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import os
import logging
import requests
from datetime import datetime
from utils.preprocess import preprocess_input

# =====================================================
# BASIC SETUP
# =====================================================

logging.basicConfig(level=logging.INFO)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_MODEL_DIR = os.path.join(BASE_DIR, "models")

app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

# =====================================================
# SAFE MODEL LOADING (NO CRASH)
# =====================================================

model = None
scaler = None
feature_columns = None
label_encoder = None

def load_local(filename):
    path = os.path.join(LOCAL_MODEL_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"{filename} not found in models/")
    return pickle.load(open(path, "rb"))

try:
    logging.info("Loading model files...")

    model = load_local("model.pkl")
    scaler = load_local("scaler.pkl")
    feature_columns = load_local("feature_columns.pkl")
    label_encoder = load_local("label_encoder.pkl")

    logging.info("Model loaded successfully ✅")

except Exception as e:
    logging.error(f"Model loading failed ❌: {e}")
    # Do NOT crash app
    model = None

# =====================================================
# TELUGU ADVICE
# =====================================================

def get_telugu_advice(stress):
    if stress == "High":
        return "హెచ్చరిక. వెంటనే నీరు పెట్టండి."
    elif stress == "Moderate":
        return "జాగ్రత్త. పంటను గమనించండి."
    return "మీ పంట సురక్షితంగా ఉంది."

# =====================================================
# WEATHER API CONFIG
# =====================================================


OPENWEATHER_API_KEY = "395baaae1fb6b6e1cbc267d4932db81b"

# =====================================================
# HEALTH CHECK (IMPORTANT FOR RENDER)
# =====================================================

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

# =====================================================
# WEATHER + ML PREDICTION
# =====================================================

@app.route("/weather", methods=["GET"])
def weather():

    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude required"}), 400

    try:
        url = (
            "https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        )

        res = requests.get(url, timeout=10).json()

        if "main" not in res:
            return jsonify({"error": "Weather API failed", "details": res}), 400

        temp = res["main"]["temp"]
        humidity = res["main"]["humidity"]
        rain = res.get("rain", {}).get("1h", 0)

        input_data = {
            "Day_Of_Year": 150,
            "Avg_Temperature_C": temp,
            "Consecutive_Dry_Days": 2,
            "Daily_Rainfall_mm": rain,
            "Rolling_7Day_Rainfall": rain,
            "Diurnal_Temp_Range_C": 5,
            "Heat_Stress_Index": temp * 0.1,
            "Max_Temperature_C": temp + 2,
            "Min_Temperature_C": temp - 2,
            "Relative_Humidity_%": humidity,
            "Soil_Moisture_Index": 0.4,
            "Solar_Radiation_MJ_m2": 15,
            "Location": "GPS",
            "Season": "Summer"
        }

        df = preprocess_input(input_data, feature_columns)
        X_scaled = scaler.transform(df)
        pred = model.predict(X_scaled)[0]
        stress = label_encoder.inverse_transform([pred])[0]

        return jsonify({
            "temperature": temp,
            "humidity": humidity,
            "rain_1h": rain,
            "stressLevel": stress,
            "teluguAdvice": get_telugu_advice(stress)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================================
# PREDICT ONLY
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():

    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json

        temp = data.get("temperature")
        humidity = data.get("humidity")
        rain = data.get("rain_1h", 0)

        input_data = {
            "Day_Of_Year": 150,
            "Avg_Temperature_C": temp,
            "Consecutive_Dry_Days": 2,
            "Daily_Rainfall_mm": rain,
            "Rolling_7Day_Rainfall": rain,
            "Diurnal_Temp_Range_C": 5,
            "Heat_Stress_Index": temp * 0.1,
            "Max_Temperature_C": temp + 2,
            "Min_Temperature_C": temp - 2,
            "Relative_Humidity_%": humidity,
            "Soil_Moisture_Index": 0.4,
            "Solar_Radiation_MJ_m2": 15,
            "Location": "GPS",
            "Season": "Summer"
        }

        df = preprocess_input(input_data, feature_columns)
        X_scaled = scaler.transform(df)
        pred = model.predict(X_scaled)[0]
        stress = label_encoder.inverse_transform([pred])[0]

        return jsonify({
            "stressLevel": stress,
            "teluguAdvice": get_telugu_advice(stress)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================================
# SERVE REACT FRONTEND
# =====================================================

@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)

    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, "index.html")

# =====================================================
# RUN SERVER (FIXED FOR RENDER)
# =====================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)