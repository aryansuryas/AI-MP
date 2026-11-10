import { useContext } from 'react';
import { PredictionContext } from './PredictionContext';
import type { PredictionContextType } from './PredictionContext';

export const usePrediction = (): PredictionContextType => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};

