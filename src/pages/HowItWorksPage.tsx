import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Filter,
  Sliders,
  Split,
  Cpu,
  BarChart2,
  DollarSign,
  ArrowRight,
  Code
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Dataset',
      subtitle: 'Kaggle Airbnb Price Prediction',
      icon: Database,
      description:
        'Raw dataset consisting of historical Airbnb listings across major US cities (NYC, LA, SF, DC, Chicago, Boston). Target variable is log_price (the natural log of the nightly listing price in USD) to adjust for right-skewed price distribution.',
      details: [
        'Kaggle train.csv dataset',
        'Target: log_price = ln(nightly_price)',
        'Covers 6 major urban markets',
      ],
      codeSnippet: 'df = pd.read_csv("train.csv")\ny = df["log_price"]',
    },
    {
      step: '02',
      title: 'Data Cleaning',
      subtitle: 'Quality Audits & Deduplication',
      icon: Filter,
      description:
        'Checks for duplicate rows and removes listings with invalid target values (log_price <= 0 equates to $1/night, which are erroneous outliers). Handles missing values in categorical and numerical fields.',
      details: [
        'Drop duplicates by listing ID',
        'Filter out log_price <= 0',
        'Add real dollar column: price = np.exp(log_price)',
      ],
      codeSnippet: 'df_clean = df.drop_duplicates(subset=["id"]).dropna(subset=["log_price"])\ndf_clean = df_clean[df_clean["log_price"] > 0]',
    },
    {
      step: '03',
      title: 'Feature Engineering',
      subtitle: 'Amenity Extraction & Type Casting',
      icon: Sliders,
      description:
        'Transforms raw text fields into structured modeling features. Extracts individual amenity flags (Wi-Fi, Kitchen, AC, TV, Parking, etc.) from raw JSON/string text into clean binary 0/1 indicators. Standardizes boolean flags.',
      details: [
        '13 high-signal amenity binary indicators',
        'Binary conversion of cleaning_fee and instant_bookable',
        'Missing neighbourhoods filled with "Unknown"',
      ],
      codeSnippet: 'for amenity in AMENITIES_TO_EXTRACT:\n    df_clean[f"has_{amenity}"] = df_clean["amenities"].str.contains(amenity).astype(int)',
    },
    {
      step: '04',
      title: 'Train / Test Split',
      subtitle: '80% Train, 20% Unseen Test Set',
      icon: Split,
      description:
        'Splits data into 80% training data and 20% held-out listings for an unbiased final benchmark.',
      details: [
        'train_test_split(X, y, test_size=0.20, random_state=42)',
        'Unseen test evaluation simulates real host usage',
        'Prevents overfitting',
      ],
      codeSnippet: 'X_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.20, random_state=42\n)',
    },
    {
      step: '05',
      title: 'HistGradientBoosting Pipeline',
      subtitle: 'ColumnTransformer & Feature Scaling',
      icon: Cpu,
      description:
        'Chains scikit-learn preprocessing with HistGradientBoostingRegressor. Categorical variables are one-hot encoded, while numerical values are imputed and scaled.',
      details: [
        'ColumnTransformer handles mixed feature types',
        'OneHotEncoder for categorical features',
        'Tuned nonlinear estimator for feature interactions',
      ],
      codeSnippet: 'model = Pipeline([\n    ("preprocessor", preprocessor),\n    ("regressor", HistGradientBoostingRegressor(...))\n])',
    },
    {
      step: '06',
      title: 'Model Evaluation',
      subtitle: 'Dollar-Scale Scoring on Test Data',
      icon: BarChart2,
      description:
        'Evaluates model error by exponentiating predictions back to real USD currency: actuals = np.exp(y_test) and preds = np.exp(model.predict(X_test)). Assesses MAE (average dollar error), RMSE, and R² score.',
      details: [
        'MAE measured in real USD ($)',
        'R² measured on log-scale optimization',
        'Benchmark against dummy median baseline',
      ],
      codeSnippet: 'preds = np.exp(model.predict(X_test))\nactuals = np.exp(y_test)\nmae = mean_absolute_error(actuals, preds)',
    },
    {
      step: '07',
      title: 'Price Prediction',
      subtitle: 'Real-Time Nightly Rate Estimation',
      icon: DollarSign,
      description:
        'The trained pipeline is deployed to serve user inputs. The application receives property specifications, builds a single-row feature table matching training schema, and delivers an instant nightly dollar recommendation.',
      details: [
        'predict_price() takes host inputs',
        'Validates ranges (e.g. accommodates 1-16)',
        'Returns exp(log_price) in USD',
      ],
      codeSnippet: 'def predict_price(city, property_type, accommodates, ...):\n    new_listing = pd.DataFrame([row], columns=ALL_FEATURES)\n    return float(np.exp(final_model.predict(new_listing)[0]))',
    },
  ];

  return (
    <div className="w-full py-6 sm:py-10 md:py-14">
      <div className="page-container">
        
        {/* HEADER */}
        <div className="mb-8 sm:mb-12 text-left">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[11px] font-medium text-[#737373] mb-2">
            <span>Machine Learning Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">
            How StayWise AI Works
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-3xl">
            A step-by-step walkthrough of the data preparation, feature engineering, and scikit-learn regression pipeline powering every price estimation.
          </p>
        </div>

        {/* WORKFLOW TIMELINE */}
        <div className="relative w-full">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 sm:left-6 top-8 bottom-8 w-0.5 bg-[#E5E5E5]" />

          <div className="space-y-6 sm:space-y-8">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative pl-11 sm:pl-16">
                  {/* Step Icon Badge */}
                  <div className="absolute left-0 top-1 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] flex items-center justify-center text-[#171717] z-10 shadow-sm">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Step Card */}
                  <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#F0F0F0]">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#171717]">
                            {step.title}
                          </h3>
                          <span className="text-[10px] font-semibold text-[#737373] uppercase tracking-wider bg-[#FAFAFA] px-2 py-0.5 rounded border border-[#E5E5E5]">
                            Step {step.step}
                          </span>
                        </div>
                        <span className="text-xs text-[#737373]">{step.subtitle}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Key Details Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                      {step.details.map((detail, dIdx) => (
                        <div
                          key={dIdx}
                          className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-2.5 text-[11px] sm:text-xs text-[#171717]"
                        >
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {/* Code Reference Snippet */}
                    <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3 w-full overflow-hidden">
                      <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-[#737373] mb-1.5">
                        <Code className="w-3 h-3 text-[#171717] flex-shrink-0" />
                        <span>Notebook Implementation</span>
                      </div>
                      <pre className="text-[11px] font-mono text-[#171717] overflow-x-auto whitespace-pre p-1">
                        {step.codeSnippet}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-10 sm:mt-14 bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-[#171717]">
              Test the pipeline with your property details
            </h4>
            <p className="text-xs sm:text-sm text-[#737373]">
              Input location, room count, and amenities to run a real-time estimation.
            </p>
          </div>
          <Link
            to="/predict"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-[#333333] hover:bg-[#1f1f1f] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            <span>Try Price Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
