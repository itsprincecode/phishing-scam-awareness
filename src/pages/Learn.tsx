import React, { useState } from 'react';
import { Shield, Search, BookOpen, ArrowRight } from 'lucide-react';
import { learningTopics } from '../data/learningTopics';
import { TopicCard } from '../components/TopicCard';
import { Link } from 'react-router-dom';

export const Learn: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All 9 Topics' },
    { id: 'messaging', label: 'Phishing & Links' },
    { id: 'fraud', label: 'Banking & OTP Fraud' },
    { id: 'student', label: 'Internships & Social Media' },
  ];

  const filteredTopics = learningTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'messaging') {
      return ['phishing', 'malicious-links', 'fake-websites'].includes(topic.id);
    }
    if (selectedCategory === 'fraud') {
      return ['online-scams', 'digital-fraud', 'otp-banking-scams'].includes(topic.id);
    }
    if (selectedCategory === 'student') {
      return ['social-engineering', 'job-internship-scams', 'social-media-scams'].includes(topic.id);
    }
    return true;
  });

  return (
    <div className="relative z-10 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#B4F437]/30 bg-[#162013] px-3 py-1 text-xs font-bold text-[#B4F437] mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Cybersecurity Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Learn Cyber Threat Patterns
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-200 leading-relaxed font-normal">
            Understand how modern digital fraudsters, impersonators, and phishing syndicates operate. Study attack anatomies, common warning signs, and defensive safeguards.
          </p>
        </div>

        {/* Filter and Search controls */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437] ${
                  selectedCategory === cat.id
                    ? 'bg-[#B4F437] text-[#080C07] shadow-sm shadow-[#B4F437]/20'
                    : 'bg-[#121811] border border-white/10 text-neutral-300 hover:text-white hover:bg-[#182216]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search threat topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0F150E] pl-9 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#B4F437] focus:outline-none focus:ring-1 focus:ring-[#B4F437] font-normal"
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, index) => (
            <TopicCard key={topic.id} topic={topic} index={index} />
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-[#0F150E] p-8">
            <Shield className="h-10 w-10 text-neutral-500 mx-auto mb-3" />
            <p className="text-base font-bold text-white">No matching topics found</p>
            <p className="text-xs text-neutral-400 mt-1">Try another search keyword or clear filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#B4F437]/20 border border-[#B4F437]/40 text-[#B4F437] text-xs font-bold hover:bg-[#B4F437]/30"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Interconnected Link to Next Module */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-[#0F150E] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white">
              Ready to test your detection instincts?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-normal">
              Apply what you've learned in our interactive Phishing & Scam Simulator.
            </p>
          </div>
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-6 py-3 text-xs sm:text-sm font-bold transition-all shadow-[0_0_20px_rgba(180,244,55,0.25)] shrink-0"
          >
            <span>Try Detection Simulator</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
