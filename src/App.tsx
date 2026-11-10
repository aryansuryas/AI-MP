import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PredictionProvider } from './context';
import { Navbar, Footer, ScrollToTop } from './components';
import {
  HomePage,
  PredictPage,
  ResultsPage,
  HowItWorksPage,
  ModelPerformancePage,
  AboutModelPage,
} from './pages';

export function App() {
  return (
    <PredictionProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#171717]">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/predict" element={<PredictPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/model-performance" element={<ModelPerformancePage />} />
              <Route path="/about-model" element={<AboutModelPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </PredictionProvider>
  );
}

export default App;
