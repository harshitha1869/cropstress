from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import datetime
import os

from utils.preprocess import preprocess_input

# -------------------------------
# App config
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    static_folder="build",
    static_url_path=""
)
CORS(app)

# -------------------------------
# Load ML artifacts
# -------------------------------
model = pickle.load(open(os.path.join(BASE_DIR, "models/logistic_model.pkl"), "rb"))
scaler = pickle.load(open(os.path.join(BASE_DIR, "models/scaler.pkl"), "rb"))
feature_columns = pickle.load(open(os.path.join(BASE_DIR, "models/feature_columns.pkl"), "rb"))
label_encoder = pickle.load(open(os.path.join(BASE_DIR, "models/label_encoder.pkl"), "rb"))

# -------------------------------
# Serve React Frontend
# -------------------------------
@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static_or_react(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# -------------------------------
# Prediction API
# -------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)

        input_data = {
            "Day_Of_Year": data["Day_Of_Year"],
            "Avg_Temperature_C": data["Avg_Temperature_C"],
            "Consecutive_Dry_Days": data["Consecutive_Dry_Days"],
            "Daily_Rainfall_mm": data["Daily_Rainfall_mm"],
            "Diurnal_Temp_Range_C": data["Max_Temperature_C"] - data["Min_Temperature_C"],
            "Heat_Stress_Index": data["Heat_Stress_Index"],
            "Max_Temperature_C": data["Max_Temperature_C"],
            "Min_Temperature_C": data["Min_Temperature_C"],
            "Relative_Humidity_%": data["Relative_Humidity"],
            "Soil_Moisture_Index": data["Soil_Moisture_Index"],
            "Solar_Radiation_MJ_m2": data["Solar_Radiation"],
            "Location": data["Location"],
            "Season": data["Season"]
        }

        df = preprocess_input(input_data, feature_columns)
        X_scaled = scaler.transform(df)
        prediction = model.predict(X_scaled)[0]
        result = label_encoder.inverse_transform([prediction])[0]

        return jsonify({"prediction": result})

    except Exception as e:
        print("🔥 Backend Error:", e)
        return jsonify({"error": str(e)}), 500

# -------------------------------
# Run locally
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
