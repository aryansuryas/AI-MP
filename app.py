"""
Airbnb Price Prediction - optional Streamlit app.
Run with:  streamlit run app.py
Needs in the SAME folder: airbnb_features.py, airbnb_price_prediction_model.pkl, model_metadata.json
(all three are created by running the notebook).
"""
import json
from pathlib import Path

import joblib
import pandas as pd
import streamlit as st

from airbnb_features import predict_price, explain_prediction

HERE = Path(__file__).parent
MODEL_FILE, META_FILE = HERE / "airbnb_price_prediction_model.pkl", HERE / "model_metadata.json"

st.set_page_config(page_title="Airbnb Price Predictor", page_icon="🏠", layout="wide")
st.title("🏠 Airbnb Nightly Price Predictor")
st.caption("College ML mini-project - a regression model trained on ~74,000 Airbnb listings from six US cities.")


@st.cache_resource(show_spinner="Loading model ...")
def load_artifacts():
    return joblib.load(MODEL_FILE), json.loads(META_FILE.read_text())


if not (MODEL_FILE.exists() and META_FILE.exists()):
    st.error("Model files not found. Run the notebook first (Section 17) so that "
             "airbnb_price_prediction_model.pkl and model_metadata.json are created next to app.py.")
    st.stop()

model, meta = load_artifacts()
spec = meta["input_spec"]
currency = spec.get("currency")


def money(v):
    return f"{currency} {v:,.0f}" if currency else f"{v:,.0f}"


# City & neighbourhood live outside the form so the neighbourhood list updates immediately.
c1, c2 = st.columns(2)
city = c1.selectbox("City", spec["categories"]["city"], index=spec["categories"]["city"].index(spec["defaults"]["city"]))
neighbourhood = c2.selectbox("Neighbourhood", ["Unknown"] + spec["neighbourhoods"].get(city, []))

with st.form("listing_form"):
    a, b, c = st.columns(3)
    with a:
        st.subheader("Property")
        property_type = st.selectbox("Property type", spec["categories"]["property_type"])
        room_type = st.selectbox("Room type", spec["categories"]["room_type"])
        bed_type = st.selectbox("Bed type", spec["categories"]["bed_type"])
        accommodates = st.number_input("Guests", *map(int, spec["ranges"]["accommodates"]), value=int(spec["defaults"]["accommodates"]))
        bedrooms = st.number_input("Bedrooms", *map(int, spec["ranges"]["bedrooms"]), value=int(spec["defaults"]["bedrooms"]))
        beds = st.number_input("Beds", *map(int, spec["ranges"]["beds"]), value=int(spec["defaults"]["beds"]))
        bathrooms = st.number_input("Bathrooms", float(spec["ranges"]["bathrooms"][0]), float(spec["ranges"]["bathrooms"][1]),
                                    value=float(spec["defaults"]["bathrooms"]), step=0.5)
    with b:
        st.subheader("Booking & host")
        cancellation_policy = st.selectbox("Cancellation policy", spec["categories"]["cancellation_policy"])
        cleaning_fee = st.checkbox("Cleaning fee charged", value=spec["defaults"]["cleaning_fee"])
        instant_bookable = st.checkbox("Instant bookable", value=spec["defaults"]["instant_bookable"])
        host_identity_verified = st.checkbox("Host identity verified", value=spec["defaults"]["host_identity_verified"])
        host_tenure_years = st.number_input("Years as a host", 0.0, 15.0, value=round(spec["defaults"]["host_tenure_years"], 1), step=0.5)
        st.subheader("Reviews")
        number_of_reviews = st.number_input("Number of reviews (0 = new listing)", 0, int(spec["ranges"]["number_of_reviews"][1]), value=0)
        review_scores_rating = st.number_input("Review score (20-100)", 20, 100, value=int(spec["defaults"]["review_scores_rating"]))
        days_since_last_review = st.number_input("Days since last review", 0, int(spec["ranges"]["days_since_last_review"][1]),
                                                 value=int(spec["defaults"]["days_since_last_review"]))
    with c:
        st.subheader("Amenities")
        amenities = st.multiselect("Select amenities", spec["amenity_vocabulary"], default=spec["default_amenities"])
    submitted = st.form_submit_button("Predict price", type="primary")

if submitted:
    inputs = dict(city=city, neighbourhood=neighbourhood, property_type=property_type, room_type=room_type, bed_type=bed_type,
                  cancellation_policy=cancellation_policy, accommodates=accommodates, bedrooms=bedrooms, beds=beds,
                  bathrooms=bathrooms, cleaning_fee=cleaning_fee, instant_bookable=instant_bookable,
                  host_identity_verified=host_identity_verified, host_tenure_years=host_tenure_years,
                  number_of_reviews=number_of_reviews, amenities=amenities,
                  review_scores_rating=review_scores_rating if number_of_reviews > 0 else None,
                  days_since_last_review=days_since_last_review if number_of_reviews > 0 else None)
    try:
        result = predict_price(model, spec, **inputs)
    except ValueError as err:
        st.error(str(err))
        st.stop()

    st.markdown("### Estimated nightly price")
    st.metric(label="Model estimate", value=money(result["price"]))
    st.write(f"Typical range: **{money(result['low'])} - {money(result['high'])}**")
    for w in result["warnings"]:
        st.warning(w)
    st.info("This is a statistical **estimate** based on similar listings in the training data. It is not a guaranteed market price. "
            + ("" if currency else "The currency is not confirmed in the dataset files."))

    st.markdown("### Why this estimate?")
    st.caption("Effect of each input compared with a typical listing's value of that input (others unchanged). "
               "A what-if analysis, not proof of cause and effect.")
    expl = explain_prediction(model, spec, **inputs).head(8)
    st.bar_chart(expl.set_index("factor")["effect on price"])
    st.dataframe(expl, hide_index=True)
