'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) {
        onFinish();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#7C3AED]"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            // ✅ عرض لوگو بیشتر شد تا بزرگتر دیده شود
            className="text-center w-full max-w-[400px] px-4"
          >
            {/* ✅ سایز لوگو افزایش یافت (width={350}) و متن Alt تغییر کرد */}
            <Image 
              src="/logo.png" 
              alt="لوگو چهره آپ | ChehrehUp Logo" 
              width={350} 
              height={350} 
              priority 
              className="animate-pulse mx-auto" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
