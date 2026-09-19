import React, { useState } from 'react';
import { ShieldCheck, Search, Award, RotateCcw, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { detectionScenarios } from '../data/detectionScenarios';
import { ScenarioCard } from '../components/ScenarioCard';
import { ProgressBar } from '../components/ProgressBar';
import { ResultCard } from '../components/ResultCard';
import { ParticipantStartGate } from '../components/ParticipantStartGate';
import { ScenarioVerdict } from '../types';
import { Link } from 'react-router-dom';
import { recordScenarioAnalyzed } from '../utils/storage';

export const Detect: React.FC = () => {
  const [participant, setParticipant] = useState<{ name: string; email: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userVerdicts, setUserVerdicts] = useState<Record<string, ScenarioVerdict>>({});
  const [completed, setCompleted] = useState(false);

  const total = detectionScenarios.length;
  const currentScenario = detectionScenarios[currentIndex];

  const handleSelectVerdict = (verdict: ScenarioVerdict) => {
    // Record real scenario analyzed count if not previously answered in this session
    if (!userVerdicts[currentScenario.id]) {
      recordScenarioAnalyzed();
    }
    setUserVerdicts((prev) => ({
      ...prev,
      [currentScenario.id]: verdict,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setUserVerdicts({});
    setCurrentIndex(0);
    setCompleted(false);
    setParticipant(null);
  };

  // Calculate score
  const correctCount = detectionScenarios.reduce((acc, scenario) => {
    return userVerdicts[scenario.id] === scenario.correctVerdict ? acc + 1 : acc;
  }, 0);

  const answeredCount = Object.keys(userVerdicts).length;

  return (
    <div className="relative z-10 py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {!participant ? (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
                  <Search className="h-3.5 w-3.5" />
                  <span>Interactive Threat Simulator</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Phishing & Scam Detector
                </h1>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Examine authentic-looking digital communications. Analyze the sender, URL domains, urgent language, and hidden tricks to classify them as <strong>Safe</strong>, <strong>Suspicious</strong>, or <strong>Scam</strong>.
                </p>
              </div>

              <Link
                to="/results"
                className="inline-flex items-center gap-1.5 self-start shrink-0 rounded-xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <span>Check My Past Results</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <ParticipantStartGate
              title="Enter Details to Begin Threat Simulator"
              subtitle="Every participant must enter their full name and email address before starting. Each email can only be used once to complete the detection simulator."
              badgeText="7 Realistic Threat Scenarios"
              assessmentType="detection"
              buttonLabel="Verify & Start Simulation"
              estimatedTime="6-8 minutes"
              onProceed={(p) => setParticipant(p)}
            />
          </div>
        ) : !completed ? (
          <div>
            {/* Participant Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-cyan-300">
                <User className="h-3.5 w-3.5" />
                <span>Participant: <strong className="text-white">{participant.name}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{participant.email}</span>
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className="text-xs text-slate-400 hover:text-rose-300 transition-colors self-start sm:self-auto flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Switch Participant</span>
              </button>
            </div>

            {/* Progress Bar & Quick Stats */}
            <div className="mb-6 rounded-xl border border-slate-800 bg-[#081220] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:max-w-xs">
                <ProgressBar
                  current={currentIndex + 1}
                  total={total}
                  label="Scenario Progress"
                />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-slate-400">
                  Identified:{' '}
                  <strong className="text-cyan-300">
                    {correctCount} / {answeredCount} correct
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Scenario Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
              {detectionScenarios.map((sc, idx) => {
                const isSelected = idx === currentIndex;
                const userChoice = userVerdicts[sc.id];
                const isDone = Boolean(userChoice);

                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-[#050B14] font-bold shadow-md shadow-cyan-950'
                        : isDone
                        ? 'bg-slate-800/80 text-cyan-300 border border-cyan-900/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>Case {idx + 1}</span>
                    {isDone && <CheckCircle2 className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>

            {/* Active Scenario Card */}
            <ScenarioCard
              scenario={currentScenario}
              index={currentIndex}
              total={total}
              userVerdict={userVerdicts[currentScenario.id]}
              onSelectVerdict={handleSelectVerdict}
              onNext={handleNext}
              isLast={currentIndex === total - 1}
            />
          </div>
        ) : (
          /* Final Results Screen with Participant pre-filled and automatically saved */
          <ResultCard
            type="detection"
            score={correctCount}
            total={total}
            participant={participant}
            onRestart={handleRestart}
            questionsSummary={detectionScenarios.map((sc) => ({
              questionText: `${sc.title} (${sc.channel})`,
              isCorrect: userVerdicts[sc.id] === sc.correctVerdict,
              explanation: sc.explanation,
            }))}
          />
        )}

        {/* Interconnected Link */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            Want to test broad cybersecurity theory?{' '}
            <Link to="/quiz" className="text-cyan-400 hover:underline font-semibold">
              Take the 10-Question Awareness Quiz →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
