import React from 'react';
import { Check, X, Info } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  showExplanation?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  showExplanation = false,
}) => {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div
      id={`quiz-question-${question.id}`}
      className="rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8 shadow-2xl shadow-cyan-950/20"
    >
      {/* Category badge and question number */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/40">
          {question.topic}
        </span>
        <span className="text-xs text-slate-400 font-medium">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Main Question Text */}
      <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed tracking-tight mb-6">
        {question.question}
      </h2>

      {/* Multiple Choice Options */}
      <div className="space-y-3" role="radiogroup" aria-label={`Question ${questionIndex + 1}`}>
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctAnswer;
          const letter = letters[idx] || String(idx + 1);

          // State styling
          let borderClass = 'border-slate-800 hover:border-slate-600 bg-[#060D18]/80 text-slate-200';
          let letterBg = 'bg-slate-800 text-slate-300 font-semibold';

          if (showExplanation) {
            if (isCorrect) {
              borderClass = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
              letterBg = 'bg-emerald-500 text-[#050B14] font-bold';
            } else if (isSelected && !isCorrect) {
              borderClass = 'border-red-500/80 bg-red-950/30 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.15)]';
              letterBg = 'bg-red-500 text-white font-bold';
            } else {
              borderClass = 'border-slate-800/60 bg-[#060D18]/40 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            borderClass = 'border-cyan-400 bg-cyan-950/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.18)]';
            letterBg = 'bg-cyan-400 text-[#050B14] font-bold';
          }

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={showExplanation}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${borderClass} ${
                !showExplanation ? 'hover:bg-slate-800/30 active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs transition-colors ${letterBg}`}
              >
                {letter}
              </div>

              <div className="flex-1 text-sm pt-0.5 leading-relaxed font-medium">
                {option}
              </div>

              {showExplanation && (
                <div className="shrink-0 pt-0.5">
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Correct</span>
                    </span>
                  ) : isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Incorrect</span>
                    </span>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box when showing answer */}
      {showExplanation && (
        <div className="mt-6 rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1.5">
            <Info className="h-4 w-4" />
            <span>Why this answer is correct</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
