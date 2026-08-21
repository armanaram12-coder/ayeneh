'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#6B46C1] via-[#7C3AED] to-[#8B5CF6]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* Glow Effect Behind Mirror */}
            <motion.div
              className="absolute w-64 h-64 rounded-full bg-white/20 blur-3xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />

            {/* Mirror Icon */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
              >
                {/* Mirror Frame */}
                <ellipse
                  cx="12"
                  cy="10"
                  rx="7"
                  ry="8"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="rgba(255,255,255,0.1)"
                />
                {/* Mirror Handle */}
                <path
                  d="M12 18v4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Mirror Shine */}
                <motion.path
                  d="M9 7 Q12 10 15 7"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </svg>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              className="absolute z-10 mt-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h1
                className="text-5xl font-bold text-white tracking-wider"
                style={{ fontFamily: 'Vazirmatn, sans-serif' }}
              >
                آینه
              </h1>
            </motion.div>

            {/* Subtle Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!showSplash && children}
    </>
  );
}
