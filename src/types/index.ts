export interface AmenityOption {
  id: string;
  label: string;
  featureKey: string;
  iconName?: string;
}

export interface PredictionRequest {
  city: string;
  neighbourhood: string;
  property_type: string;
  room_type: string;
  bed_type: string;
  accommodates: number;
  bathrooms: number;
  bedrooms: number;
  beds: number;
  cleaning_fee: boolean;
  instant_bookable: boolean;
  cancellation_policy: string;
  amenities: string[];
}

export interface PredictionResponse {
  estimated_price: number;
  currency: string;
  model_name: string;
  timestamp: string;
  property_summary: {
    city: string;
    neighbourhood: string;
    property_type: string;
    room_type: string;
    bed_type: string;
    accommodates: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
    cancellation_policy: string;
    cleaning_fee: boolean;
    instant_bookable: boolean;
  };
  amenities: string[];
  notes?: string;
  price_range?: {
    low: number;
    high: number;
  };
}

export interface ModelMetric {
  name: string;
  abbreviation: string;
  value: number | null;
  unit: string;
  status: 'available' | 'unavailable' | 'pending';
  description: string;
  formula: string;
  betterDirection: 'lower' | 'higher';
}

export interface ModelPerformanceData {
  status: 'available' | 'unavailable_in_notebook';
  model_name: string;
  dataset: {
    name: string;
    source: string;
    target_column: string;
    target_transformation: string;
    training_split: string;
  };
  metrics: {
    mae: ModelMetric;
    rmse: ModelMetric;
    r2: ModelMetric;
  };
  pipeline_steps: string[];
  actual_vs_predicted_data?: Array<{ actual: number; predicted: number; id: number }>;
}

