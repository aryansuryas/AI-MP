"""Feature engineering used by the reviewed Airbnb training notebook."""
import re
from pathlib import Path

import numpy as np
import pandas as pd


CITY_CENTRES = {
    "NYC": (40.7580, -73.9855),
    "LA": (34.0522, -118.2437),
    "SF": (37.7749, -122.4194),
    "DC": (38.9072, -77.0369),
    "Chicago": (41.8781, -87.6298),
    "Boston": (42.3601, -71.0589),
}

NUMERIC_FEATURES = [
    "accommodates", "bathrooms", "bedrooms", "beds", "number_of_reviews",
    "review_scores_rating", "host_response_rate", "latitude", "longitude",
    "dist_to_centre_km", "guests_per_bedroom", "guests_per_bed",
    "bath_per_guest", "total_rooms", "host_tenure_years", "amenity_count",
]
CATEGORICAL_FEATURES = [
    "city", "property_type", "room_type", "bed_type", "cancellation_policy",
]
BINARY_FEATURES = [
    "cleaning_fee", "instant_bookable", "host_identity_verified",
    "host_has_profile_pic", "has_reviews",
]
POPULAR_AMENITIES = [
    "Wireless Internet", "Air conditioning", "Kitchen", "Heating",
    "Family/kid friendly", "Essentials", "Hair dryer", "Iron",
    "Smoke detector", "TV", "Washer", "Dryer", "Pool",
]


def engineer_features(data: pd.DataFrame) -> pd.DataFrame:
    """Apply the exact feature transformations used by final-Airbnb-reviewed."""
    frame = data.copy()
    amenities = frame["amenities"].fillna("").astype(str)
    frame["amenity_count"] = amenities.apply(
        lambda value: len(re.findall(r'"([^"]+)"|([^,{}]+)', value))
    )

    for amenity in POPULAR_AMENITIES:
        feature_name = "amen_" + re.sub(
            r"[^a-z0-9]+", "_", amenity.lower()
        ).strip("_")
        frame[feature_name] = amenities.str.contains(
            amenity, case=False, regex=False
        ).astype(int)

    frame["host_response_rate"] = pd.to_numeric(
        frame["host_response_rate"].astype(str).str.replace("%", "", regex=False),
        errors="coerce",
    )
    guests = frame["accommodates"].clip(lower=1)
    bedrooms = frame["bedrooms"].fillna(1).clip(lower=1)
    beds = frame["beds"].fillna(1).clip(lower=1)
    bathrooms = frame["bathrooms"].fillna(1)
    frame["guests_per_bedroom"] = guests / bedrooms
    frame["guests_per_bed"] = guests / beds
    frame["bath_per_guest"] = bathrooms / guests
    frame["total_rooms"] = bedrooms + bathrooms

    reference_date = pd.Timestamp("2017-10-05")
    host_since = pd.to_datetime(frame["host_since"], errors="coerce")
    frame["host_tenure_years"] = (
        (reference_date - host_since).dt.days / 365.25
    ).clip(lower=0)
    frame["has_reviews"] = (frame["number_of_reviews"] > 0).astype(int)

    for column in [
        "cleaning_fee", "instant_bookable",
        "host_identity_verified", "host_has_profile_pic",
    ]:
        frame[column] = (
            frame[column]
            .map({"t": 1, "f": 0, True: 1, False: 0})
            .fillna(0)
            .astype(int)
        )

    def distance_to_centre(row):
        centre = CITY_CENTRES.get(row["city"])
        if centre is None or pd.isna(row["latitude"]) or pd.isna(row["longitude"]):
            return np.nan
        centre_lat, centre_lon = centre
        dlat = np.radians(row["latitude"] - centre_lat)
        dlon = np.radians(row["longitude"] - centre_lon)
        value = (
            np.sin(dlat / 2) ** 2
            + np.cos(np.radians(centre_lat))
            * np.cos(np.radians(row["latitude"]))
            * np.sin(dlon / 2) ** 2
        )
        return 6371.0 * 2 * np.arcsin(np.sqrt(value))

    frame["dist_to_centre_km"] = frame.apply(distance_to_centre, axis=1)
    return frame


def predict_reviewed_model(model, listing: dict) -> float:
    """Predict a price using the reviewed notebook's raw listing contract."""
    row = pd.DataFrame([listing])
    engineered = engineer_features(row)
    binary_features = BINARY_FEATURES + [
        column for column in engineered.columns if column.startswith("amen_")
    ]
    features = NUMERIC_FEATURES + CATEGORICAL_FEATURES + binary_features
    for column in features:
        if column not in engineered:
            engineered[column] = np.nan
    return float(np.exp(model.predict(engineered[features])[0]))
