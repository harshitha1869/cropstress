# 🌿 Crop Stress Predictor – Smart Agriculture Assistant

A full-stack ML-based web application that analyzes real-time weather conditions and predicts crop stress levels to assist farmers in making informed decisions.

🌐 Live Demo: https://cropstress.onrender.com/
---

## 🛡️ Overview

Crop Stress Predictor is an intelligent agriculture support system that combines:

* 🌦️ Real-time weather data
* 🤖 Machine Learning prediction
* 🌍 Location-based analysis
* 🗣️ Voice-assisted guidance (Telugu + English)

It helps farmers understand crop health and take preventive action before damage occurs.

---

## 🔍 Features

### 📍 Real-Time Weather Integration

* Fetches live weather using OpenWeather API
* Displays:

  * Temperature
  * Humidity
  * Rainfall
  * Wind Speed
  * Pressure
  * Visibility

---

### 🧠 AI-Based Crop Stress Prediction

Uses a trained ML model to classify crop stress levels:

* 🟢 Low Stress
* 🟡 Moderate Stress
* 🔴 High Stress

Based on environmental and weather conditions.

---

### 🗣️ Voice Assistant (Multilingual)

* Supports:

  * 🇮🇳 Telugu
  * 🇬🇧 English
* Automatically reads weather and insights
* Farmer-friendly interaction design

---

### 📊 Smart Data Processing

* Feature engineering using:

  * Temperature trends
  * Rainfall patterns
  * Humidity levels
* Scaled inputs using preprocessing pipeline

---

### 🎨 User Interface

* Clean and modern UI
* Agriculture-themed design 🌾
* Responsive layout
* Interactive buttons

---

### ♿ Accessibility Features

* Voice feedback for non-literate users
* Language toggle (Telugu ↔ English)
* Simple and intuitive navigation

---

## 🧪 System Flow

1. User enters or selects location
2. App fetches real-time weather data
3. Data is processed using ML pipeline
4. Model predicts crop stress level
5. Results displayed with advice
6. Voice assistant explains output

---

## 🧰 Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* Tailwind CSS

### Backend

* Flask (Python)
* Flask-CORS

### Machine Learning

* Scikit-learn
* Pandas
* NumPy

### APIs

* OpenWeather API

---

## 🚀 How to Run Locally

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 🔹 Frontend

```bash
cd frontend
npm install
npm start
```

---

## ⚙️ Deployment

* Backend: Render (Flask API)
* Frontend: Render Static / Netlify

---

## 🧩 Why This Project Matters

Agriculture faces major challenges due to:

* Climate change 🌡️
* Unpredictable rainfall 🌧️
* Lack of real-time insights

This project helps by:

* Providing early stress detection
* Supporting farmers with simple insights
* Combining AI with real-world data

---

## 🎯 Key Highlights

* Real-time + ML integration
* Multilingual voice assistant
* Full-stack deployment
* Practical real-world use case

---

## ⚠️ Disclaimer

Predictions are based on trained models and environmental assumptions.
Actual crop conditions may vary. Use as a decision-support tool.

---

## 👩‍💻 Author

Harshitha V
Aspiring Full-Stack Developer
Focused on real-world problem solving, smart systems, and impactful applications.
