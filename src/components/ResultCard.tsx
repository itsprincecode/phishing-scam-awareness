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
      dateStr: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
      tierTitle: percentage >= 85 ? 'High Cyber Vigilance' : percentage >= 60 ? 'Moderate Awareness' : 'High Risk Exposure',
      verificationId: email
        ? `CEP-CYBER-${Math.abs(email.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(6, '0')}`
        : 'CEP-CYBER-VERIFIED'
    };
  };

  const handleSaveCertificate = async () => {
    setDownloadingCert(true);
    setCertFeedback(null);
    try {
      const ok = await downloadCertificateAsImage(getCertDetails());
      if (ok) {
        setCertFeedback('Certificate image downloaded!');
      } else {
        setCertFeedback('Download started.');
      }
    } catch {
      setCertFeedback('Unable to save certificate automatically.');
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
  let tierColor = 'text-cyan-400 border-cyan-800/50 bg-cyan-950/40';

  if (percentage >= 85) {
    tierTitle = 'High Cyber Vigilance';
    tierAdvice = 'Excellent awareness! You demonstrate strong instincts for detecting fraud and deceptive links.';
    tierColor = 'text-emerald-400 border-emerald-800/50 bg-emerald-950/40';
  } else if (percentage >= 60) {
    tierTitle = 'Moderate Awareness';
    tierAdvice = 'Good baseline understanding. Review the warning signs in the Learn module to guard against advanced social engineering.';
    tierColor = 'text-cyan-400 border-cyan-800/50 bg-cyan-950/40';
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
      className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-10 shadow-2xl shadow-cyan-950/30"
    >
      {/* Awareness Score Header */}
      <div className="text-center pb-8 border-b border-slate-800/80">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Award className="h-8 w-8" />
        </div>

        <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
          Your Awareness Score
        </span>

        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            {score}
          </span>
          <span className="text-2xl sm:text-3xl font-semibold text-slate-500">
            / {total}
          </span>
          <span className="ml-3 text-sm font-semibold text-cyan-400 bg-cyan-950/90 border border-cyan-800/40 px-3 py-1 rounded-full">
            {percentage}% Score
          </span>
        </div>

        <div className="mt-5">
          <div
            className={`inline-block rounded-xl border px-4 py-2.5 text-sm font-medium ${tierColor}`}
          >
            <div className="font-bold text-base mb-0.5">{tierTitle}</div>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {tierAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Save Result to CEP Registry Section */}
      <div className="py-8 border-b border-slate-800/80">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Save Result to Project Registry</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            We only use this information to record anonymous project activity and attendance statistics for our college extension program. No passwords or personal data are collected.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Participation Recorded in CEP Registry!
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Thank you, <strong className="text-white">{name}</strong> ({email}). Your awareness score of <strong className="text-cyan-400">{score}/{total} ({percentage}%)</strong> and participation timestamp have been permanently recorded.
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-emerald-300 font-medium">
                Official Cyber Awareness Certificate Generated
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-save-cert-result-card"
                  onClick={handleSaveCertificate}
                  disabled={downloadingCert}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#050B14] text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadingCert ? 'Saving...' : 'Save (PNG)'}</span>
                </button>

                <button
                  type="button"
                  id="btn-print-cert-result-card"
                  onClick={handlePrintCertificate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>

                <Link
                  id="btn-view-participant-results"
                  to={`/results?email=${encodeURIComponent(email.trim())}&name=${encodeURIComponent(name.trim())}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                >
                  <span>Full Record</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {certFeedback && (
              <div className="text-xs p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 flex items-center gap-2 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
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
                  className="block text-xs font-medium text-slate-300 mb-1"
                >
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="participant-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#060D18] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="participant-email"
                  className="block text-xs font-medium text-slate-300 mb-1"
                >
                  College or Personal Email <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="participant-email"
                  type="email"
                  required
                  placeholder="e.g. student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#060D18] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            {submissionFeedback.status && (
              <div
                className={`text-xs p-2.5 rounded-lg flex items-center gap-2 ${
                  submissionFeedback.status === 'success'
                    ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-900/50'
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
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#050B14] px-5 py-2.5 text-xs font-semibold transition-all shadow-md shadow-cyan-950 active:scale-[0.98]"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? 'Recording...' : 'Record My Participation'}</span>
              </button>

              <Link
                to="/results"
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
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
        <div className="py-6 border-b border-slate-800/80">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Question Breakdown
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {questionsSummary.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs p-2.5 rounded-lg border border-slate-800 bg-[#060D18]"
              >
                {q.isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-slate-200 font-medium line-clamp-1">{q.questionText}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5 font-normal">{q.explanation}</p>
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>

        <div className="flex items-center gap-2">
          {type === 'quiz' ? (
            <Link
              to="/detect"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Try Detection Scenarios</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#050B14] text-xs font-semibold transition-colors"
            >
              <span>Take Quiz</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors font-medium"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Review Topics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
