import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Search,
  Download,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitQuizResult, submitDetectionResult } from '../lib/supabase';
import { downloadCertificateAsImage, printCertificateSafely, CertificateDetails } from '../utils/certificate';

interface ResultCardProps {
  type: 'quiz' | 'detection';
  score: number;
  total: number;
  onRestart: () => void;
  questionsSummary?: Array<{
    questionText: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  participant?: {
    name: string;
    email: string;
  };
}

export const ResultCard: React.FC<ResultCardProps> = ({
  type,
  score,
  total,
  onRestart,
  questionsSummary,
  participant,
}) => {
  const percentage = Math.round((score / total) * 100);

  // Form state for saving results
  const [name, setName] = useState(participant?.name || '');
  const [email, setEmail] = useState(participant?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certFeedback, setCertFeedback] = useState<string | null>(null);

  const getCertDetails = (): CertificateDetails => {
    return {
      name: name.trim() || participant?.name || 'Participant',
      score,
      totalQuestions: total,
      percentage,
      dateStr: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      tierTitle,
      verificationId: `CA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    };
  };

  const handleSaveCertificate = async () => {
    setDownloadingCert(true);
    setCertFeedback('Generating high-resolution certificate image...');
    try {
      await downloadCertificateAsImage(getCertDetails());
      setCertFeedback('Certificate downloaded successfully!');
    } catch (err) {
      console.error('Certificate download failed:', err);
      setCertFeedback('Could not generate image. Please use Print to save as PDF.');
    } finally {
      setDownloadingCert(false);
      setTimeout(() => setCertFeedback(null), 5000);
    }
  };

  const handlePrintCertificate = async () => {
    setCertFeedback('Preparing certificate...');
    try {
      const res = await printCertificateSafely(getCertDetails());
      if (res.fallbackDownloaded) {
        setCertFeedback('Certificate downloaded directly for you to print!');
      } else {
        setCertFeedback('Print view opened.');
      }
    } catch {
      setCertFeedback('Use "Save Certificate" to save your certificate.');
    } finally {
      setTimeout(() => setCertFeedback(null), 5000);
    }
  };

  // Auto-save when participant is already pre-registered
  React.useEffect(() => {
    if (participant && participant.email && !submitted && !submitting) {
      const autoSave = async () => {
        setSubmitting(true);
        try {
          let result;
          if (type === 'quiz') {
            result = await submitQuizResult({
              name: participant.name.trim(),
              email: participant.email.trim(),
              score,
              total_questions: total,
              questionsSummary,
            });
          } else {
            result = await submitDetectionResult({
              name: participant.name.trim(),
              email: participant.email.trim(),
              score,
              total_scenarios: total,
            });
          }

          if (result.success) {
            setSubmitted(true);
            setSubmissionFeedback({
              status: 'success',
              message: result.isLocalFallback
                ? 'Result successfully recorded for your CEP session!'
                : 'Result saved successfully to the CEP Project database!',
            });
          }
        } catch (err) {
          console.error('Auto-save error:', err);
        } finally {
          setSubmitting(false);
        }
      };

      autoSave();
    }
  }, [participant, score, total, type, questionsSummary]);

  // Awareness evaluation tiers
  let tierTitle = 'Cyber Aware Learner';
  let tierAdvice = 'Good awareness. Keep learning to stay safer online.';
  let tierColor = 'text-[#B4F437] border-[#B4F437]/40 bg-[#162013]';

  if (percentage >= 85) {
    tierTitle = 'High Cyber Vigilance';
    tierAdvice = 'Excellent awareness! You demonstrate strong instincts for detecting fraud and deceptive links.';
    tierColor = 'text-[#B4F437] border-[#B4F437]/50 bg-[#162013]';
  } else if (percentage >= 60) {
    tierTitle = 'Moderate Awareness';
    tierAdvice = 'Good baseline understanding. Review the warning signs in the Learn module to guard against advanced social engineering.';
    tierColor = 'text-lime-300 border-lime-700/50 bg-[#121A10]';
  } else {
    tierTitle = 'High Risk Exposure';
    tierAdvice = 'You may be vulnerable to sophisticated scams. We strongly recommend reviewing our Learn and Safety guides.';
    tierColor = 'text-amber-400 border-amber-800/50 bg-amber-950/40';
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setSubmissionFeedback({
        status: 'error',
        message: 'Please enter your name to record your participation.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setSubmissionFeedback({
        status: 'error',
        message: 'Please provide a valid email address.',
      });
      return;
    }

    setSubmitting(true);
    setSubmissionFeedback({ status: null, message: '' });

    try {
      let result;
      if (type === 'quiz') {
        result = await submitQuizResult({
          name: name.trim(),
          email: email.trim(),
          score,
          total_questions: total,
          questionsSummary,
        });
      } else {
        result = await submitDetectionResult({
          name: name.trim(),
          email: email.trim(),
          score,
          total_scenarios: total,
        });
      }

      if (result.success) {
        setSubmitted(true);
        setSubmissionFeedback({
          status: 'success',
          message: result.isLocalFallback
            ? 'Result successfully recorded for your CEP session!'
            : 'Result saved successfully to the CEP Project database!',
        });
      } else {
        setSubmissionFeedback({
          status: 'error',
          message: 'Unable to save your result right now. Please try again.',
        });
      }
    } catch {
      setSubmissionFeedback({
        status: 'error',
        message: 'Unable to save your result right now. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="result-card"
      className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-[#0F150E] p-6 sm:p-10 shadow-2xl"
    >
      {/* Awareness Score Header */}
      <div className="text-center pb-8 border-b border-white/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#141C12] border border-[#B4F437]/40 text-[#B4F437] shadow-[0_0_20px_rgba(180,244,55,0.25)]">
          <Award className="h-8 w-8" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
          Your Awareness Score
        </span>

        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            {score}
          </span>
          <span className="text-2xl sm:text-3xl font-semibold text-neutral-500">
            / {total}
          </span>
          <span className="ml-3 text-sm font-bold text-[#B4F437] bg-[#162013] border border-[#B4F437]/30 px-3 py-1 rounded-md">
            {percentage}% Score
          </span>
        </div>

        <div className="mt-5">
          <div
            className={`inline-block rounded-xl border px-4 py-2.5 text-sm font-medium ${tierColor}`}
          >
            <div className="font-bold text-base mb-0.5">{tierTitle}</div>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed font-normal">
              {tierAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Save Result to CEP Registry Section */}
      <div className="py-8 border-b border-white/10">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#B4F437]" />
            <span>Save Result to Project Registry</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-normal">
            We only use this information to record project activity and attendance statistics for our college extension program.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-[#B4F437]/30 bg-[#141C12]/80 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#B4F437] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">
                  Participation Recorded in CEP Registry!
                </p>
                <p className="text-xs text-neutral-300 mt-0.5 font-normal">
                  Thank you, <strong className="text-white">{name}</strong> ({email}). Your awareness score of <strong className="text-[#B4F437]">{score}/{total} ({percentage}%)</strong> has been recorded.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-[#B4F437] font-semibold">
                Official Cyber Awareness Certificate Generated
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-save-cert-result-card"
                  onClick={handleSaveCertificate}
                  disabled={downloadingCert}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadingCert ? 'Saving...' : 'Save (PNG)'}</span>
                </button>

                <button
                  type="button"
                  id="btn-print-cert-result-card"
                  onClick={handlePrintCertificate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B4F437]/40 bg-[#B4F437]/10 hover:bg-[#B4F437]/20 text-[#B4F437] text-xs font-bold transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>

                <Link
                  id="btn-view-participant-results"
                  to={`/results?email=${encodeURIComponent(email.trim())}&name=${encodeURIComponent(name.trim())}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#182216] hover:bg-[#202E1E] text-white text-xs font-semibold transition-all"
                >
                  <span>Full Record</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {certFeedback && (
              <div className="text-xs p-2 rounded-lg bg-[#182216] border border-[#B4F437]/40 text-[#B4F437] flex items-center gap-2 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#B4F437] shrink-0" />
                <span>{certFeedback}</span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="participant-name"
                  className="block text-xs font-bold text-neutral-300 mb-1"
                >
                  Full Name <span className="text-[#B4F437]">*</span>
                </label>
                <input
                  id="participant-name"
                  type="text"
                  required
                  placeholder="e.g. Prince Maurya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#080C07] px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-[#B4F437] focus:outline-none focus:ring-1 focus:ring-[#B4F437] font-normal"
                />
              </div>

              <div>
                <label
                  htmlFor="participant-email"
                  className="block text-xs font-bold text-neutral-300 mb-1"
                >
                  Email Address <span className="text-[#B4F437]">*</span>
                </label>
                <input
                  id="participant-email"
                  type="email"
                  required
                  placeholder="e.g. xyz@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#080C07] px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-[#B4F437] focus:outline-none focus:ring-1 focus:ring-[#B4F437] font-normal"
                />
              </div>
            </div>

            {submissionFeedback.status && (
              <div
                className={`text-xs p-2.5 rounded-lg flex items-center gap-2 ${
                  submissionFeedback.status === 'success'
                    ? 'text-[#B4F437] bg-[#162013] border border-[#B4F437]/40'
                    : 'text-red-300 bg-red-950/40 border border-red-900/50'
                }`}
              >
                {submissionFeedback.status === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{submissionFeedback.message}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                id="btn-save-result"
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] disabled:opacity-50 text-[#080C07] px-5 py-2.5 text-xs font-bold transition-all shadow-[0_0_15px_rgba(180,244,55,0.25)] active:scale-[0.98]"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? 'Recording...' : 'Record My Participation'}</span>
              </button>

              <Link
                to="/results"
                className="text-xs text-neutral-400 hover:text-[#B4F437] transition-colors flex items-center gap-1 font-semibold"
              >
                <span>Look up past results</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Review breakdown if available */}
      {questionsSummary && questionsSummary.length > 0 && (
        <div className="py-6 border-b border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Question Breakdown
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {questionsSummary.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs p-2.5 rounded-lg border border-white/10 bg-[#080C07]"
              >
                {q.isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 text-[#B4F437] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-white font-medium line-clamp-1">{q.questionText}</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5 font-normal">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Actions */}
      <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          id="btn-restart-quiz"
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-[#162013] hover:bg-[#1E2C1A] text-white text-xs font-bold transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>

        <div className="flex items-center gap-2">
          {type === 'quiz' ? (
            <Link
              to="/detect"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B4F437]/10 border border-[#B4F437]/30 hover:bg-[#B4F437]/20 text-[#B4F437] text-xs font-bold transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Try Detection Scenarios</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] text-xs font-bold transition-colors"
            >
              <span>Take Quiz</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white transition-colors font-medium"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Review Topics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
