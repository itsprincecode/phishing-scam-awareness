import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ThreeBackground } from './components/ThreeBackground';
import { CinematicLoader } from './components/CinematicLoader';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { LearnTopic } from './pages/LearnTopic';
import { Detect } from './pages/Detect';
import { Quiz } from './pages/Quiz';
import { Safety } from './pages/Safety';
import { About } from './pages/About';
import { ParticipantResults } from './pages/ParticipantResults';
import { Responses } from './pages/Responses';

// Helper component to scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Cinematic intro loading animation (website name only, no icons) */}
      <CinematicLoader />
      <div className="relative min-h-screen bg-[#080C07] text-neutral-100 flex flex-col font-sans selection:bg-[#B4F437]/30 selection:text-white">
        {/* ================================================================= */}
        {/* THREEUI BACKGROUND CONTAINER                                      */}
        {/* Preserved dedicated shader layer for raw WebGL LaserCollection    */}
        {/* ================================================================= */}
        <ThreeBackground />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Content Viewport */}
        <main className="flex-1 w-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:topicId" element={<LearnTopic />} />
            <Route path="/detect" element={<Detect />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/responses" element={<Responses />} />
            <Route path="/form-responses" element={<Responses />} />
            <Route path="/about" element={<About />} />
            <Route path="/results" element={<ParticipantResults />} />
            <Route path="/participant-results" element={<ParticipantResults />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
