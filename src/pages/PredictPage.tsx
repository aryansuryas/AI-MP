import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CITIES,
  NEIGHBOURHOODS_BY_CITY,
  PROPERTY_TYPES,
  ROOM_TYPES,
  BED_TYPES,
  CANCELLATION_POLICIES,
  AMENITIES_LIST,
  DEFAULT_FORM_VALUES
} from '../data/datasetInfo';
import type { PredictionRequest } from '../types';
import { predictPrice } from '../services/api';
import { usePrediction } from '../context';
import {
  RotateCcw,
  Sparkles,
  MapPin,
  Home,
  CalendarCheck,
  CheckSquare,
  AlertCircle,
  Wifi,
  Utensils,
  Wind,
  Flame,
  Tv,
  Shirt,
  Sun,
  Car,
  Waves,
  Dumbbell,
  Bath,
  UserCheck,
  Coffee
} from 'lucide-react';

export const PredictPage: React.FC = () => {
  const navigate = useNavigate();
  const { savePrediction, request: existingRequest } = usePrediction();

  // Initialize form state with previous request if present, or defaults
  const [formData, setFormData] = useState<PredictionRequest>(() => {
    if (existingRequest) {
      return existingRequest;
    }
    return DEFAULT_FORM_VALUES;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Available neighbourhoods for the currently selected city
  const availableNeighbourhoods = NEIGHBOURHOODS_BY_CITY[formData.city] || ['Unknown'];

  // Keep neighbourhood synced when city changes if previous was not in new city
  const handleCityChange = (newCity: string) => {
    const cityNeighbourhoods = NEIGHBOURHOODS_BY_CITY[newCity] || ['Unknown'];
    setFormData((prev) => ({
      ...prev,
      city: newCity,
      neighbourhood: cityNeighbourhoods[0] || 'Unknown',
    }));
  };

  const handleInputChange = (field: keyof PredictionRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenityId);
      const nextAmenities = exists
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities: nextAmenities };
    });
  };

  const selectAllAmenities = () => {
    setFormData((prev) => ({
      ...prev,
      amenities: AMENITIES_LIST.map((a) => a.id),
    }));
  };

  const clearAllAmenities = () => {
    setFormData((prev) => ({
      ...prev,
      amenities: [],
    }));
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_VALUES);
    setErrors({});
    setApiError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.city) {
      newErrors.city = 'Please select a valid city';
    }
    if (formData.accommodates < 1 || formData.accommodates > 16) {
      newErrors.accommodates = 'Accommodates must be between 1 and 16 guests';
    }
    if (formData.bathrooms < 0 || formData.bathrooms > 8) {
      newErrors.bathrooms = 'Bathrooms must be between 0 and 8';
    }
    if (formData.bedrooms < 0 || formData.bedrooms > 10) {
      newErrors.bedrooms = 'Bedrooms must be between 0 and 10';
    }
    if (formData.beds < 0 || formData.beds > 18) {
      newErrors.beds = 'Beds must be between 0 and 18';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await predictPrice(formData);
      savePrediction(response, formData);
      navigate('/results');
    } catch (err: any) {
      setApiError(err?.message || 'Failed to calculate price estimation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icon mapping for amenities
  const renderAmenityIcon = (iconName?: string) => {
    const props = { className: 'w-4 h-4' };
    switch (iconName) {
      case 'Wifi': return <Wifi {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Shirt': return <Shirt {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Bath': return <Bath {...props} />;
      case 'UserCheck': return <UserCheck {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      default: return <CheckSquare {...props} />;
    }
  };

  return (
    <div className="w-full py-6 sm:py-10 md:py-14">
      <div className="page-container">
        
        {/* PAGE HEADER */}
        <div className="mb-6 sm:mb-8 text-left">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[11px] font-medium text-[#737373] mb-2">
            <span>Machine Learning Inference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">
            Predict Airbnb Nightly Price
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-2xl">
            Specify your property parameters below. The regression pipeline computes your rate using trained historical weights.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] flex items-start space-x-3 text-xs text-[#171717]">
            <AlertCircle className="w-4 h-4 mt-0.5 text-[#171717] flex-shrink-0" />
            <div>
              <p className="font-semibold">Calculation Notice</p>
              <p className="text-[#737373] mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          {/* SECTION 1: LOCATION */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
              <MapPin className="w-4 h-4 text-[#171717]" />
              <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wide">
                Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  City <span className="text-[#737373]">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-[11px] text-[#171717] mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Neighbourhood
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="neighbourhood-options"
                    value={formData.neighbourhood}
                    onChange={(e) => handleInputChange('neighbourhood', e.target.value)}
                    placeholder="e.g. Hell's Kitchen, Downtown, or Unknown"
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                  />
                  <datalist id="neighbourhood-options">
                    {availableNeighbourhoods.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                </div>
                <p className="text-[10px] text-[#737373] mt-1">
                  Supported in {formData.city}: {availableNeighbourhoods.slice(0, 4).join(', ')}...
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: PROPERTY DETAILS */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
              <Home className="w-4 h-4 text-[#171717]" />
              <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wide">
                Property Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">
              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Property Type
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) => handleInputChange('property_type', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Room Type
                </label>
                <select
                  value={formData.room_type}
                  onChange={(e) => handleInputChange('room_type', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {rt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Bed Type
                </label>
                <select
                  value={formData.bed_type}
                  onChange={(e) => handleInputChange('bed_type', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  {BED_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Numeric Accommodations / Rooms */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-2 border-t border-[#F0F0F0]">
              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Accommodates
                </label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={formData.accommodates}
                  onChange={(e) => handleInputChange('accommodates', parseInt(e.target.value) || 1)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                />
                <span className="text-[10px] text-[#737373]">1 to 16 guests</span>
                {errors.accommodates && (
                  <p className="text-[11px] text-[#171717] mt-0.5">{errors.accommodates}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                />
                <span className="text-[10px] text-[#737373]">0 to 10 rooms</span>
                {errors.bedrooms && (
                  <p className="text-[11px] text-[#171717] mt-0.5">{errors.bedrooms}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                />
                <span className="text-[10px] text-[#737373]">0 to 8 baths</span>
                {errors.bathrooms && (
                  <p className="text-[11px] text-[#171717] mt-0.5">{errors.bathrooms}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Beds
                </label>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={formData.beds}
                  onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                />
                <span className="text-[10px] text-[#737373]">0 to 18 beds</span>
                {errors.beds && <p className="text-[11px] text-[#171717] mt-0.5">{errors.beds}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 3: BOOKING DETAILS */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#F0F0F0]">
              <CalendarCheck className="w-4 h-4 text-[#171717]" />
              <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wide">
                Booking Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Cancellation Policy
                </label>
                <select
                  value={formData.cancellation_policy}
                  onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  {CANCELLATION_POLICIES.map((cp) => (
                    <option key={cp.value} value={cp.value}>
                      {cp.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cleaning Fee Toggle */}
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3 sm:p-3.5 flex items-center">
                <label className="flex items-center justify-between cursor-pointer w-full">
                  <div>
                    <span className="text-xs font-medium text-[#171717] block">Cleaning Fee</span>
                    <span className="text-[10px] text-[#737373]">Host charges fee</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.cleaning_fee}
                    onChange={(e) => handleInputChange('cleaning_fee', e.target.checked)}
                    className="w-4 h-4 rounded text-[#333333] accent-[#333333] border-[#E5E5E5] focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Instant Bookable Toggle */}
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3 sm:p-3.5 flex items-center">
                <label className="flex items-center justify-between cursor-pointer w-full">
                  <div>
                    <span className="text-xs font-medium text-[#171717] block">Instant Bookable</span>
                    <span className="text-[10px] text-[#737373]">No prior host approval</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.instant_bookable}
                    onChange={(e) => handleInputChange('instant_bookable', e.target.checked)}
                    className="w-4 h-4 rounded text-[#333333] accent-[#333333] border-[#E5E5E5] focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 4: AMENITIES */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between pb-3 mb-4 border-b border-[#F0F0F0] gap-2">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-[#171717]" />
                <h2 className="text-xs sm:text-sm font-semibold text-[#171717] uppercase tracking-wide">
                  Amenities
                </h2>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <button
                  type="button"
                  onClick={selectAllAmenities}
                  className="text-[#737373] hover:text-[#171717] transition-colors"
                >
                  Select All
                </button>
                <span className="text-[#E5E5E5]">|</span>
                <button
                  type="button"
                  onClick={clearAllAmenities}
                  className="text-[#737373] hover:text-[#171717] transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center space-x-2 p-2 sm:p-2.5 rounded-lg border text-left transition-all text-xs ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-[#FAFAFA] text-[#171717] border-[#E5E5E5] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className={isSelected ? 'text-white' : 'text-[#737373]'}>
                      {renderAmenityIcon(amenity.iconName)}
                    </div>
                    <span className="font-medium truncate">{amenity.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#737373] mt-3">
              Selected: {formData.amenities.length} of {AMENITIES_LIST.length} amenities
            </p>
          </div>

          {/* ACTION BUTTONS & RESET */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F9F9F9] text-xs font-medium text-[#737373] hover:text-[#171717] transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#333333] hover:bg-[#1f1f1f] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Estimating Rate...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate Estimated Price</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
