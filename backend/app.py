from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import os
import boto3
from io import BytesIO
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

# Serve React build
app = Flask(__name__, static_folder="build", static_url_path="")

CORS(app)

# =====================================================
# LOAD MODEL (AWS OR LOCAL)
# =====================================================

S3_BUCKET = "crop-stress-models-harshitha"
S3_REGION = "ap-south-1"

AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")

def load_from_s3(filename):
    logging.info(f"Loading {filename} from S3")
    s3 = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        region_name=S3_REGION
    )
    obj = s3.get_object(Bucket=S3_BUCKET, Key=filename)
    return pickle.load(BytesIO(obj["Body"].read()))

def load_local(filename):
    path = os.path.join(LOCAL_MODEL_DIR, filename)
    logging.info(f"Loading {filename} locally")
    return pickle.load(open(path, "rb"))

try:
    if AWS_ACCESS_KEY and AWS_SECRET_KEY:
        model = load_from_s3("model.pkl")
        scaler = load_from_s3("scaler.pkl")
        feature_columns = load_from_s3("feature_columns.pkl")
        label_encoder = load_from_s3("label_encoder.pkl")
    else:
        model = load_local("model.pkl")
        scaler = load_local("scaler.pkl")
        feature_columns = load_local("feature_columns.pkl")
        label_encoder = load_local("label_encoder.pkl")

    logging.info("Model loaded successfully")

except Exception as e:
    logging.error("Model loading failed")
    raise e

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
# WEATHER + ML PREDICTION
# =====================================================

@app.route("/weather", methods=["GET"])
def weather():

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude required"}), 400

    try:
        url = (
            "https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric&lang=te"
        )

        res = requests.get(url, timeout=(3, 5)).json()

        if "main" not in res:
            return jsonify({"error": "Weather API failed", "details": res}), 400

        temp = res["main"]["temp"]
        humidity = res["main"]["humidity"]
        feels_like = res["main"]["feels_like"]
        pressure = res["main"]["pressure"]

        wind_speed = res["wind"]["speed"]
        wind_deg = res["wind"].get("deg", 0)

        weather_main = res["weather"][0]["main"]
        description = res["weather"][0]["description"]

        visibility = res.get("visibility", 0)
        rain = res.get("rain", {}).get("1h", 0)

        location = res.get("name")
        country = res["sys"]["country"]

        sunrise = datetime.fromtimestamp(res["sys"]["sunrise"]).strftime("%H:%M")
        sunset = datetime.fromtimestamp(res["sys"]["sunset"]).strftime("%H:%M")

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
            "location": location,
            "country": country,
            "temperature": temp,
            "feels_like": feels_like,
            "humidity": humidity,
            "pressure": pressure,
            "wind_speed": wind_speed,
            "wind_direction": wind_deg,
            "weather": weather_main,
            "description": description,
            "visibility": visibility,
            "sunrise": sunrise,
            "sunset": sunset,
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
# HEALTH CHECK
# =====================================================

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

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
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)