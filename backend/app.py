from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import os
import boto3
from io import BytesIO
from collections import deque
import heapq
import hashlib

from utils.preprocess import preprocess_input

# =====================================================
# BASE PATH (IMPORTANT FOR RENDER)
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_BUILD = os.path.join(BASE_DIR, "../frontend/build")

# =====================================================
# AWS S3 CONFIG
# =====================================================
S3_BUCKET = "crop-stress-models-harshitha"
S3_REGION = "ap-south-1"

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    region_name=S3_REGION
)

# =====================================================
# SAFE S3 LOADER
# =====================================================
def load_from_s3(filename):
    try:
        print(f"Loading {filename} from S3...")
        obj = s3.get_object(Bucket=S3_BUCKET, Key=filename)
        return pickle.load(BytesIO(obj["Body"].read()))
    except Exception as e:
        print(f"❌ S3 LOAD ERROR: {filename} -> {e}")
        raise e

# =====================================================
# FLASK APP
# =====================================================
app = Flask(__name__, static_folder=FRONTEND_BUILD, static_url_path="")
CORS(app)

# =====================================================
# LOAD MODEL ARTIFACTS
# =====================================================
model = load_from_s3("model.pkl")
scaler = load_from_s3("scaler.pkl")
feature_columns = load_from_s3("feature_columns.pkl")
label_encoder = load_from_s3("label_encoder.pkl")

print("✅ Model artifacts loaded successfully")

# =====================================================
# DSA STRUCTURES
# =====================================================

# 1️⃣ HashMap cache
prediction_cache = {}

# 2️⃣ Sliding window rainfall per location
rainfall_history = {}

# 3️⃣ Max heap for stress ranking
stress_heap = []

# =====================================================
# SLIDING WINDOW FUNCTION
# =====================================================
def update_rainfall_history(location, rainfall_today):
    if location not in rainfall_history:
        rainfall_history[location] = deque(maxlen=7)

    rainfall_history[location].append(rainfall_today)

    rolling_sum = sum(rainfall_history[location])

    consecutive_dry = 0
    for rain in reversed(rainfall_history[location]):
        if rain == 0:
            consecutive_dry += 1
        else:
            break

    return rolling_sum, consecutive_dry

# =====================================================
# PREDICTION API
# =====================================================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)

        location = data["Location"]
        rainfall_today = data["Daily_Rainfall_mm"]

        rolling_rain, consecutive_dry_days = update_rainfall_history(
            location, rainfall_today
        )

        # HASH KEY FOR CACHE
        raw_string = str(sorted(data.items()))
        key = hashlib.md5(raw_string.encode()).hexdigest()

        if key in prediction_cache:
            return jsonify({
                "prediction": prediction_cache[key],
                "cached": True
            })

        input_data = {
            "Day_Of_Year": data["Day_Of_Year"],
            "Avg_Temperature_C": data["Avg_Temperature_C"],
            "Consecutive_Dry_Days": consecutive_dry_days,
            "Daily_Rainfall_mm": rainfall_today,
            "Rolling_7Day_Rainfall": rolling_rain,
            "Diurnal_Temp_Range_C": data["Max_Temperature_C"] - data["Min_Temperature_C"],
            "Heat_Stress_Index": data["Heat_Stress_Index"],
            "Max_Temperature_C": data["Max_Temperature_C"],
            "Min_Temperature_C": data["Min_Temperature_C"],
            "Relative_Humidity_%": data["Relative_Humidity"],
            "Soil_Moisture_Index": data["Soil_Moisture_Index"],
            "Solar_Radiation_MJ_m2": data["Solar_Radiation"],
            "Location": location,
            "Season": data["Season"]
        }

        df = preprocess_input(input_data, feature_columns)
        X_scaled = scaler.transform(df)

        prediction = model.predict(X_scaled)[0]
        result = label_encoder.inverse_transform([prediction])[0]

        # CACHE SAVE
        prediction_cache[key] = result

        # HEAP RANKING
        stress_score_map = {
            "Low": 1,
            "Moderate": 2,
            "High": 3
        }

        score = stress_score_map.get(result, 0)
        heapq.heappush(stress_heap, (-score, location))

        return jsonify({
            "prediction": result,
            "cached": False
        })

    except Exception as e:
        print("🔥 Prediction Error:", e)
        return jsonify({"error": str(e)}), 500

# =====================================================
# TOP RISK LOCATIONS
# =====================================================
@app.route("/top-risk", methods=["GET"])
def get_top_risk():
    temp_heap = stress_heap.copy()
    top_locations = []

    while temp_heap and len(top_locations) < 5:
        score, location = heapq.heappop(temp_heap)
        top_locations.append({
            "location": location,
            "stress_score": -score
        })

    return jsonify(top_locations)

# =====================================================
# REACT FRONTEND SERVING
# =====================================================
@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static_or_react(path):
    full_path = os.path.join(app.static_folder, path)
    if os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# =====================================================
# RUN LOCAL
# =====================================================
if __name__ == "__main__":
    app.run(debug=True)
