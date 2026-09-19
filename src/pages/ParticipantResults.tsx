import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  User,
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Printer,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  BadgeCheck,
  Layers,
  Sparkles,
  Download,
  AlertOctagon,
  FileX,
  ShieldAlert
} from 'lucide-react';
import { getParticipantQuizRecords, getParticipantDetectionRecords } from '../lib/supabase';
import { quizQuestions } from '../data/quizQuestions';
import { getLastParticipant, saveLastParticipant } from '../utils/storage';
import { QuizSubmission, DetectionSubmission } from '../types';
import { downloadCertificateAsImage, printCertificateSafely, CertificateDetails } from '../utils/certificate';

export const ParticipantResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial values from query params or local storage
  const initialEmail = searchParams.get('email') || getLastParticipant()?.email || '';
  const initialName = searchParams.get('name') || getLastParticipant()?.name || '';

  const [nameInput, setNameInput] = useState(initialName);
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certFeedback, setCertFeedback] = useState<string | null>(null);
  const [certificateError, setCertificateError] = useState<string | null>(null);

  // Result state
  const [participant, setParticipant] = useState<{
    name: string;
    email: string;
    created_at?: string;
  } | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [detectionSubmissions, setDetectionSubmissions] = useState<DetectionSubmission[]>([]);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState<number>(0);
  const [showAllQuestions, setShowAllQuestions] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  // Auto-search if email is in URL
  useEffect(() => {
    if (initialEmail) {
      handleLookup(initialEmail, initialName);
    }
  }, []);

  const handleLookup = async (targetEmail: string, targetName?: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    const cleanName = (targetName || nameInput).trim();

    if (!cleanEmail) return;

    setLoading(true);
    setSearched(true);
    setCertificateError(null);

    try {
      const [{ participant: pInfo, submissions: subs }, detectData] = await Promise.all([
        getParticipantQuizRecords(cleanEmail, cleanName),
        getParticipantDetectionRecords(cleanEmail, cleanName)
      ]);

      const detSubs = detectData.submissions || [];
      const hasAnyRecords = (pInfo !== null) || subs.length > 0 || detSubs.length > 0;

      if (hasAnyRecords) {
        const resolvedName = pInfo?.name || cleanName || subs[0]?.name || detSubs[0]?.name || 'Participant';
        setParticipant(pInfo || { name: resolvedName, email: cleanEmail });
        setSubmissions(subs);
        setDetectionSubmissions(detSubs);
        setSelectedSubmissionIndex(0);
        saveLastParticipant({
          name: resolvedName,
          email: cleanEmail
        });

        // If they did detect but not quiz, show clear notification
        if (subs.length === 0 && detSubs.length > 0) {
          setCertificateError(
            'Certificate Not Found: You have recorded results for the Threat Simulator, but you have not attempted the quiz yet. Please participate and complete the quiz to get your certificate.'
          );
        }
      } else {
        setParticipant(null);
        setSubmissions([]);
        setDetectionSubmissions([]);
        setCertificateError(
          'Certificate Not Found: You have not attempted the quiz yet. Please participate and complete the quiz to get your certificate.'
        );
      }
    } catch (err) {
      console.error('Lookup failed:', err);
      setCertificateError('Unable to complete lookup at this time. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectCertificateDownload = async () => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanName = nameInput.trim();
    setCertificateError(null);

    if (!cleanEmail) {
      setCertificateError('Please enter your email address to look up and download your certificate.');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const [{ participant: pInfo, submissions: subs }, detectData] = await Promise.all([
        getParticipantQuizRecords(cleanEmail, cleanName),
        getParticipantDetectionRecords(cleanEmail, cleanName)
      ]);

      const detSubs = detectData.submissions || [];
      const hasQuiz = subs.length > 0;
      const hasDetect = detSubs.length > 0;

      if (hasQuiz) {
        const resolvedName = pInfo?.name || cleanName || subs[0]?.name || 'Participant';
        const activeSub = subs[0];
        setParticipant(pInfo || { name: resolvedName, email: cleanEmail });
        setSubmissions(subs);
        setDetectionSubmissions(detSubs);
        setSelectedSubmissionIndex(0);

        const certDetails: CertificateDetails = {
          name: resolvedName,
          score: activeSub.score,
          totalQuestions: activeSub.total_questions,
          percentage: activeSub.percentage,
          dateStr: formatParticipationDate(activeSub.completed_at),
          tierTitle:
            activeSub.percentage >= 85
              ? 'High Cyber Vigilance'
              : activeSub.percentage >= 60
              ? 'Moderate Awareness'
              : 'High Risk Exposure',
          verificationId: `CEP-CYBER-${Math.abs(
            cleanEmail.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
          )
            .toString(16)
            .toUpperCase()
            .padStart(6, '0')}`
        };
        setDownloadingCert(true);
        const ok = await downloadCertificateAsImage(certDetails);
        setDownloadingCert(false);
        if (ok) {
          setCertFeedback('Certificate downloaded successfully! Check your downloads.');
          setTimeout(() => setCertFeedback(null), 6000);
        }
      } else if (hasDetect) {
        setParticipant(pInfo || { name: cleanName || detSubs[0]?.name || 'Participant', email: cleanEmail });
        setSubmissions([]);
        setDetectionSubmissions(detSubs);
        setCertificateError(
          'Certificate Not Found: You have recorded results for the Threat Simulator, but you have not attempted the quiz yet. Please participate and complete the quiz to get your certificate.'
        );
      } else {
        setParticipant(null);
        setSubmissions([]);
        setDetectionSubmissions([]);
        setCertificateError(
          'Certificate Not Found: You have not attempted the quiz yet. Please participate and complete the quiz to get your certificate.'
        );
      }
    } catch (err) {
      console.error('Direct certificate download check failed:', err);
      setCertificateError('Certificate Not Found: Unable to verify participant records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    // Update query params for easy sharing or bookmarking
    setSearchParams({ email: emailInput.trim(), name: nameInput.trim() });
    handleLookup(emailInput.trim(), nameInput.trim());
  };

  const toggleQuestion = (idx: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Active submission data
  const currentSubmission = submissions[selectedSubmissionIndex] || null;

  // Format date and time
  const formatParticipationDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Format relative time (e.g. "5 minutes ago")
  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just moments ago';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return '';
    }
  };

  // Evaluation tier calculation
  const score = currentSubmission ? currentSubmission.score : 0;
  const totalQuestions = currentSubmission ? currentSubmission.total_questions : 10;
  const percentage = currentSubmission ? currentSubmission.percentage : 0;

  let tier = {
    title: 'High Cyber Vigilance',
    color: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40',
    badge: 'Certified Vigilant',
    description:
      'Outstanding awareness! You demonstrate strong, proactive discernment against social engineering, spoofed domains, and credential phishing.',
    advice:
      'Keep up this security hygiene. Continue verifying sender headers and mentor fellow peers on avoiding urgent message traps.'
  };

  if (percentage < 60) {
    tier = {
      title: 'High Risk Exposure',
      color: 'text-amber-400 border-amber-800/60 bg-amber-950/40',
      badge: 'Review Recommended',
      description:
        'You may be exposed to deceptive phishing lures, fraudulent UPI collection links, or malicious urgency tactics.',
      advice:
        'We strongly encourage reviewing our Learn Topics and trying the interactive Detection Scenarios to sharpen your defensive instincts.'
    };
  } else if (percentage < 85) {
    tier = {
      title: 'Moderate Awareness',
      color: 'text-cyan-400 border-cyan-800/60 bg-cyan-950/40',
      badge: 'Competent Baseline',
      description:
        'Good fundamental knowledge. You recognize obvious scams but should exercise extra caution on advanced domain typosquatting and QR frauds.',
      advice:
        'Review the specific questions you missed below to master the subtle indicators that distinguish official alerts from criminal lures.'
    };
  }

  // Generate unique certificate ID
  const participantId = participant?.email
    ? `CEP-CYBER-${Math.abs(
        participant.email
          .split('')
          .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      )
        .toString(16)
        .toUpperCase()
        .padStart(6, '0')}`
    : 'CEP-CYBER-VERIFIED';

  const getCertDetails = (): CertificateDetails => {
    return {
      name: participant?.name || currentSubmission?.name || nameInput || 'Participant',
      score,
      totalQuestions,
      percentage,
      dateStr: formatParticipationDate(currentSubmission?.completed_at),
      tierTitle: tier.title,
      verificationId: participantId,
    };
  };

  const handleSaveCertificate = async () => {
    if (!currentSubmission) {
      setCertificateError('Certificate Not Found: You have not attempted the quiz yet. Please participate and complete the quiz to get your certificate.');
      return;
    }
    setDownloadingCert(true);
    setCertFeedback(null);
    try {
      const ok = await downloadCertificateAsImage(getCertDetails());
      if (ok) {
        setCertFeedback('Certificate image downloaded successfully! Check your downloads.');
      } else {
        setCertFeedback('Certificate download initiated.');
      }
    } catch (e) {
      setCertFeedback('Unable to download automatically. Trying print view...');
    } finally {
      setDownloadingCert(false);
      setTimeout(() => setCertFeedback(null), 6000);
    }
  };

  const handlePrintCertificate = async () => {
    if (!currentSubmission) {
      setCertificateError('Certificate Not Found: You have not attempted the quiz yet. Please participate and complete the quiz to get your certificate.');
      return;
    }
    setCertFeedback('Preparing certificate for printing...');
    try {
      const result = await printCertificateSafely(getCertDetails());
      if (result.fallbackDownloaded) {
        setCertFeedback('Browser print blocked inside frame: Certificate downloaded directly as high-res PNG for you to print!');
      } else {
        setCertFeedback('Print dialog opened.');
      }
    } catch {
      setCertFeedback('Click "Save Certificate (PNG)" to save and print your certificate.');
    } finally {
      setTimeout(() => setCertFeedback(null), 6000);
    }
  };

  return (
    <div className="relative z-10 py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-8 print:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
            <FileCheck className="h-3.5 w-3.5" />
            <span>Participant Records & Results Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Quiz Participation & Results
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Look up your official participation record, see your score, review the complete quiz curriculum, and print your College Extension Cyber Awareness Certificate.
          </p>
        </div>

        {/* Search / Lookup Form Box */}
        <div
          id="participant-lookup-card"
          className="rounded-2xl border border-slate-800 bg-[#081220] p-6 sm:p-8 shadow-xl mb-8 print:hidden"
        >
          <div className="flex items-center gap-2 mb-4 text-white">
            <Search className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold">Participant Lookup</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5 max-w-2xl">
            Enter the Full Name and Email ID used during your quiz session to retrieve your scores, participation timestamp, and certificate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lookup-name"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="lookup-name"
                    type="text"
                    placeholder="e.g. Alex Kumar"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#040911] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lookup-email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Participant Email ID <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="lookup-email"
                    type="email"
                    required
                    placeholder="e.g. student@college.edu"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#040911] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Verified College Extension Program Database Records</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="btn-search-results"
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-5 py-2.5 text-xs font-semibold transition-all shadow-md shadow-cyan-950 active:scale-[0.98] disabled:opacity-50"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>{loading ? 'Searching Records...' : 'View My Results & Certificate'}</span>
                </button>

                <button
                  id="btn-download-cert-lookup"
                  type="button"
                  disabled={loading || downloadingCert}
                  onClick={handleDirectCertificateDownload}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadingCert ? 'Verifying...' : 'Download Certificate'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* On-screen Certificate Error Banner */}
        {certificateError && (
          <div
            id="certificate-not-found-banner"
            className="rounded-2xl border border-rose-800/80 bg-[#170C15] p-5 sm:p-6 mb-8 text-rose-200 shadow-xl shadow-rose-950/40 animate-fadeIn"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950 border border-rose-800/60 text-rose-400 shrink-0 mt-0.5">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300 bg-rose-950/90 border border-rose-800/60 px-2.5 py-0.5 rounded-full">
                      Certificate Not Found
                    </span>
                    <h3 className="text-base font-bold text-white">Assessment Incomplete</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCertificateError(null)}
                    className="text-xs text-rose-400 hover:text-white transition-colors"
                  >
                    ✕ Dismiss
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-rose-200 leading-relaxed font-medium">
                  {certificateError}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <Link
                    to="/quiz"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-4 py-2 text-xs font-semibold shadow-md shadow-cyan-950 transition-all"
                  >
                    <span>Take Awareness Quiz</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/detect"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-slate-200 px-4 py-2 text-xs font-semibold transition-all"
                  >
                    <span>Try Threat Simulator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* When results found */}
        {searched && (submissions.length > 0 || detectionSubmissions.length > 0) && (
          <div className="space-y-10">
            {/* Participant Profile Banner */}
            <div
              id="participant-summary-banner"
              className="rounded-2xl border border-cyan-800/40 bg-gradient-to-r from-[#071322] to-[#0B1A2E] p-6 sm:p-8 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    <span>Verified CEP Participant</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {participant?.name || submissions[0]?.name || detectionSubmissions[0]?.name || 'Participant'}
                  </h2>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{participant?.email || submissions[0]?.email || detectionSubmissions[0]?.email}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="font-mono text-cyan-300 font-semibold">{participantId}</span>
                    </div>
                  </div>

                  {/* Summary badges for assessments */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {submissions.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50 text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Quiz Completed: <strong>{submissions[0].score}/{submissions[0].total_questions} ({submissions[0].percentage}%)</strong>
                      </span>
                    ) : (
                      <Link
                        to="/quiz"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-800"
                      >
                        <span>Quiz: Not Attempted Yet</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}

                    {detectionSubmissions.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-cyan-950/50 border border-cyan-800/50 text-cyan-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Simulator Completed: <strong>{detectionSubmissions[0].score}/{detectionSubmissions[0].total_scenarios} ({detectionSubmissions[0].percentage}%)</strong>
                      </span>
                    ) : (
                      <Link
                        to="/detect"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-800"
                      >
                        <span>Threat Simulator: Not Attempted Yet</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Print and Save Certificate Action Group */}
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 print:hidden">
                  {submissions.length > 0 && (
                    <>
                      <button
                        id="btn-save-cert"
                        type="button"
                        onClick={handleSaveCertificate}
                        disabled={downloadingCert}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-4 py-2 text-xs font-bold transition-all shadow-md shadow-cyan-950 disabled:opacity-50"
                      >
                        <Download className="h-4 w-4" />
                        <span>{downloadingCert ? 'Generating...' : 'Save Certificate (PNG)'}</span>
                      </button>

                      <button
                        id="btn-print-cert"
                        type="button"
                        onClick={handlePrintCertificate}
                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-2 text-xs font-semibold transition-colors"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print Certificate</span>
                      </button>
                    </>
                  )}

                  {certFeedback && (
                    <div className="w-full text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{certFeedback}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detection Simulator Results Card (if completed) */}
            {detectionSubmissions.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-800/50 text-cyan-400">
                      <Search className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Phishing & Scam Detector Performance
                      </h3>
                      <p className="text-xs text-slate-400">
                        Interactive Threat Simulator • Community Engagement Project
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Identified Scenarios</span>
                      <strong className="text-xl font-extrabold text-white">
                        {detectionSubmissions[0].score} / {detectionSubmissions[0].total_scenarios}
                      </strong>
                    </div>
                    <span className="text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-800/50 px-3 py-1.5 rounded-xl">
                      {detectionSubmissions[0].percentage}% Accuracy
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>
                      Completed on: <strong>{formatParticipationDate(detectionSubmissions[0].completed_at)}</strong>
                    </span>
                  </div>

                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Recorded in CEP Project Database
                  </span>
                </div>
              </div>
            )}

            {/* Quiz Results & Certificate Section */}
            {currentSubmission ? (
              <div className="space-y-10">
                {/* Multiple attempts picker if user took it multiple times */}
                {submissions.length > 1 && (
                  <div className="rounded-xl border border-slate-800 bg-[#081220] p-4 print:hidden">
                    <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Participation History ({submissions.length} attempts recorded):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {submissions.map((sub, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSubmissionIndex(idx)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            selectedSubmissionIndex === idx
                              ? 'bg-cyan-500 text-[#050B14] border-cyan-400 font-bold shadow-md shadow-cyan-950'
                              : 'bg-[#060D18] text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          Attempt #{submissions.length - idx}: {sub.score}/{sub.total_questions} (
                          {sub.percentage}%) • {formatParticipationDate(sub.completed_at)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

            {/* Score & Evaluation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Card */}
              <div className="rounded-2xl border border-slate-800 bg-[#081220] p-6 text-center flex flex-col justify-center items-center shadow-lg">
                <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-1">
                  Quiz Result Score
                </span>
                <div className="flex items-baseline justify-center gap-2 my-2">
                  <span className="text-5xl font-extrabold text-white">{score}</span>
                  <span className="text-2xl font-semibold text-slate-500">
                    / {totalQuestions}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 mt-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{percentage}% Awareness Score</span>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Scored {score} correct out of {totalQuestions} scenario questions
                </p>
              </div>

              {/* Vigilance Classification */}
              <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-[#081220] p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                      Awareness Evaluation
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${tier.color}`}>
                      {tier.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tier.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {tier.description}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-[#050B14] p-3 text-xs text-slate-300">
                  <strong className="text-cyan-400">Next Action:</strong> {tier.advice}
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar for Certificate */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#081220] border border-cyan-800/40 rounded-xl p-4 print:hidden">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Official Certificate of Cyber Awareness</h4>
                  <p className="text-xs text-slate-400">Save as high-resolution PNG or print for your portfolio</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="btn-cert-quick-save"
                  type="button"
                  onClick={handleSaveCertificate}
                  disabled={downloadingCert}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadingCert ? 'Saving...' : 'Save Certificate (PNG)'}</span>
                </button>
                <button
                  id="btn-cert-quick-print"
                  type="button"
                  onClick={handlePrintCertificate}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-2 text-xs font-semibold transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>

            {/* Official Printable Certificate Card */}
            <div
              id="official-certificate"
              className="rounded-2xl border-2 border-cyan-600/40 bg-[#060D18] p-8 sm:p-12 shadow-2xl relative overflow-hidden print:border-2 print:border-slate-800 print:bg-white print:text-slate-900 print:shadow-none"
            >
              {/* Background ambient watermarks */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative text-center space-y-6">
                {/* Certificate Header Badge */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 print:bg-cyan-50 print:border-cyan-400">
                  <Award className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-cyan-400 print:text-cyan-800">
                    College Extension & Community Engagement Project (CEP)
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 print:text-slate-900">
                    Certificate of Cyber Awareness & Participation
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
                    This document certifies successful participation in the Digital Scam & Fraud Detection Assessment
                  </p>
                </div>

                <div className="py-4 border-y border-slate-800/80 print:border-slate-300 max-w-xl mx-auto space-y-3">
                  <p className="text-xs text-slate-400 print:text-slate-600">
                    Proudly awarded to
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 tracking-tight print:text-cyan-900 font-sans">
                    {participant?.name || currentSubmission.name || 'Participant'}
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                    has completed the interactive evaluation on <strong>Phishing, Scam & Fraud Detection Awareness</strong>, achieving an evaluation score of{' '}
                    <strong className="text-cyan-400 print:text-slate-900">{percentage}%</strong> ({score}/{totalQuestions} questions correct).
                  </p>
                </div>

                {/* Certificate Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 print:text-slate-600 max-w-2xl mx-auto pt-2">
                  <div className="p-3 rounded-lg border border-slate-800/60 bg-[#081220]/60 print:bg-slate-50 print:border-slate-200">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      Participation Date
                    </span>
                    <strong className="text-slate-200 print:text-slate-800 mt-0.5 block">
                      {formatParticipationDate(currentSubmission.completed_at)}
                    </strong>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800/60 bg-[#081220]/60 print:bg-slate-50 print:border-slate-200">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      Assessment Rating
                    </span>
                    <strong className="text-cyan-300 print:text-cyan-800 mt-0.5 block">
                      {tier.title}
                    </strong>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800/60 bg-[#081220]/60 print:bg-slate-50 print:border-slate-200">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      Verification Reference
                    </span>
                    <strong className="font-mono text-slate-300 print:text-slate-800 mt-0.5 block">
                      {participantId}
                    </strong>
                  </div>
                </div>

                {/* Official Seals & Footer */}
                <div className="pt-4 flex items-center justify-between max-w-xl mx-auto text-xs text-slate-400 print:text-slate-600 border-t border-slate-800/60 print:border-slate-300">
                  <div className="text-left">
                    <p className="font-semibold text-slate-300 print:text-slate-800">
                      CyberAware Initiative
                    </p>
                    <p className="text-[10px] text-slate-500">College Extension Program</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 print:text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cryptographically Logged Record</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ALL INFORMATION ABOUT THE QUIZ (Curriculum & Specifications) */}
            <div
              id="quiz-curriculum-information"
              className="rounded-2xl border border-slate-800 bg-[#081220] p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                    <span>Complete Information About This Quiz</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Academic syllabus, topics evaluated, scoring criteria, and forensic question breakdown.
                  </p>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                  10 Core Cyber Domains Tested
                </span>
              </div>

              {/* Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#050B14]">
                  <span className="text-slate-400 block text-[11px]">Program Model</span>
                  <strong className="text-white mt-1 block">College Extension (CEP)</strong>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#050B14]">
                  <span className="text-slate-400 block text-[11px]">Total Questions</span>
                  <strong className="text-white mt-1 block">10 Scenarios</strong>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#050B14]">
                  <span className="text-slate-400 block text-[11px]">Question Format</span>
                  <strong className="text-white mt-1 block">Multiple Choice Single Best</strong>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#050B14]">
                  <span className="text-slate-400 block text-[11px]">Passing Benchmark</span>
                  <strong className="text-cyan-400 mt-1 block">85% for High Vigilance</strong>
                </div>
              </div>

              {/* Topics Covered */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Topics Covered in the Quiz
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { topic: 'OTP & Password Confidentiality', desc: 'Legitimate banks never request OTPs over telephone or chat.' },
                    { topic: 'UPI & QR Code Collection Traps', desc: 'Scanning QR or entering UPI PIN only sends money, never receives it.' },
                    { topic: 'Sender Domain Forgery Inspection', desc: 'Authentic emails strictly origin from official verified registered domains.' },
                    { topic: 'Advance-Fee Job & Task Scams', desc: 'Work-from-home lures asking upfront training or kit payments.' },
                    { topic: 'Urgent Electricity / Utility Threats', desc: 'Fabricated disconnection deadlines with unofficial mobile numbers.' },
                    { topic: 'Lookalike URLs & Typosquatting', desc: 'Deceptive characters imitating official bank domains (e.g. onlinesb1.com).' },
                    { topic: 'Remote Screen-Sharing Trojans', desc: 'Fraudsters prompting AnyDesk/TeamViewer installs to seize mobile control.' },
                    { topic: 'Impersonation & Social Engineering', desc: 'Pretexting emergencies from friends/family requesting immediate transfers.' },
                    { topic: 'Malicious Email File Attachments', desc: 'Disguised invoices containing .exe or macro-laden trojans.' },
                    { topic: 'Two-Factor Authentication (2FA)', desc: 'Crucial out-of-band second defense against compromised passwords.' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-800/80 bg-[#050B14]/80 flex items-start gap-2.5"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-950 border border-cyan-800/50 text-[10px] font-bold text-cyan-400">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-slate-200 block text-xs">{item.topic}</strong>
                        <span className="text-slate-400 text-[11px] mt-0.5 block leading-snug">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Questions & Explanations Review */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Questions & Answers Review Breakdown
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Inspect the complete set of questions from the quiz alongside forensic explanations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllQuestions(!showAllQuestions)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>{showAllQuestions ? 'Collapse List' : 'Expand All'}</span>
                    {showAllQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {showAllQuestions && (
                  <div className="space-y-3">
                    {quizQuestions.map((q, idx) => {
                      const isExpanded = expandedQuestions[idx] ?? true;
                      // If this submission recorded question breakdown, check if participant was correct
                      const matchedSummary = currentSubmission.questionsSummary?.[idx];

                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-[#050B14] p-4 text-xs transition-colors"
                        >
                          <div
                            onClick={() => toggleQuestion(idx)}
                            className="flex items-start justify-between gap-3 cursor-pointer select-none"
                          >
                            <div className="flex items-start gap-2.5">
                              {matchedSummary ? (
                                matchedSummary.isCorrect ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                                )
                              ) : (
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">
                                  {idx + 1}
                                </span>
                              )}
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                                    {q.topic}
                                  </span>
                                  {matchedSummary && (
                                    <span
                                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        matchedSummary.isCorrect
                                          ? 'text-emerald-300 bg-emerald-950/50'
                                          : 'text-amber-300 bg-amber-950/50'
                                      }`}
                                    >
                                      {matchedSummary.isCorrect ? 'Correct in this attempt' : 'Missed in this attempt'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-200 font-semibold text-xs leading-relaxed">
                                  {q.question}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="text-slate-400 hover:text-white p-1 shrink-0"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="mt-3.5 pt-3 border-t border-slate-800/80 pl-7 space-y-2">
                              <div className="space-y-1.5">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                  Options:
                                </p>
                                {q.options.map((opt, optIdx) => (
                                  <div
                                    key={optIdx}
                                    className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                                      optIdx === q.correctAnswer
                                        ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 font-medium'
                                        : 'bg-[#081220]/60 text-slate-400 border border-slate-800/50'
                                    }`}
                                  >
                                    <span className="font-mono font-bold text-[10px]">
                                      {String.fromCharCode(65 + optIdx)}.
                                    </span>
                                    <span>{opt}</span>
                                    {optIdx === q.correctAnswer && (
                                      <span className="ml-auto text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                        ✓ Correct Answer
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-2.5 p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 leading-relaxed">
                                <strong className="text-cyan-400 font-bold block mb-0.5">
                                  Educational Explanation:
                                </strong>
                                {q.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            id="quiz-not-attempted-card"
            className="rounded-2xl border border-amber-900/60 bg-gradient-to-b from-[#141008] to-[#0A101D] p-8 sm:p-10 text-center space-y-5 shadow-xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <AlertOctagon className="h-7 w-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 border border-amber-800/60 text-amber-300">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Awareness Quiz Not Attempted</span>
            </div>

            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Certificate Not Found: Awareness Quiz Incomplete
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                You have recorded results for the Threat Simulator, but you have not attempted the quiz yet. Please participate and complete the quiz to get your certificate.
              </p>
            </div>

            <div className="max-w-md mx-auto rounded-xl border border-rose-900/50 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-center justify-center gap-2">
              <FileX className="h-4 w-4 text-rose-400 shrink-0" />
              <span><strong>Certificate Download Locked:</strong> Official certificates are generated only after completing the 10-Question Cyber Awareness Quiz.</span>
            </div>

            <div className="pt-2">
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-6 py-2.5 text-xs font-semibold transition-all shadow-md shadow-cyan-950 active:scale-[0.98]"
              >
                <span>Take Awareness Quiz & Get Certificate</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    )}

    {/* When searched but no submissions found */}
    {searched && submissions.length === 0 && detectionSubmissions.length === 0 && !loading && (
      <div
        id="participant-not-found-card"
        className="rounded-2xl border border-rose-900/60 bg-gradient-to-b from-[#180C14] to-[#08101D] p-8 sm:p-10 text-center space-y-5 shadow-2xl shadow-rose-950/20"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-800/60 text-rose-400 shadow-inner">
          <FileX className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-950 border border-rose-800/60 text-rose-300">
          <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
          <span>No Participation Record Found</span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Certificate Not Found
          </h3>
          <p className="mt-2.5 text-sm sm:text-base text-rose-200/90 font-medium max-w-xl mx-auto leading-relaxed">
            You have not attempted the quiz or threat detection simulator yet. Please participate and complete the quiz to get your certificate.
          </p>
        </div>

        <div className="max-w-lg mx-auto rounded-xl border border-rose-900/50 bg-rose-950/40 p-4 text-xs text-slate-300 space-y-2 text-left">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
            <span className="text-slate-400">Searched Participant Email:</span>
            <span className="font-mono font-semibold text-rose-300">{emailInput}</span>
          </div>
          <p className="text-rose-200/80 leading-relaxed pt-1">
            We couldn't find any recorded quiz or threat detection attempts under this email address. Official certificates are generated and verified cryptographically only after completing the assessment.
          </p>
        </div>

        {/* Explicit On-Screen Error Notice */}
        <div className="max-w-lg mx-auto rounded-xl border border-amber-900/60 bg-amber-950/40 p-3.5 text-xs text-amber-200 flex items-start gap-2.5 text-left">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-300">Certificate Download Unavailable:</strong> Anyone wishing to view or download an official Cyber Awareness Certificate must first participate in and complete the quiz.
          </div>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-6 py-3 text-xs font-semibold shadow-lg shadow-cyan-950 transition-all active:scale-[0.98]"
          >
            <span>Take Awareness Quiz & Get Certificate</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-5 py-3 text-xs font-semibold transition-all"
          >
            <span>Try Threat Simulator</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="pt-2 text-xs text-slate-400">
          <span>Entered the wrong email? </span>
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('lookup-email') as HTMLInputElement | null;
              if (input) {
                input.focus();
                input.select();
              }
            }}
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold ml-1"
          >
            Edit your search email above
          </button>
        </div>
      </div>
    )}

        {/* Informational intro card when user hasn't searched yet */}
        {!searched && (
          <div className="rounded-2xl border border-slate-800 bg-[#081220] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  About the College Extension Program Quiz Assessment
                </h3>
                <p className="text-xs text-slate-400">
                  Phishing, Scam & Fraud Detection Awareness Program
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This interactive quiz is an educational initiative under our College Extension and Community Engagement Project (CEP). Every participant who completes the quiz receives an official awareness evaluation score, detailed review breakdown of scam indicators, and a verified Certificate of Cyber Awareness.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl border border-slate-800 bg-[#050B14]">
                <div className="text-cyan-400 font-bold mb-1">1. Take the Quiz</div>
                <p className="text-slate-400 text-[11px]">
                  Answer 10 real-world scenarios covering fake SMS, job traps, UPI frauds, and bank phishing.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-[#050B14]">
                <div className="text-cyan-400 font-bold mb-1">2. Record Your Name & Email</div>
                <p className="text-slate-400 text-[11px]">
                  Save your result to the official project registry for academic attendance and certificate verification.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-[#050B14]">
                <div className="text-cyan-400 font-bold mb-1">3. Check Results Anytime</div>
                <p className="text-slate-400 text-[11px]">
                  Return to this portal with your email to view your scores, timestamp, and printable certificate.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-cyan-950"
              >
                <span>Take the Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 px-4 py-2.5 text-xs font-semibold transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Browse Learning Topics</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
