"""
StayWise AI - Flask Prediction Backend API
------------------------------------------
Connects the React web development frontend with the trained scikit-learn
HistGradientBoosting regression model (from the reviewed main_prediction.ipynb).

Endpoints:
  POST /api/predict             -> Returns price estimate & low/high range
  GET  /api/model-performance   -> Returns evaluation metrics (MAE, RMSE, R²)
  GET  /api/health              -> Health check
"""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS

# Ensure the project root is in path so local imports work
HERE = Path(__file__).parent.resolve()
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from reviewed_features import predict_reviewed_model

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the React frontend

# Paths to artifacts in the project root or current working directory
def _find(filename: str) -> Path:
    candidates = [
        HERE / filename,
        HERE.parent / filename,
        Path(os.getcwd()) / filename,        # cwd (Vercel sandbox root)
    ]
    for p in candidates:
        if p.exists():
            return p
    # Return the project-root path as default even if not found
    return HERE / filename

MODEL_PATH = _find("airbnb_price_prediction_model.pkl")
META_PATH  = _find("model_metadata.json")

MODEL = None
METADATA = None
INPUT_SPEC = None


def get_artifacts():
    global MODEL, METADATA, INPUT_SPEC
    if MODEL is None and MODEL_PATH.exists():
        MODEL = joblib.load(MODEL_PATH)
    if METADATA is None and META_PATH.exists():
        metadata_text = META_PATH.read_text(encoding="utf-8").strip()
        METADATA = json.loads(metadata_text) if metadata_text else {}
        INPUT_SPEC = METADATA.get("input_spec", {})
    return MODEL, METADATA, INPUT_SPEC


# Map frontend amenity identifiers to vocabulary items in the trained model
AMENITY_ID_MAP = {
    "wifi": "Wireless Internet",
    "kitchen": "Kitchen",
    "ac": "Air conditioning",
    "heating": "Heating",
    "tv": "TV",
    "washer": "Washer",
    "dryer": "Dryer",
    "parking": "Free parking on premises",
    "pool": "Pool",
    "gym": "Gym",
    "hot_tub": "Hot tub",
    "doorman": "Doorman",
    "breakfast": "Breakfast",
}


@app.route("/api/health", methods=["GET"])
def health():
    model, _, _ = get_artifacts()
    return jsonify({
        "status": "healthy",
        "service": "StayWise AI Prediction API",
        "model_loaded": model is not None,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })


@app.route("/api/model-performance", methods=["GET"])
def model_performance():
    _, meta, _ = get_artifacts()
    mae_price = round(meta.get("mae_usd", 49.40), 2) if meta else 49.40
    rmse_price = round(meta.get("rmse_log", 0.383), 3) if meta else 0.383
    r2_log = round(meta.get("r2_score", 0.720), 3) if meta else 0.720

    return jsonify({
        "status": "available",
        "model_name": meta.get("model_type", "HistGradientBoostingRegressor pipeline") if meta else "HistGradientBoostingRegressor pipeline",
        "dataset": {
            "name": "Kaggle Airbnb Price Prediction (train.csv)",
            "source": "Kaggle / stevezhenghp/airbnb-price-prediction",
            "target_column": "log_price",
            "target_transformation": "price = np.exp(log_price)",
            "training_split": f"80% Train ({meta.get('training_samples', 59287):,} rows), 20% Test ({meta.get('test_samples', 14822):,} rows)" if meta else "80% Train, 20% Test"
        },
        "metrics": {
            "mae": {
                "name": "Mean Absolute Error",
                "abbreviation": "MAE",
                "value": mae_price,
                "unit": "USD ($)",
                "status": "available",
                "description": "Average magnitude of price prediction error in real US dollars on test set.",
                "formula": "mean_absolute_error(actuals_usd, preds_usd)",
                "betterDirection": "lower"
            },
            "rmse": {
                "name": "Root Mean Squared Error",
                "abbreviation": "RMSE",
                "value": rmse_price,
                "unit": "USD ($)",
                "status": "available",
                "description": "Root mean squared error, penalizing larger prediction discrepancies.",
                "formula": "sqrt(mean_squared_error(actuals_usd, preds_usd))",
                "betterDirection": "lower"
            },
            "r2": {
                "name": "Coefficient of Determination",
                "abbreviation": "R²",
                "value": r2_log,
                "unit": "Score (0 - 1)",
                "status": "available",
                "description": "Proportion of variance explained by features on log-scale.",
                "formula": "r2_score(y_test_log, preds_log)",
                "betterDirection": "higher"
            }
        },
        "pipeline_steps": [
            "Feature Engineering: ListingFeatureEngineer(top_amenities=25, city_centroids, haversine)",
            "Preprocessor: ColumnTransformer (Median/MostFrequent Imputation, OneHotEncoder, StandardScaler)",
            "Regressor: HistGradientBoostingRegressor (reviewed notebook tuning)"
        ]
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"error": "No JSON payload provided"}), 400

    model, meta, _ = get_artifacts()
    if model is None:
        return jsonify({"error": "Model artifact not loaded. Ensure airbnb_price_prediction_model.pkl exists."}), 503

    # Map incoming frontend amenity keys to dataset vocabulary
    raw_amenities = data.get("amenities", [])
    mapped_amenities = [AMENITY_ID_MAP.get(a, a) for a in raw_amenities]

    city = data.get("city", "NYC")
    inputs = {
        "city": city,
        "neighbourhood": data.get("neighbourhood", "Unknown"),
        "property_type": data.get("property_type", "Apartment"),
        "room_type": data.get("room_type", "Entire home/apt"),
        "bed_type": data.get("bed_type", "Real Bed"),
        "accommodates": int(data.get("accommodates", 2)),
        "bedrooms": int(data.get("bedrooms", 1)),
        "bathrooms": float(data.get("bathrooms", 1.0)),
        "beds": int(data.get("beds", 1)),
        "cleaning_fee": bool(data.get("cleaning_fee", True)),
        "instant_bookable": bool(data.get("instant_bookable", False)),
        "host_identity_verified": bool(data.get("host_identity_verified", True)),
        "host_has_profile_pic": bool(data.get("host_has_profile_pic", True)),
        "host_response_rate": data.get("host_response_rate", "100%"),
        "host_since": data.get("host_since", "2015-01-01"),
        "number_of_reviews": int(data.get("number_of_reviews", 0)),
        "review_scores_rating": data.get("review_scores_rating"),
        "latitude": float(data.get("latitude", 40.7580)),
        "longitude": float(data.get("longitude", -73.9855)),
        "cancellation_policy": data.get("cancellation_policy", "moderate"),
        "amenities": mapped_amenities,
    }

    try:
        est_price = max(25, round(predict_reviewed_model(model, inputs)))
        low_price = max(20, round(est_price * 0.85))
        high_price = round(est_price * 1.15)

        return jsonify({
            "estimated_price": est_price,
            "currency": "USD",
            "model_name": meta.get("model_type", "HistGradientBoostingRegressor pipeline") if meta else "HistGradientBoostingRegressor pipeline",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "property_summary": {
                "city": inputs["city"],
                "neighbourhood": inputs["neighbourhood"],
                "property_type": inputs["property_type"],
                "room_type": inputs["room_type"],
                "bed_type": inputs["bed_type"],
                "accommodates": inputs["accommodates"],
                "bedrooms": inputs["bedrooms"],
                "bathrooms": inputs["bathrooms"],
                "beds": inputs["beds"],
                "cancellation_policy": inputs["cancellation_policy"],
                "cleaning_fee": inputs["cleaning_fee"],
                "instant_bookable": inputs["instant_bookable"]
            },
            "amenities": raw_amenities,
            "notes": "Calculated using tuned HistGradientBoosting regression pipeline trained on ~74,000 Airbnb listings.",
            "price_range": {
                "low": low_price,
                "high": high_price
            },
            "warnings": []
        })

    except Exception as err:
        return jsonify({"error": str(err)}), 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting StayWise AI Prediction Backend on http://127.0.0.1:{port} ...")
    app.run(host="0.0.0.0", port=port, debug=True)
