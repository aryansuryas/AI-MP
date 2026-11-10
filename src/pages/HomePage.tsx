import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HouseIllustration } from '../components/HouseIllustration';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center py-2 sm:py-4 overflow-hidden">
      <div className="page-container w-full my-auto">
        
        {/* HERO SECTION - Centered and fitted to viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-xs font-semibold text-[#737373] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#171717]"></span>
              <span>Machine Learning Rental Valuation</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.14]">
              Know the Right Price Before You Host.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#525252] leading-relaxed max-w-xl font-serif">
              An intelligent Airbnb pricing assistant that estimates nightly rental prices using property characteristics and machine learning.
            </p>

            {/* Single Prominently Highlighted Main CTA Button */}
            <div className="pt-1 sm:pt-2">
              <Link
                to="/predict"
                className="group inline-flex items-center justify-center space-x-3 bg-[#171717] hover:bg-[#000000] text-white text-base sm:text-lg font-bold px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 ring-4 ring-[#171717]/10"
              >
                <span>Predict My Property Price</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            </div>

            {/* Verification points */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#737373]">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
                <span>6 Major US Markets</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
                <span>13 Key Amenity Factors</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
                <span>Log-Price Regression</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Monochrome House Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <div className="w-full max-w-[480px] lg:max-w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm flex items-center justify-center">
              <HouseIllustration className="w-full max-h-[320px] sm:max-h-[360px] lg:max-h-[400px] h-auto object-contain" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
