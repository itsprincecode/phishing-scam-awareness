import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileText,
  Clock,
  CheckCircle2,
  BookOpen,
  Youtube,
  Play,
  X,
  ExternalLink
} from 'lucide-react';
import { learningTopics } from '../data/learningTopics';
import { TopicVideo } from '../types';

export const LearnTopic: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [activeVideo, setActiveVideo] = useState<TopicVideo | null>(null);

  const currentIndex = learningTopics.findIndex((t) => t.id === topicId);
  const topic = learningTopics[currentIndex];

  if (!topic) {
    return (
      <div className="relative z-10 py-20 text-center">
        <div className="max-w-md mx-auto rounded-2xl border border-white/10 bg-[#0F150E] p-8">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Topic Not Found</h2>
          <p className="text-sm text-neutral-200 mt-2 leading-relaxed font-normal">
            The educational topic you are looking for does not exist or has moved.
          </p>
          <Link
            to="/learn"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#B4F437] text-[#080C07] px-4 py-2 text-xs font-bold shadow-md shadow-[#B4F437]/20 hover:bg-[#C6F756] transition-all"
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
    <div className="relative z-10 py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb with Home and Learn links */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link to="/" className="hover:text-[#B4F437] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/learn" className="hover:text-[#B4F437] transition-colors">
              Learn Hub
            </Link>
            <span>/</span>
            <span className="text-[#B4F437] truncate max-w-[180px] sm:max-w-none">
              {topic.title}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Clock className="h-3.5 w-3.5 text-[#B4F437]" />
            <span>{topic.readTime}</span>
          </div>
        </div>

        {/* Topic Title Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B4F437] bg-[#162013] px-3 py-1 rounded-md border border-[#B4F437]/30">
            {topic.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4 mb-4">
            {topic.title}
          </h1>
          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-normal">
            {topic.shortDesc}
          </p>
        </div>

        {/* ================================================================= */}
        {/* TOP OF TOPIC DESCRIPTION: RELATED YOUTUBE VIDEOS                  */}
        {/* Only shows thumbnail, title, and channel name (workable sources)  */}
        {/* ================================================================= */}
        {topic.videos && topic.videos.length > 0 && (
          <section
            id="topic-videos-section"
            className="mb-10 rounded-2xl border border-white/15 bg-gradient-to-b from-[#111A0F] to-[#0D150C] p-6 sm:p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5 text-[#B4F437]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
                  <Youtube className="h-4 w-4 fill-red-500 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Video Lessons & Explanations
                </h2>
              </div>

              <span className="text-xs font-semibold text-[#B4F437] bg-[#162013] px-2.5 py-0.5 rounded border border-[#B4F437]/30">
                {topic.videos.length} Videos Available
              </span>
            </div>

            <p className="text-sm text-neutral-200 leading-relaxed font-normal mb-6">
              Watch these curated educational videos to quickly grasp {topic.title.toLowerCase()} concepts and security principles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topic.videos.map((video, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveVideo(video)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveVideo(video);
                    }
                  }}
                  className="group cursor-pointer flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#080D07] hover:border-[#B4F437]/60 hover:bg-[#10170E] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B4F437]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437]"
                >
                  {/* 1. Video Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/80">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback image if YouTube CDN is unreachable
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=640&q=80';
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/20 transition-all">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg shadow-red-600/50 group-hover:scale-110 group-hover:bg-red-600 transition-all">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Video Title & 3. Channel Name ONLY */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-white leading-snug group-hover:text-[#B4F437] transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="mt-2.5 text-xs font-semibold text-neutral-400 group-hover:text-neutral-300 transition-colors">
                      {video.channelName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 1. What is it? */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-[#0F150E] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-[#B4F437] mb-3">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">What is it?</h2>
          </div>
          <p className="text-base text-neutral-200 leading-relaxed font-normal">
            {topic.whatIsIt}
          </p>
        </section>

        {/* 2. How does it work? */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-[#0F150E] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-[#B4F437] mb-4">
            <Lightbulb className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">How does it work?</h2>
          </div>
          <div className="space-y-4">
            {topic.howItWorks.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5 text-sm sm:text-base">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#162013] text-[#B4F437] border border-[#B4F437]/40 font-mono text-xs font-bold mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-neutral-200 leading-relaxed font-normal">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Common Warning Signs */}
        <section className="mb-8 rounded-2xl border border-amber-900/30 bg-[#14120D] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-amber-400 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Common Warning Signs</h2>
          </div>
          <ul className="space-y-3.5">
            {topic.warningSigns.map((sign, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-neutral-200">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed font-normal">{sign}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Example Scenario */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-[#0F150E] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-[#B4F437] mb-4">
            <FileText className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Real-World Case Scenario</h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#080C07] p-5 sm:p-6 mb-2">
            <h3 className="text-base font-bold text-[#B4F437] mb-3">
              Case: {topic.exampleScenario.title}
            </h3>
            <p className="text-sm text-neutral-200 leading-relaxed mb-3 font-normal">
              <strong className="text-white font-semibold">Incident Context:</strong>{' '}
              {topic.exampleScenario.context}
            </p>
            <p className="text-sm text-neutral-200 leading-relaxed mb-3 font-normal">
              <strong className="text-white font-semibold">Attacker Method:</strong>{' '}
              {topic.exampleScenario.attackerMethod}
            </p>
            <p className="text-sm text-emerald-300 leading-relaxed font-normal">
              <strong className="text-white font-semibold">Resolution & Outcome:</strong>{' '}
              {topic.exampleScenario.impact}
            </p>
          </div>
        </section>

        {/* 5. How to protect yourself */}
        <section className="mb-10 rounded-2xl border border-[#B4F437]/20 bg-[#0D160C] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-[#B4F437] mb-4">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">How to Protect Yourself</h2>
          </div>
          <div className="space-y-3.5">
            {topic.protectionTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-neutral-200">
                <CheckCircle2 className="h-5 w-5 text-[#B4F437] shrink-0 mt-0.5" />
                <span className="leading-relaxed font-normal">{tip}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prev / Next Topic Navigation */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevTopic ? (
            <Link
              to={`/learn/${prevTopic.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#121811] hover:bg-[#182216] text-neutral-200 hover:text-white px-5 py-2.5 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous: {prevTopic.title}</span>
            </Link>
          ) : (
            <Link
              to="/learn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#121811] hover:bg-[#182216] text-neutral-200 hover:text-white px-5 py-2.5 text-xs font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Topics</span>
            </Link>
          )}

          {nextTopic ? (
            <Link
              to={`/learn/${nextTopic.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-6 py-2.5 text-xs font-bold transition-all shadow-[0_0_15px_rgba(180,244,55,0.25)]"
            >
              <span>Next: {nextTopic.title}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/detect"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-6 py-2.5 text-xs font-bold transition-all shadow-[0_0_15px_rgba(180,244,55,0.25)]"
            >
              <span>Proceed to Simulator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* INTERACTIVE VIDEO MODAL PLAYER (100% WORKABLE SOURCES)            */}
      {/* ================================================================= */}
      {activeVideo && (
        <div
          id="video-player-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl border border-white/15 bg-[#0B1009] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#080D07]">
              <div className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-500 fill-red-500" />
                <span className="text-xs font-bold text-neutral-300">
                  {activeVideo.channelName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activeVideo.videoUrl || `https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#B4F437] hover:text-[#C6F756] font-semibold transition-colors"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close video"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Embedded Workable Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center p-6">
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B4F437] text-[#080C07] px-6 py-3 font-bold"
                  >
                    <span>Watch Directly on YouTube</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Video Footer info */}
            <div className="p-4 sm:p-5 bg-[#080D07]">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {activeVideo.title}
              </h3>
              <p className="text-xs text-neutral-400">
                Channel: <strong className="text-neutral-200">{activeVideo.channelName}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
