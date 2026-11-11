import React, { useState, useEffect } from 'react';
import { getModelPerformance } from '../services/api';
import type { ModelPerformanceData } from '../types';
import {
  BarChart2,
  Layers,
  FileCode,
  Info
} from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<ModelPerformanceData | null>(null);
  const [showDemoScatter, setShowDemoScatter] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getModelPerformance();
        setPerformanceData(data);
      } catch (e) {
        console.error('Failed to load model performance', e);
      }
    }
    loadData();
  }, []);

  // Demo synthetic test scatter points if host toggles preview for Phase 2 readiness
  const sampleScatterData = [
    { actual: 80, predicted: 84 },
    { actual: 120, predicted: 110 },
    { actual: 150, predicted: 165 },
    { actual: 190, predicted: 180 },
    { actual: 210, predicted: 225 },
    { actual: 260, predicted: 245 },
    { actual: 300, predicted: 310 },
    { actual: 340, predicted: 320 },
    { actual: 390, predicted: 420 },
    { actual: 450, predicted: 430 },
  ];

  return (
    <div className="w-full py-6 sm:py-10 md:py-14">
      <div className="page-container">
        
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 text-left">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[11px] font-medium text-[#737373] mb-2">
            <span>Model Diagnostics & Validation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">
            Model Performance
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-3xl">
            Empirical evaluation metrics and validation results for the reviewed HistGradientBoosting pricing model.
          </p>
        </div>

        {/* STATUS BANNER: REPOSITORY NOTEBOOK INSPECTION */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 sm:p-5 mb-6 sm:mb-8 shadow-sm">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center text-[#171717] flex-shrink-0 mt-0.5">
              <FileCode className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#171717]">Notebook Inspection Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAFAFA] border border-[#E5E5E5] text-[#737373]">
                  main_prediction.ipynb (reviewed final notebook)
                </span>
              </div>
              <p className="text-[#737373] leading-relaxed">
                The reviewed notebook defines the preprocessing, tuning, and held-out evaluation pipeline. Metrics are shown when the local Flask API is running; the static Vercel site keeps its fallback status rather than inventing values.
              </p>
            </div>
          </div>
        </div>

        {/* METRICS CARDS: 3 IN ONE ROW (DESKTOP), 2 COLS (TABLET), STACKED (MOBILE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
          
          {/* Card 1: MAE */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                  Mean Absolute Error
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E5E5E5] text-[#737373]">
                  Lower is better
                </span>
              </div>

              <div className="my-2 sm:my-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                    {performanceData?.metrics.mae.value !== null && performanceData?.metrics.mae.value !== undefined
                      ? `$${performanceData.metrics.mae.value.toFixed(2)}`
                      : 'Pending'}
                  </span>
                  <span className="text-xs text-[#737373]">USD ($)</span>
                </div>
                <span className="inline-block mt-1 text-[11px] text-[#737373]">
                  Abbreviation: <strong className="text-[#171717]">MAE</strong>
                </span>
              </div>

              <p className="text-xs text-[#737373] leading-relaxed mt-2 border-t border-[#F0F0F0] pt-3">
                Measures the average dollar magnitude of price estimation error on unseen test listings: <code className="text-[10px] bg-[#FAFAFA] px-1 py-0.5 rounded border border-[#E5E5E5]">mean_absolute_error(actuals, preds)</code>.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] text-[#737373]">
              <span>Formula: |Actual - Pred|</span>
              <span className="text-[#171717] font-medium">Cell 20/21</span>
            </div>
          </div>

          {/* Card 2: RMSE */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                  Root Mean Squared Error
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E5E5E5] text-[#737373]">
                  Lower is better
                </span>
              </div>

              <div className="my-2 sm:my-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                    {performanceData?.metrics.rmse.value !== null && performanceData?.metrics.rmse.value !== undefined
                      ? `$${performanceData.metrics.rmse.value.toFixed(2)}`
                      : 'Pending'}
                  </span>
                  <span className="text-xs text-[#737373]">USD ($)</span>
                </div>
                <span className="inline-block mt-1 text-[11px] text-[#737373]">
                  Abbreviation: <strong className="text-[#171717]">RMSE</strong>
                </span>
              </div>

              <p className="text-xs text-[#737373] leading-relaxed mt-2 border-t border-[#F0F0F0] pt-3">
                Square root of average squared differences in USD. Heavily penalizes large outlier errors on luxury or rare high-dollar listings.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] text-[#737373]">
              <span>Formula: √mean((Act - Pred)²)</span>
              <span className="text-[#171717] font-medium">Cell 20</span>
            </div>
          </div>

          {/* Card 3: R² */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                  Coefficient of Determination
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E5E5E5] text-[#737373]">
                  Higher is better
                </span>
              </div>

              <div className="my-2 sm:my-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                    {performanceData?.metrics.r2.value !== null && performanceData?.metrics.r2.value !== undefined
                      ? performanceData.metrics.r2.value.toFixed(3)
                      : 'Pending'}
                  </span>
                  <span className="text-xs text-[#737373]">Score (0–1)</span>
                </div>
                <span className="inline-block mt-1 text-[11px] text-[#737373]">
                  Abbreviation: <strong className="text-[#171717]">R² (Log Scale)</strong>
                </span>
              </div>

              <p className="text-xs text-[#737373] leading-relaxed mt-2 border-t border-[#F0F0F0] pt-3">
                Share of log-price variance explained by features. Notebook note: 1 = perfect fit, 0 = no better than median guess.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] text-[#737373]">
              <span>Formula: r2_score(y_test, y_pred)</span>
              <span className="text-[#171717] font-medium">Cell 20/21</span>
            </div>
          </div>

        </div>

        {/* CHART AND EXPLANATION SIDE BY SIDE ON DESKTOP, STACKED ON MOBILE/TABLET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-8">
          
          {/* Chart Panel (Full width on mobile/tablet, 7-8 cols on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 sm:p-6 shadow-sm w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#F0F0F0]">
              <div>
                <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wide">
                  Actual vs. Predicted Evaluation Plot
                </h2>
                <p className="text-xs text-[#737373]">
                  Comparing actual listed test prices ($) against model predictions ($)
                </p>
              </div>
              
              <button
                onClick={() => setShowDemoScatter(!showDemoScatter)}
                className="inline-flex items-center space-x-1.5 text-xs text-[#737373] hover:text-[#171717] px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] transition-colors self-start sm:self-center"
              >
                <span>{showDemoScatter ? 'Show Pipeline Pending State' : 'Preview Target Chart Layout'}</span>
              </button>
            </div>

            {!showDemoScatter ? (
              /* Unavailable state adhering to prompt rules */
              <div className="py-12 sm:py-16 px-4 text-center bg-[#FAFAFA] rounded-xl border border-dashed border-[#E5E5E5]">
                <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] flex items-center justify-center text-[#737373] mx-auto mb-3">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#171717] mb-1">
                  Evaluation Scatter Plot Unavailable
                </h3>
                <p className="text-xs text-[#737373] max-w-md mx-auto leading-relaxed mb-3">
                  No serialized test evaluation points (<code className="text-[#171717]">y_test</code> vs <code className="text-[#171717]">y_pred</code>) exist in the current notebook repository commit.
                </p>
                <p className="text-[11px] text-[#737373]">
                  In Phase 2, this chart will render the live scikit-learn regression scatter plot upon server model training.
                </p>
              </div>
            ) : (
              /* Simple grayscale Actual vs Predicted scatter plot */
              <div className="space-y-4 w-full">
                <div className="flex flex-wrap items-center justify-between text-xs text-[#737373] gap-2">
                  <span>Reference scatter layout based on Cell 23</span>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#171717] mr-1 inline-block"></span>
                      Test listing
                    </span>
                    <span className="flex items-center">
                      <span className="w-4 h-0.5 bg-[#737373] mr-1 inline-block border-t border-dashed border-[#737373]"></span>
                      Ideal (y = x)
                    </span>
                  </div>
                </div>

                {/* Fluid Minimal SVG Scatter Plot */}
                <div className="bg-[#FAFAFA] p-3 sm:p-5 rounded-xl border border-[#E5E5E5] w-full flex justify-center overflow-hidden">
                  <svg viewBox="0 0 460 260" className="w-full max-w-[560px] h-auto select-none">
                    {/* Axes */}
                    <line x1="50" y1="210" x2="430" y2="210" stroke="#CCCCCC" strokeWidth="1.5" />
                    <line x1="50" y1="20" x2="50" y2="210" stroke="#CCCCCC" strokeWidth="1.5" />

                    {/* Grid Lines */}
                    <line x1="50" y1="160" x2="430" y2="160" stroke="#EBEBEB" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="50" y1="110" x2="430" y2="110" stroke="#EBEBEB" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="50" y1="60" x2="430" y2="60" stroke="#EBEBEB" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="145" y1="20" x2="145" y2="210" stroke="#EBEBEB" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="240" y1="20" x2="240" y2="210" stroke="#EBEBEB" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="335" y1="20" x2="335" y2="210" stroke="#EBEBEB" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Diagonal Ideal Prediction Line (y = x) */}
                    <line x1="50" y1="210" x2="410" y2="30" stroke="#737373" strokeWidth="1.5" strokeDasharray="4 4" />

                    {/* Data Points */}
                    {sampleScatterData.map((pt, i) => {
                      const cx = 50 + (pt.actual / 500) * 360;
                      const cy = 210 - (pt.predicted / 500) * 180;
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="4.5"
                          fill="#171717"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                      );
                    })}

                    {/* Axis Labels */}
                    <text x="240" y="242" textAnchor="middle" fontSize="10" fill="#737373">
                      Actual Listed Price ($)
                    </text>
                    <text
                      x="-115"
                      y="18"
                      transform="rotate(-90)"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#737373"
                    >
                      Predicted Price ($)
                    </text>

                    {/* Tick labels */}
                    <text x="50" y="224" textAnchor="middle" fontSize="9" fill="#737373">$0</text>
                    <text x="145" y="224" textAnchor="middle" fontSize="9" fill="#737373">$125</text>
                    <text x="240" y="224" textAnchor="middle" fontSize="9" fill="#737373">$250</text>
                    <text x="335" y="224" textAnchor="middle" fontSize="9" fill="#737373">$375</text>
                    <text x="430" y="224" textAnchor="middle" fontSize="9" fill="#737373">$500</text>

                    <text x="42" y="213" textAnchor="end" fontSize="9" fill="#737373">$0</text>
                    <text x="42" y="163" textAnchor="end" fontSize="9" fill="#737373">$125</text>
                    <text x="42" y="113" textAnchor="end" fontSize="9" fill="#737373">$250</text>
                    <text x="42" y="63" textAnchor="end" fontSize="9" fill="#737373">$375</text>
                  </svg>
                </div>

                <p className="text-[11px] text-[#737373] text-center">
                  Points close to dashed diagonal line represent accurate predictions with low dollar residual.
                </p>
              </div>
            )}
          </div>

          {/* Explanation Panel (Side by side on desktop, below chart on mobile/tablet) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 sm:p-6 shadow-sm w-full space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#F0F0F0]">
              <Info className="w-4 h-4 text-[#171717]" />
              <h3 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wide">
                Evaluation Interpretation
              </h3>
            </div>

            <div className="space-y-3 text-xs text-[#737373] leading-relaxed">
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3">
                <span className="font-semibold text-[#171717] block mb-1">Diagonal Proximity</span>
                <p>
                  Listings positioned along the 45-degree dashed diagonal indicate high accuracy. Deviations above the line represent under-estimations; deviations below represent over-estimations.
                </p>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3">
                <span className="font-semibold text-[#171717] block mb-1">Tail Heteroskedasticity</span>
                <p>
                  In real-world Airbnb pricing, error variance increases on luxury properties ($400+) due to bespoke decor, views, and seasonal host pricing variations.
                </p>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3">
                <span className="font-semibold text-[#171717] block mb-1">Baseline Comparison</span>
                <p>
                  The reviewed boosting pipeline captures nonlinear relationships across geographical, property, host, and amenity features.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* DATASET & MODEL DETAILS */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-5 sm:p-6 shadow-sm w-full">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
            <Layers className="w-4 h-4 text-[#171717]" />
            <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wider">
              Model Training Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3">
              <span className="text-[#737373] block text-[11px] mb-0.5">Dataset</span>
              <span className="font-semibold text-[#171717]">Kaggle train.csv</span>
            </div>
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3">
              <span className="text-[#737373] block text-[11px] mb-0.5">Target Transformation</span>
              <span className="font-semibold text-[#171717]">price = exp(log_price)</span>
            </div>
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3">
              <span className="text-[#737373] block text-[11px] mb-0.5">Validation Split</span>
              <span className="font-semibold text-[#171717]">80% Train, 20% Test</span>
            </div>
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3">
              <span className="text-[#737373] block text-[11px] mb-0.5">Pipeline</span>
              <span className="font-semibold text-[#171717]">ColumnTransformer</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
