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
  ArrowRight,
  Home,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Navigation items matching clean site architecture with Home button
  const navLinks: NavItem[] = [
    { name: 'Home', path: '/', icon: Home, description: 'Overview & Mission' },
    { name: 'Learn', path: '/learn', icon: BookOpen, description: 'Threat Knowledgebase' },
    { name: 'Detect', path: '/detect', icon: Search, description: 'Interactive Scenarios' },
    { name: 'Quiz', path: '/quiz', icon: HelpCircle, description: 'Test Cyber Instincts' },
    { name: 'Responses', path: '/responses', icon: FileSpreadsheet, description: 'Live Form & Sheet Data' },
    { name: 'Safety', path: '/safety', icon: ShieldAlert, description: 'Emergency Checklist' },
    { name: 'Results', path: '/results', icon: Award, description: 'Certificates & Scores' },
    { name: 'About', path: '/about', icon: Info, description: 'Initiative Mission' },
  ];

  // Track scroll position for dynamic glassmorphic elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
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
            ? 'bg-[#080C07]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent border-b border-white/[0.04]'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo - Minimalist high-impact typography echoing 'Kronix' */}
          <Link
            id="brand-logo-link"
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437] rounded-lg py-1 px-1 transition-all"
          >
            {/* Subtle logo icon or monogram */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#141C12] border border-[#B4F437]/30 text-[#B4F437] shadow-[0_0_15px_rgba(180,244,55,0.2)] group-hover:border-[#B4F437] transition-all">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Cyber<span className="text-[#B4F437]">Aware</span>
              </span>
              <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-[#B4F437] animate-pulse" />
            </div>
          </Link>

          {/* Desktop Navigation - Clean, unboxed text links like 'Process Benefits Services Portfolio FAQ' */}
          <nav
            id="desktop-nav"
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 lg:gap-8"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive: active }) =>
                    `relative py-1 text-sm font-medium tracking-normal transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437] rounded ${
                      active
                        ? 'text-white font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B4F437] shadow-[0_0_8px_rgba(180,244,55,0.8)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Action Button & Animated Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Right CTA Button - Vibrant Neon Lime button linking to Learn (Step 1) */}
            <Link
              id="nav-quiz-cta"
              to="/learn"
              className="hidden sm:inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-5 py-2.5 text-sm font-bold shadow-[0_0_20px_rgba(180,244,55,0.25)] hover:shadow-[0_0_28px_rgba(180,244,55,0.45)] transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437]"
            >
              <span>Get Started</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              type="button"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden relative z-50 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#121812]/90 text-neutral-300 hover:text-white hover:border-[#B4F437]/50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437] transition-all"
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
              className="fixed inset-0 top-20 z-40 bg-black/75 backdrop-blur-md md:hidden"
            />

            {/* Drawer Container */}
            <motion.div
              id="mobile-menu-overlay"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-0 right-0 max-h-[calc(100dvh-5rem)] z-50 bg-[#0B1009]/95 border-b border-[#B4F437]/20 px-5 py-6 flex flex-col justify-between overflow-y-auto overscroll-contain backdrop-blur-2xl shadow-2xl md:hidden"
            >
              <div className="space-y-3">
                <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#B4F437] flex items-center justify-between border-b border-white/10 mb-2">
                  <span>Navigation Menu</span>
                  <span className="text-[10px] text-neutral-400 font-normal">CyberAware</span>
                </div>

                {/* Staggered Navigation items */}
                <div className="space-y-2">
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
                          end={link.path === '/'}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive: active }) =>
                            `flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-150 border ${
                              active
                                ? 'text-white bg-[#162013] border-[#B4F437]/40 shadow-[0_0_15px_rgba(180,244,55,0.15)] font-semibold'
                                : 'text-neutral-300 bg-[#0E150C]/60 border-white/5 hover:bg-[#141C11] hover:border-white/10'
                            }`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                                isActive
                                  ? 'bg-[#B4F437]/20 border-[#B4F437]/50 text-[#B4F437]'
                                  : 'bg-white/5 border-white/10 text-neutral-400'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <span className="text-sm block">{link.name}</span>
                              <span className="text-[11px] text-neutral-400 block font-normal">{link.description}</span>
                            </div>
                          </div>

                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isActive ? 'text-[#B4F437] translate-x-0.5' : 'text-neutral-500'
                            }`}
                          />
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Drawer Bottom Actions */}
              <div className="pt-5 border-t border-white/10 space-y-3 mt-5">
                <Link
                  to="/learn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] py-3 px-4 text-center font-bold text-sm shadow-lg shadow-[#B4F437]/20 active:scale-[0.98] transition-all"
                >
                  <span>Get Started — Start Learning</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center justify-between text-xs text-neutral-400 px-1 pt-1">
                  <span>CEP Extension Initiative</span>
                  <Link
                    to="/results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#B4F437] hover:underline flex items-center gap-1 font-medium"
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
