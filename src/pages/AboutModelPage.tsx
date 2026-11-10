import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ArrowRight,
  Calculator,
  Compass
} from 'lucide-react';

export const AboutModelPage: React.FC = () => {
  return (
    <div className="w-full py-6 sm:py-10 md:py-14">
      <div className="page-container">
        
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 text-left">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[11px] font-medium text-[#737373] mb-2">
            <span>Model Architecture & Interpretability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">
            About the Linear Regression Model
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-3xl">
            Why Linear Regression was chosen as the core estimator, how the mathematical log transformation works, and how feature weights translate into real rental dollar impacts.
          </p>
        </div>

        {/* SECTION 1: WHY LINEAR REGRESSION */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
            <Compass className="w-4 h-4 text-[#171717]" />
            <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wider">
              1. The Choice of Linear Regression
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-4">
            In Airbnb pricing, hosts require <strong className="text-[#171717]">explainability</strong>. A complex black-box model (such as a deep neural network) cannot easily explain to a host <em>why</em> their property was valued at a particular price. Linear Regression offers direct parameter interpretability: each learned weight corresponds directly to a quantifiable dollar percentage shift for an extra bedroom, an added bathroom, or a pool.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-4">
              <span className="font-semibold text-xs sm:text-sm text-[#171717] block mb-1">Interpretable Weights</span>
              <p className="text-[11px] sm:text-xs text-[#737373]">
                Learns one weight per feature: log(price) = intercept + w₁·feature₁ + w₂·feature₂...
              </p>
            </div>
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-4">
              <span className="font-semibold text-xs sm:text-sm text-[#171717] block mb-1">Production Stability</span>
              <p className="text-[11px] sm:text-xs text-[#737373]">
                Chained with scikit-learn ColumnTransformer and OneHotEncoder with handle_unknown='ignore'.
              </p>
            </div>
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-4 sm:col-span-2 lg:col-span-1">
              <span className="font-semibold text-xs sm:text-sm text-[#171717] block mb-1">Instant Inference</span>
              <p className="text-[11px] sm:text-xs text-[#737373]">
                Matrix multiplication executes in sub-millisecond speeds, ideal for real-time web forms.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: THE LOG-TRANSFORMATION */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
            <Calculator className="w-4 h-4 text-[#171717]" />
            <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wider">
              2. Log-Price Transformation (Right-Skew Normalization)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-3">
            Nightly rental prices are naturally right-skewed: most listings are priced between $75 and $300, while a small tail of luxury listings range up to thousands. Standard linear regression on raw dollars would over-focus on luxury outliers, causing severe distortions on everyday apartments.
          </p>
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-4 font-mono text-xs text-[#171717] mb-3 overflow-x-auto whitespace-pre sm:whitespace-normal">
            log_price = ln(price) &nbsp;→&nbsp; Model learns on log-scale &nbsp;→&nbsp; Final Price = exp(log_price)
          </div>
          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
            By predicting <code className="bg-[#FAFAFA] px-1 py-0.5 rounded border border-[#E5E5E5] text-[#171717]">log_price</code>, learned weights function as percentage changes: a weight of <code className="text-[#171717]">w</code> translates to an approximate <code className="text-[#171717]">(exp(w) - 1) × 100%</code> change in the nightly rate.
          </p>
        </div>

        {/* SECTION 3: KEY FEATURE DRIVERS */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
            <TrendingUp className="w-4 h-4 text-[#171717]" />
            <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wider">
              3. What Drives the Nightly Price? (Notebook Findings)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs text-[#737373]">
            <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
              <span className="font-semibold text-[#171717] text-xs sm:text-sm block mb-1">A. Property Dimensions</span>
              <p className="leading-relaxed">
                Accommodates, bedrooms, and bathrooms have the most consistent, linear positive effects. Each additional guest accommodation shifts price upward steadily across all urban markets.
              </p>
            </div>
            <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
              <span className="font-semibold text-[#171717] text-xs sm:text-sm block mb-1">B. City & Geographic Market</span>
              <p className="leading-relaxed">
                From notebook EDA: NYC and Boston represent the highest median listing rates, followed by LA, SF, Chicago, and DC. Location baseline shifts price regardless of property size.
              </p>
            </div>
            <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
              <span className="font-semibold text-[#171717] text-xs sm:text-sm block mb-1">C. High-Impact Amenities</span>
              <p className="leading-relaxed">
                Luxury & convenience amenities (Pool, Hot Tub, Dedicated Parking, Air Conditioning, Gym, Doorman) command measurable rate premiums over baseline listings.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#171717]">View empirical validation</h3>
            <p className="text-[11px] sm:text-xs text-[#737373]">Check MAE, RMSE, and R² definitions in Model Performance.</p>
          </div>
          <Link
            to="/model-performance"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-[#333333] hover:bg-[#1f1f1f] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            <span>Model Performance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
