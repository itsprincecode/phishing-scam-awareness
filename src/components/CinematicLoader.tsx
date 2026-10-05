import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CinematicLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Total animation run time (around 2 seconds for a refined cinematic pace)
    const totalDuration = 1800;
    const intervalMs = 25;
    const increment = 100 / (totalDuration / intervalMs);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, intervalMs);

    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
    }, totalDuration + 250);

    // Optional quick dismissal on click or keypress
    const handleDismiss = () => setIsVisible(false);
    window.addEventListener('keydown', handleDismiss, { once: true });

    return () => {
      clearInterval(timer);
      clearTimeout(dismissTimer);
      window.removeEventListener('keydown', handleDismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(10px)',
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#080C07] select-none pointer-events-auto overflow-hidden cursor-default"
        >
          {/* Ambient Cinematic Horizon Light Beam */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.38, 0.25], scale: [0.95, 1.05, 1] }}
              transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
              className="w-[500px] sm:w-[750px] h-[250px] bg-[radial-gradient(ellipse_at_center,_rgba(180,244,55,0.14)_0%,_rgba(180,244,55,0.03)_45%,_transparent_70%)] blur-3xl"
            />
          </div>

          {/* Anamorphic Light Streak */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 0.25, 0.12], scaleX: [0.2, 1, 0.9] }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#B4F437]/30 to-transparent pointer-events-none"
          />

          {/* Main Cinematic Content: Website Name & Modern Loading Animation */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Website Name ONLY - Pure typography, no icons */}
            <motion.div
              initial={{ opacity: 0, y: 18, letterSpacing: '0.18em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.28em' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden py-2 px-6 text-center"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-[0.28em] text-white">
                <span className="text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
                  Cyber
                </span>
                <span className="text-[#B4F437] drop-shadow-[0_0_30px_rgba(180,244,55,0.7)]">
                  Aware
                </span>
              </h1>

              {/* Cinematic light sweep across the website name */}
              <motion.div
                initial={{ x: '-150%' }}
                animate={{ x: '150%' }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                  repeatDelay: 0.4,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none -skew-x-12"
              />
            </motion.div>

            {/* Modern Loading Animation Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col items-center"
            >
              {/* Ultra-slim laser progress track */}
              <div className="relative w-48 sm:w-64 md:w-72 h-[2px] bg-neutral-900 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                {/* Active progress fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-lime-500 via-[#B4F437] to-emerald-400 shadow-[0_0_12px_rgba(180,244,55,0.9)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />

                {/* Laser energy pulse sweeping through */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
                />
              </div>

              {/* Soft ambient ground glow reflecting the progress bar */}
              <div
                className="w-32 sm:w-44 h-2 mt-1 bg-[#B4F437]/20 blur-md rounded-full transition-opacity duration-300"
                style={{ opacity: progress > 10 ? 0.8 : 0.2 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
