import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { PredictionRequest, PredictionResponse } from '../types';
import { PredictionContext } from './PredictionContext';

const STORAGE_KEY_PREDICTION = 'staywise_prediction_result';
const STORAGE_KEY_REQUEST = 'staywise_prediction_request';

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_PREDICTION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [request, setRequest] = useState<PredictionRequest | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_REQUEST);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (prediction) {
        sessionStorage.setItem(STORAGE_KEY_PREDICTION, JSON.stringify(prediction));
      } else {
        sessionStorage.removeItem(STORAGE_KEY_PREDICTION);
      }
    } catch {
      // ignore storage errors
    }
  }, [prediction]);

  useEffect(() => {
    try {
      if (request) {
        sessionStorage.setItem(STORAGE_KEY_REQUEST, JSON.stringify(request));
      } else {
        sessionStorage.removeItem(STORAGE_KEY_REQUEST);
      }
    } catch {
      // ignore storage errors
    }
  }, [request]);

  const savePrediction = (newResponse: PredictionResponse, newRequest: PredictionRequest) => {
    setPrediction(newResponse);
    setRequest(newRequest);
  };

  const clearPrediction = () => {
    setPrediction(null);
    setRequest(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY_PREDICTION);
      sessionStorage.removeItem(STORAGE_KEY_REQUEST);
    } catch {
      // ignore
    }
  };

  return (
    <PredictionContext.Provider value={{ prediction, request, savePrediction, clearPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
};

