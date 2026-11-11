# 🏠 StayWise AI — Smart Airbnb Pricing System [Dataset](https://www.kaggle.com/datasets/stevezhenghp/airbnb-price-prediction)

An end-to-end Machine Learning web application that predicts the nightly rental price of Airbnb listings using location parameters, property characteristics, room capacity, and amenity extractions.

Powered by a tuned **HistGradientBoosting** regression pipeline trained on ~74,000 listings across 6 major US cities (NYC, LA, SF, Chicago, Boston, DC).

---

## 📁 Repository Structure

```text
airbnbpriceprediction/
├── src/                                   # React web application source
│   ├── components/                        # UI Components
│   ├── context/                           # Global Prediction Context & State
│   ├── data/                              # Dataset metadata & amenities list
│   ├── pages/                             # React Pages
│   ├── services/                          # API client
│   └── types/                             # TypeScript interfaces
├── index.html                             # HTML entry
├── server.py                              # Local Flask REST API
├── app.py                                 # Local Streamlit dashboard
├── main_prediction.ipynb                  # ⭐ Reviewed training notebook
├── airbnb_features.py                     # Local model feature engineering
├── airbnb_price_prediction_model.pkl      # Local model artifact
├── model_metadata.json                    # Local model metadata
├── requirements.txt                       # Project Python dependencies
├── package.json                           # Full-stack scripts and dependencies
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
python server.py
```

### 2. Frontend Development Server

In a second terminal, install dependencies and start the React application:

```bash
# Install JavaScript dependencies from the repository root
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

> **Note:** The frontend automatically proxies requests from `/api/*` to the Python Flask backend at `http://127.0.0.1:5000`.

---

## 📓 Machine Learning Notebook

The primary ML notebook is **`main_prediction.ipynb`**, the reviewed final workflow:

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

## 🚀 Vercel Deployment

Vercel deploys the React/Vite website as a static application. Python, notebook, model,
and data files are excluded from the Vercel bundle to avoid serverless function size
limits. The local Flask API remains available for development at `http://127.0.0.1:5000`.

```bash
npm install
npm run build
```

Deploy the repository from Vercel with the project root as the deployment root.

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
streamlit run app.py
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
│   Flask REST API Backend        │  (server.py on Port 5000)
│   - Request validation          │
│   - Amenity vocabulary mapping  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Trained ML Pipeline           │  (airbnb_price_prediction_model.pkl)
│   - ListingFeatureEngineer      │  (airbnb_features.py)
│   - ColumnTransformer           │
│   - HistGradientBoosting        │
└─────────────────────────────────┘
```
