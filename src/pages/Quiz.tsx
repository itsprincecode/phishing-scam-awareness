import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  User
} from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';
import { QuizQuestion } from '../components/QuizQuestion';
import { ProgressBar } from '../components/ProgressBar';
import { ResultCard } from '../components/ResultCard';
import { ParticipantStartGate } from '../components/ParticipantStartGate';
import { Link } from 'react-router-dom';

export const Quiz: React.FC = () => {
  const [participant, setParticipant] = useState<{ name: string; email: string } | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const total = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIdx];
  const userSelection = selectedAnswers[currentIdx] ?? null;
  const isExplanationShown = revealedExplanations[currentIdx] ?? false;

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIndex,
    }));
    // Auto show explanation after selection
    setRevealedExplanations((prev) => ({
      ...prev,
      [currentIdx]: true,
    }));
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setRevealedExplanations({});
    setCurrentIdx(0);
    setIsCompleted(false);
    setParticipant(null);
  };

  // Calculate final score
  const correctCount = quizQuestions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="relative z-10 py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* If participant has not entered name & email, show start gate */}
        {!participant ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-md border border-[#B4F437]/30 bg-[#162013] px-3 py-1 text-xs font-bold text-[#B4F437] mb-3">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Interactive Assessment</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Cyber Awareness Quiz
                </h1>
                <p className="mt-3 text-base sm:text-lg text-neutral-200 leading-relaxed font-normal">
                  Test your real-world readiness against phishing, imposter emails, scam WhatsApp texts, fraudulent calls, and OTP manipulation.
                </p>
              </div>

              <Link
                to="/results"
                className="inline-flex items-center gap-1.5 self-start shrink-0 rounded-lg border border-white/10 bg-[#121811] hover:bg-[#182216] px-4 py-2.5 text-xs font-bold text-neutral-300 hover:text-white transition-colors"
              >
                <span>Check Past Results</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#B4F437]" />
              </Link>
            </div>

            <ParticipantStartGate
              title="Enter Details to Begin Quiz"
              subtitle="Every participant must enter their full name and email address before starting. Each email can only be used once to take the quiz."
              badgeText="10 Questions • Awareness Evaluation"
              assessmentType="quiz"
              buttonLabel="Verify & Start Quiz"
              estimatedTime="5-7 minutes"
              onProceed={(p) => setParticipant(p)}
            />
          </div>
        ) : !isCompleted ? (
          <div>
            {/* Header with Active Participant info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B4F437]">
                  <User className="h-3.5 w-3.5" />
                  <span>Participant: <strong className="text-white">{participant.name}</strong></span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-neutral-400 font-normal">{participant.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors self-start sm:self-auto flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Switch Participant</span>
              </button>
            </div>

            {/* Progress Bar Container */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-[#0F150E] p-5">
              <ProgressBar
                current={currentIdx + 1}
                total={total}
                label="Question Progress"
              />
            </div>

            {/* Current Question */}
            <QuizQuestion
              question={currentQuestion}
              questionIndex={currentIdx}
              totalQuestions={total}
              selectedOption={userSelection}
              onSelectOption={handleSelectOption}
              showExplanation={isExplanationShown}
            />

            {/* Navigation buttons */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#121811] px-5 py-2.5 text-xs font-bold text-neutral-300 hover:bg-[#182216] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {userSelection === null && (
                  <span className="text-xs text-neutral-500 hidden sm:inline font-medium">
                    Select an answer to proceed
                  </span>
                )}

                <button
                  id="quiz-btn-next"
                  type="button"
                  disabled={userSelection === null}
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] disabled:opacity-40 disabled:pointer-events-none text-[#080C07] px-6 py-2.5 text-xs font-bold transition-all shadow-[0_0_20px_rgba(180,244,55,0.25)] active:scale-[0.98]"
                >
                  <span>{currentIdx === total - 1 ? 'Finish & See Results' : 'Next Question'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Final Results Screen with Participant pre-filled and automatically saved */
          <ResultCard
            type="quiz"
            score={correctCount}
            total={total}
            participant={participant}
            onRestart={handleRestart}
            questionsSummary={quizQuestions.map((q, idx) => ({
              questionText: q.question,
              isCorrect: selectedAnswers[idx] === q.correctAnswer,
              explanation: q.explanation,
            }))}
          />
        )}

        {/* Footer info link */}
        <div className="mt-12 text-center">
          <p className="text-xs text-neutral-400">
            Encountered an unfamiliar threat term?{' '}
            <Link to="/learn" className="text-[#B4F437] hover:underline font-bold">
              Browse the Learn Topics Hub →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
