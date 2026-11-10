# 🏠 StayWise AI — Smart Airbnb Pricing System [Dataset](https://www.kaggle.com/datasets/stevezhenghp/airbnb-price-prediction)

An end-to-end Machine Learning web application that predicts the nightly rental price of Airbnb listings using location parameters, property characteristics, room capacity, and amenity extractions.

Powered by a tuned **HistGradientBoosting** regression pipeline trained on ~74,000 listings across 6 major US cities (NYC, LA, SF, Chicago, Boston, DC).

---

## 📁 Repository Structure

```text
airbnbpriceprediction/
├── frontend/                              # Web Development Application
│   ├── src/
│   │   ├── components/                    # UI Components (Navbar, Footer, HouseIllustration, etc.)
│   │   ├── context/                       # Global Prediction Context & State
│   │   ├── data/                          # Dataset metadata & amenities list
│   │   ├── pages/                         # React Pages (Home, Predict, Results, About, Performance)
│   │   ├── services/                      # API client connecting frontend to backend
│   │   └── types/                         # TypeScript interfaces (PredictionRequest, etc.)
│   ├── index.html                         # HTML entry
│   ├── package.json                       # Frontend dependencies & Vite scripts
│   ├── tailwind.config.js                 # Tailwind styling configuration
│   └── vite.config.ts                     # Vite config with /api reverse-proxy
│
├── backend/                               # Python Backend & Model Linking
│   ├── server.py                          # Flask REST API (/api/predict, /api/model-performance, /api/health)
│   ├── airbnb_features.py                 # Feature engineering pipeline & transformer classes
│   ├── airbnb_price_prediction_model.pkl  # Trained ML pipeline (preprocessing + model)
│   ├── model_metadata.json                # Model specifications, metrics, and categories
│   ├── app.py                             # Interactive Streamlit dashboard
│   └── requirements.txt                   # Backend Python dependencies
│
├── main_prediction.ipynb                  # ⭐ PRIMARY JUPYTER NOTEBOOK (105 cells, complete pipeline)
├── airbnb_features.py                     # Root feature engineering reference
├── airbnb_price_prediction_model.pkl      # Root model artifact
├── model_metadata.json                    # Root metadata specification
├── app.py                                 # Root Streamlit app reference
├── requirements.txt                       # Project Python dependencies
├── package.json                           # Root workspace scripts
└── .gitignore                             # Git ignore rules
```

---

## ⚡ Quick Start

### 1. Python Backend & Model Setup

In a terminal, set up your Python environment and start the Flask API server:

```bash
# Create and activate virtual environment (optional but recommended)
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask API server (runs on http://127.0.0.1:5000)
python backend/server.py
```

### 2. Frontend Development Server

In a second terminal, install dependencies and start the React application:

```bash
# Navigate to frontend and install packages
cd frontend
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

> **Note:** The frontend automatically proxies requests from `/api/*` to the Python Flask backend at `http://127.0.0.1:5000`.

---

## 📓 Machine Learning Notebook

The primary ML notebook is **`main_prediction.ipynb`**. It contains the complete, executed 20-section workflow:

1. **Problem Framing & Setup**: Log-linear regression on `log_price` (`price = np.exp(pred)`).
2. **Data Ingestion**: Kaggle dataset loading and schema validation (~74,000 listings).
3. **Exploratory Data Analysis (EDA)**: Price distributions, city benchmarks, room type variations, and amenity co-occurrences.
4. **Feature Engineering (`airbnb_features.py`)**:
   - `ListingFeatureEngineer`: Custom scikit-learn transformer extracting top 25 amenity tokens, city centroids, and haversine distances.
   - Robust missing value imputation and one-hot encoding via `ColumnTransformer`.
5. **Model Exploration & Tuning**:
   - Linear Regression baseline
   - Ridge & Lasso regularized regressors
   - Random Forest Regressor
   - **HistGradientBoostingRegressor (Tuned)**: Best overall performer.
6. **Artifact Export**: Saves `airbnb_price_prediction_model.pkl` and `model_metadata.json`.

To run or inspect the notebook:
```bash
jupyter notebook main_prediction.ipynb
```

---

## 📊 Model Performance

| Metric | Log Scale | USD Price Scale | Description |
|---|---|---|---|
| **MAE** | 0.273 | **~$49.08** | Mean Absolute Error on held-out test listings |
| **RMSE** | 0.381 | **~$115.52** | Root Mean Squared Error |
| **R² Score** | **0.723** | 0.542 | 72.3% variance explained on log scale |

---

## 🖥️ Alternative Streamlit Interface

An interactive Streamlit dashboard is also included:

```bash
streamlit run backend/app.py
```

---

## 🔗 Architecture & Linking

```
┌─────────────────────────────────┐
│   React + Vite Frontend         │  (Port 5173)
│   - PredictPage (Inputs Form)   │
│   - ResultsPage (Visualization) │
└────────────────┬────────────────┘
                 │  POST /api/predict
                 │  GET  /api/model-performance
                 ▼
┌─────────────────────────────────┐
│   Flask REST API Backend        │  (backend/server.py on Port 5000)
│   - Request validation          │
│   - Amenity vocabulary mapping  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Trained ML Pipeline           │  (backend/airbnb_price_prediction_model.pkl)
│   - ListingFeatureEngineer      │  (backend/airbnb_features.py)
│   - ColumnTransformer           │
│   - HistGradientBoosting        │
└─────────────────────────────────┘
```
