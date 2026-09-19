import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Search,
  HelpCircle,
  Award,
  ShieldAlert,
  Info,
  Sparkles,
  Zap,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const location = useLocation();

  // Navigation items with semantic cyber icons
  const navLinks: NavItem[] = [
    { name: 'Home', path: '/', icon: ShieldCheck, description: 'Overview & Metrics' },
    { name: 'Learn', path: '/learn', icon: BookOpen, description: 'Threat Knowledgebase' },
    { name: 'Detect', path: '/detect', icon: Search, description: 'Interactive Scenarios' },
    { name: 'Quiz', path: '/quiz', icon: HelpCircle, description: 'Test Cyber Instincts' },
    { name: 'Results', path: '/results', icon: Award, description: 'Certificates & Scores' },
    { name: 'Safety', path: '/safety', icon: ShieldAlert, description: 'Emergency Checklist' },
    { name: 'About', path: '/about', icon: Info, description: 'CEP Initiative Mission' },
  ];

  // Track scroll position for dynamic glassmorphic elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        id="main-header"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#050B14]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
            : 'bg-[#050B14]/75 backdrop-blur-lg border-b border-cyan-900/30'
        }`}
      >
        {/* Subtle animated neon border accent at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo with animated hover */}
          <Link
            id="brand-logo-link"
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B14] rounded-xl py-1 px-1.5 -ml-1.5 transition-all"
          >
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.45)]">
                <ShieldCheck className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              {/* Pulsing online cyber beacon */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 border border-[#050B14]"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Cyber<span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">Aware</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-1 hidden sm:flex">
                <span className="text-[10px] tracking-wider uppercase text-cyan-400/80 font-semibold">
                  CEP Community
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-[10px] text-slate-400 font-normal">Extension</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation with Animated Sliding Indicator */}
          <nav
            id="desktop-nav"
            aria-label="Main Navigation"
            className="hidden md:flex items-center p-1 rounded-full bg-[#081220]/70 border border-slate-800/80 backdrop-blur-md shadow-inner"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className={({ isActive: active }) =>
                    `relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 flex items-center gap-1.5 ${
                      active ? 'text-cyan-200' : 'text-slate-300 hover:text-white'
                    }`
                  }
                >
                  {/* Sliding Active Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-950/90 to-teal-950/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover Floating Glow Highlight */}
                  {hoveredPath === link.path && !isActive && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      className="absolute inset-0 rounded-full bg-slate-800/50 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}

                  <Icon className={`h-3.5 w-3.5 transition-transform duration-200 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>

                  {link.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono scale-90">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Action Button & Animated Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Direct CTA with cyber shine */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                id="nav-quiz-cta"
                to="/quiz"
                className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-[#050B14] px-4 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Take Quiz</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Modern Animated Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              type="button"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden relative z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-[#081220]/90 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-800/80 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 touch-manipulation transition-all"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="w-full h-0.5 bg-current rounded-full origin-center"
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-0.5 bg-current rounded-full"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="w-full h-0.5 bg-current rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Animated Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Container */}
            <motion.div
              id="mobile-menu-overlay"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 left-0 right-0 max-h-[calc(100dvh-4rem)] z-50 bg-[#060D18]/95 border-b border-cyan-900/40 px-4 py-5 flex flex-col justify-between overflow-y-auto overscroll-contain backdrop-blur-2xl shadow-2xl md:hidden"
            >
              {/* Header inside drawer */}
              <div className="space-y-2">
                <div className="px-2 pb-2.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between border-b border-slate-800/80 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-cyan-400" />
                    CyberAware Explorer
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">College Extension Project</span>
                </div>

                {/* Staggered Navigation items */}
                <div className="space-y-1.5">
                  {navLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.035, duration: 0.2 }}
                      >
                        <NavLink
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive: active }) =>
                            `flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 border ${
                              active
                                ? 'text-cyan-200 bg-cyan-950/80 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                : 'text-slate-200 bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
                            }`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                                isActive
                                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{link.name}</span>
                                {link.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                                    {link.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block">{link.description}</span>
                            </div>
                          </div>

                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-500'
                            }`}
                          />
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Drawer Bottom Actions */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3 mt-4">
                <Link
                  to="/quiz"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-[#050B14] py-3 px-4 text-center font-semibold text-sm shadow-lg shadow-cyan-950/60 active:scale-[0.98] transition-transform"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Start Cyber Awareness Quiz</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>CEP Extension Initiative</span>
                  <Link
                    to="/results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Check Certificate</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
