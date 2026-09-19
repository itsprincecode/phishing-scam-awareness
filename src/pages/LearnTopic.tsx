import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileText,
  Clock,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { learningTopics } from '../data/learningTopics';

export const LearnTopic: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const currentIndex = learningTopics.findIndex((t) => t.id === topicId);
  const topic = learningTopics[currentIndex];

  if (!topic) {
    return (
      <div className="relative z-10 py-20 text-center">
        <div className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-[#0A1424] p-8">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Topic Not Found</h2>
          <p className="text-xs text-slate-400 mt-2">
            The educational topic you are looking for does not exist or has moved.
          </p>
          <Link
            to="/learn"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-500 text-[#050B14] px-4 py-2 text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Topics</span>
          </Link>
        </div>
      </div>
    );
  }

  const prevTopic = currentIndex > 0 ? learningTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < learningTopics.length - 1 ? learningTopics[currentIndex + 1] : null;

  return (
    <div className="relative z-10 py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Learn Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{topic.readTime}</span>
          </div>
        </div>

        {/* Topic Title Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/50">
            {topic.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-4">
            {topic.title}
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            {topic.shortDesc}
          </p>
        </div>

        {/* 1. What is it? */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-cyan-400 mb-3">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">What is it?</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {topic.whatIsIt}
          </p>
        </section>

        {/* 2. How does it work? */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-cyan-400 mb-4">
            <Lightbulb className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">How does it work?</h2>
          </div>
          <div className="space-y-3.5">
            {topic.howItWorks.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Common Warning Signs */}
        <section className="mb-10 rounded-2xl border border-amber-900/40 bg-[#0F161A] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-amber-400 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">Common Warning Signs</h2>
          </div>
          <ul className="space-y-3">
            {topic.warningSigns.map((sign, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{sign}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Example Scenario */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-[#081220] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-cyan-400 mb-4">
            <FileText className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">Real-World Case Scenario</h2>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-[#040810] p-5 mb-4">
            <h3 className="text-sm font-bold text-cyan-300 mb-2">
              Case: {topic.exampleScenario.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              <strong className="text-slate-200">Incident Context:</strong> {topic.exampleScenario.context}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              <strong className="text-slate-200">Attacker Method:</strong> {topic.exampleScenario.attackerMethod}
            </p>
            <p className="text-xs text-emerald-300 leading-relaxed">
              <strong className="text-slate-200">Resolution & Outcome:</strong> {topic.exampleScenario.impact}
            </p>
          </div>
        </section>

        {/* 5. How to protect yourself */}
        <section className="mb-12 rounded-2xl border border-emerald-900/50 bg-[#071618] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-emerald-400 mb-4">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">How to Protect Yourself</h2>
          </div>
          <div className="space-y-3">
            {topic.protectionTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prev / Next Topic Navigation */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevTopic ? (
            <Link
              to={`/learn/${prevTopic.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-slate-300 px-4 py-2.5 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous: {prevTopic.title}</span>
            </Link>
          ) : (
            <Link
              to="/learn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-slate-400 px-4 py-2.5 text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Topics</span>
            </Link>
          )}

          {nextTopic ? (
            <Link
              to={`/learn/${nextTopic.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-cyan-950"
            >
              <span>Next: {nextTopic.title}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/detect"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-cyan-950"
            >
              <span>Proceed to Detection Simulator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
