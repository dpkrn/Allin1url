import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaRocket, FaLink } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const Content = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[40vh] md:min-h-[50vh] overflow-hidden"
    >
      {/* Interactive Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.7 - 200,
            y: mousePosition.y * 0.7 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[40vh] md:min-h-[50vh] px-4 py-12 md:py-16">
        {/* Floating Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-8 left-8 md:left-16 text-purple-500/40 dark:text-purple-400/30"
        >
          <FaLink className="w-8 h-8 md:w-12 md:h-12 animate-pulse" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute top-8 right-8 md:right-16 text-pink-500/40 dark:text-pink-400/30"
        >
          <HiSparkles className="w-8 h-8 md:w-12 md:h-12 animate-pulse" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute bottom-8 left-12 md:left-24 text-blue-500/40 dark:text-blue-400/30"
        >
          <FaRocket className="w-6 h-6 md:w-10 md:h-10 animate-pulse" />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center space-y-4 md:space-y-6"
        >
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-montserrat">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                All in1 url
              </span>
            </h1>
            {/* Glowing effect behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 blur-2xl -z-10" />
          </motion.div>

          {/* Tagline 1 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl lg:text-3xl font-light text-gray-700 dark:text-gray-300 tracking-wide"
          >
            Generate Links You'll{' '}
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
              Never Forget
            </span>
          </motion.p>

          {/* Tagline 2 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm md:text-lg lg:text-xl font-extralight text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4"
          >
            Turn Your Username Into{' '}
            <span className="font-medium text-purple-600 dark:text-purple-300">Smart Links</span> - Quick and Simple!
          </motion.p>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
            className="flex items-center justify-center gap-2 mt-6 md:mt-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"
            />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-600 dark:via-pink-400 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Content;
