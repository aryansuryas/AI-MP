import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrediction } from '../context';
import { AMENITIES_LIST } from '../data/datasetInfo';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Calendar,
  Layers,
  MapPin,
  Home,
  CheckSquare,
  Sparkles,
  Info
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { prediction } = usePrediction();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // If user navigates directly to /results without predicting
  if (!prediction) {
    return (
      <div className="w-full py-16 sm:py-24">
        <div className="page-container">
          <div className="max-w-md mx-auto text-center bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center text-[#737373] mx-auto mb-4">
              <Info className="w-6 h-6 text-[#171717]" />
            </div>
            <h1 className="text-xl font-bold text-[#171717] mb-2">No Prediction Data Found</h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
              You haven't calculated a property estimate yet. Fill in your listing specifications to generate a data-backed nightly price.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Link
                to="/predict"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-[#171717] hover:bg-[#333333] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Predict Property Price</span>
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F9F9F9] text-xs font-medium text-[#737373] hover:text-[#171717]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { estimated_price, currency, model_name, timestamp, property_summary, amenities, price_range } = prediction;

  const formattedDate = new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const getAmenityLabel = (id: string) => {
    const found = AMENITIES_LIST.find((a) => a.id === id);
    return found ? found.label : id;
  };

  const handlePredictAnother = () => {
    navigate('/predict');
  };

  return (
    <div className="w-full py-6 sm:py-10 md:py-12">
      <div className="page-container">
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 pb-4 border-b border-[#E5E5E5]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-semibold text-[#171717] shadow-xs">
              <CheckCircle className="w-3.5 h-3.5 text-[#171717] mr-1.5 flex-shrink-0" />
              Estimation Complete
            </span>
            <span className="hidden xs:inline">•</span>
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#737373] flex-shrink-0" />
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={handlePredictAnother}
              className="inline-flex items-center space-x-1.5 text-[#737373] hover:text-[#171717] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Predict Another</span>
            </button>
            <span className="text-[#E5E5E5]">|</span>
            <Link
              to="/"
              className="inline-flex items-center space-x-1 text-[#737373] hover:text-[#171717] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* HERO BANNER FOR THE ESTIMATED PRICE */}
        <div className="bg-[#FFFFFF] border-2 border-[#171717] rounded-3xl p-6 sm:p-10 shadow-lg mb-8 text-center sm:text-left relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-semibold text-[#525252] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#171717]" />
                <span>Estimated Nightly Price</span>
              </div>
              
              <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-2 pt-2">
                <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#171717] tracking-tight">
                  ${estimated_price.toLocaleString()}
                </span>
                <span className="text-base sm:text-lg font-medium text-[#737373]">
                  per night ({currency})
                </span>
              </div>

              {price_range && (
                <p className="text-sm text-[#737373] pt-1">
                  Expected standard market range:{' '}
                  <strong className="text-[#171717] font-bold">
                    ${price_range.low} – ${price_range.high}
                  </strong>
                </p>
              )}
            </div>

            <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center border-t md:border-t-0 md:border-l border-[#F0F0F0] pt-4 md:pt-0 md:pl-6 space-y-3">
              <button
                onClick={handlePredictAnother}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#171717] hover:bg-[#333333] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Predict Another Property</span>
              </button>
              <span className="text-[11px] text-[#737373]">
                {model_name}
              </span>
            </div>

          </div>
        </div>

        {/* SIDE BY SIDE ON DESKTOP / STACKED ON MOBILE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-8">
          
          {/* LEFT: AMENITIES & MODEL DETAILS */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Selected Amenities in Prediction Column */}
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
                <CheckSquare className="w-4 h-4 text-[#171717]" />
                <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
                  Included Amenities ({amenities.length})
                </h3>
              </div>

              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenityId) => (
                    <span
                      key={amenityId}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] font-medium"
                    >
                      <CheckCircle className="w-3 h-3 text-[#171717] mr-1.5 flex-shrink-0" />
                      <span>{getAmenityLabel(amenityId)}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#737373] italic">
                  No specific amenities selected.
                </p>
              )}
            </div>

            {/* Model Architecture Info */}
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-[#F0F0F0]">
                <Layers className="w-4 h-4 text-[#171717]" />
                <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
                  Model Information
                </h3>
              </div>
              <p className="text-xs font-semibold text-[#171717] leading-snug">
                {model_name}
              </p>
              <p className="text-[11px] text-[#737373] mt-2 leading-relaxed">
                Log-linear formulation with exponential transform (<code className="text-[#171717]">price = exp(log_price)</code>).
              </p>
            </div>

          </div>

          {/* RIGHT: PROPERTY SUMMARY CARD */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 mb-5 border-b border-[#F0F0F0]">
              <Home className="w-4 h-4 text-[#171717]" />
              <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wider">
                Property Summary Specification
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-6 text-xs sm:text-sm">
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5">
                <span className="text-[#737373] block text-[11px] mb-0.5">Location</span>
                <span className="font-semibold text-[#171717] flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#737373] flex-shrink-0" />
                  {property_summary.neighbourhood}, {property_summary.city}
                </span>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5">
                <span className="text-[#737373] block text-[11px] mb-0.5">Listing Category</span>
                <span className="font-semibold text-[#171717] block">
                  {property_summary.property_type}
                </span>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5">
                <span className="text-[#737373] block text-[11px] mb-0.5">Room Arrangement</span>
                <span className="font-semibold text-[#171717] block">
                  {property_summary.room_type}
                </span>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5">
                <span className="text-[#737373] block text-[11px] mb-0.5">Bed Specification</span>
                <span className="font-semibold text-[#171717] block">
                  {property_summary.bed_type} ({property_summary.beds} {property_summary.beds === 1 ? 'bed' : 'beds'})
                </span>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5 sm:col-span-2">
                <span className="text-[#737373] block text-[11px] mb-0.5">Dimensions & Capacity</span>
                <span className="font-semibold text-[#171717] block">
                  {property_summary.accommodates} {property_summary.accommodates === 1 ? 'Guest' : 'Guests'} • {property_summary.bedrooms} {property_summary.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'} • {property_summary.bathrooms} {property_summary.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </span>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5">
                <span className="text-[#737373] block text-[11px] mb-0.5">Cancellation Policy</span>
                <span className="font-semibold text-[#171717] block capitalize">
                  {property_summary.cancellation_policy.replace('_', ' ')}
                </span>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5">
                <span className="text-[#737373] block text-[11px] mb-0.5">Cleaning Fee</span>
                <span className="font-semibold text-[#171717] block">
                  {property_summary.cleaning_fee ? 'Included in rate' : 'No cleaning fee'}
                </span>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 sm:p-3.5 sm:col-span-2">
                <span className="text-[#737373] block text-[11px] mb-0.5">Booking Mode</span>
                <span className="font-semibold text-[#171717] block">
                  {property_summary.instant_bookable ? 'Instant Book enabled (Guest can book immediately)' : 'Host approval required prior to reservation'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0F0F0] text-xs text-[#737373] leading-relaxed">
              These characteristics directly mapped to the regression model matrix to yield your target estimate.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
