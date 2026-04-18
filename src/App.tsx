import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import NewProjectPage from './pages/NewProjectPage';
import Step1Page from './pages/steps/Step1Page';
import Step2Page from './pages/steps/Step2Page';
import Step3Page from './pages/steps/Step3Page';
import Step4Page from './pages/steps/Step4Page';
import Step5Page from './pages/steps/Step5Page';
import Step6Page from './pages/steps/Step6Page';

const STEP_PAGES = [Step1Page, Step2Page, Step3Page, Step4Page, Step5Page, Step6Page];

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects/new" element={<NewProjectPage />} />
            {STEP_PAGES.map((StepPage, i) => (
              <Route key={i + 1} path={`/projects/:projectId/steps/${i + 1}`} element={<StepPage />} />
            ))}
            <Route path="/projects/:projectId" element={<Navigate to="steps/1" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
