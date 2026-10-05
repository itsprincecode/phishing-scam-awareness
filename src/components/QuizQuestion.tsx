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
      className="rounded-2xl border border-white/10 bg-[#0F150E] p-6 sm:p-8 shadow-2xl"
    >
      {/* Category badge and question number */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B4F437] bg-[#162013] px-3 py-1 rounded-md border border-[#B4F437]/30">
          {question.topic}
        </span>
        <span className="text-xs text-neutral-400 font-medium">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Main Question Text */}
      <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed tracking-tight mb-6">
        {question.question}
      </h2>

      {/* Multiple Choice Options */}
      <div className="space-y-3" role="radiogroup" aria-label={`Question ${questionIndex + 1}`}>
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctAnswer;
          const letter = letters[idx] || String(idx + 1);

          // State styling
          let borderClass = 'border-white/10 hover:border-white/20 bg-[#080C07] text-neutral-200';
          let letterBg = 'bg-[#182216] text-neutral-300 font-bold';

          if (showExplanation) {
            if (isCorrect) {
              borderClass = 'border-[#B4F437] bg-[#141C11] text-[#B4F437] shadow-[0_0_15px_rgba(180,244,55,0.2)] font-semibold';
              letterBg = 'bg-[#B4F437] text-[#080C07] font-bold';
            } else if (isSelected && !isCorrect) {
              borderClass = 'border-red-500/80 bg-red-950/30 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.15)]';
              letterBg = 'bg-red-500 text-white font-bold';
            } else {
              borderClass = 'border-white/5 bg-[#080C07]/40 text-neutral-500 opacity-60';
            }
          } else if (isSelected) {
            borderClass = 'border-[#B4F437] bg-[#162214] text-white shadow-[0_0_15px_rgba(180,244,55,0.2)] font-medium';
            letterBg = 'bg-[#B4F437] text-[#080C07] font-bold';
          }

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={showExplanation}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437] ${borderClass} ${
                !showExplanation ? 'hover:bg-[#121A10] active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs transition-colors ${letterBg}`}
              >
                {letter}
              </div>

              <div className="flex-1 text-sm pt-0.5 leading-relaxed font-normal">
                {option}
              </div>

              {showExplanation && (
                <div className="shrink-0 pt-0.5">
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[#B4F437] font-bold">
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Correct</span>
                    </span>
                  ) : isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-400 font-bold">
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
        <div className="mt-6 rounded-xl border border-[#B4F437]/30 bg-[#121A10] p-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B4F437] mb-1.5">
            <Info className="h-4 w-4" />
            <span>Why this answer is correct</span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed font-normal">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
