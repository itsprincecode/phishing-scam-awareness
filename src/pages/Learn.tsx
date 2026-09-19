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
    <div className="relative z-10 py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Cybersecurity Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learn Cyber Threat Patterns
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Understand how modern digital fraudsters, impersonators, and phishing syndicates operate. Study the anatomy of attacks, common warning signs, and defensive safeguards.
          </p>
        </div>

        {/* Filter and Search controls */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-[#050B14] shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search threat topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#07111F] pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
          <div className="text-center py-16 rounded-2xl border border-slate-800 bg-[#081220] p-8">
            <Shield className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <p className="text-base font-semibold text-white">No matching topics found</p>
            <p className="text-xs text-slate-400 mt-1">Try another search keyword or clear filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Interconnected Link to Next Module */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-[#081220] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Ready to test your detection instincts?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Apply what you've learned in our interactive Phishing & Scam Simulator.
            </p>
          </div>
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-5 py-2.5 text-xs font-semibold transition-all shadow-md shadow-cyan-950 shrink-0"
          >
            <span>Try Detection Simulator</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
