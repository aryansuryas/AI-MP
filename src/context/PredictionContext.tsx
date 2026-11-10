import { createContext } from 'react';
import type { PredictionRequest, PredictionResponse } from '../types';

export interface PredictionContextType {
  prediction: PredictionResponse | null;
  request: PredictionRequest | null;
  savePrediction: (response: PredictionResponse, request: PredictionRequest) => void;
  clearPrediction: () => void;
}

export const PredictionContext = createContext<PredictionContextType | undefined>(undefined);
