import React, { useRef } from 'react';
import toast from 'react-hot-toast';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TypewriterEffect } from '../../../ui/typewriter-effect';
import { FlipWords } from '../../../ui/flip-words';
import { FaArrowRight } from 'react-icons/fa';
import api from '../../../../utils/api';

const HeroSection = ({
  words = [],
  flipWords = [],
  description = "",
  highlightText = "",
  ctaText = "Start with your username",
  ctaAction = null,
  // Removed secondaryCtaText and secondaryCtaAction
  platforms = [],
  showScrollIndicator = true,
  className = "",
  mousePosition = { x: 0, y: 0 },
  isAuthenticated = false
}) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Google signup logic (copied from AuthPageV1)
  const handleSignUp = async (usr) => {
    let uname = usr;
    if (typeof usr === 'object' && usr !== null) {
      uname = username;
    }
    if (!uname || uname.length < 5) {
      toast.error("Please enter a valid username (min 5 characters)");
      return;
    }
    if (!isAvailable) {
      toast.error("Username is not available. Please choose another one.");
      return;
    }
    const params = new URLSearchParams({
      client_id: import.meta.env?.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: "https://clickly.cv/auth/google",
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
      state: btoa(JSON.stringify({ username: uname, usertype: "onboarding" }))
    });
    window.location.href =
      "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
  };

  const handleCtaClick = (usernameValue) => {
    if (ctaAction) {
      ctaAction();
    } else {
      handleSignUp(usernameValue || username);
    }
  };

  const handleSecondaryCtaClick = () => {
    if (secondaryCtaAction) {
      secondaryCtaAction();
    } else {
      navigate('/doc');
    }
  };

  const [username, setUsername] = React.useState("");
  const [isAvailable, setAvailable] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipTimeoutRef = React.useRef(null);

  // Username availability check (copied logic from AuthPageV1)
  const checkAvailablity = async (usrnm) => {
    if (usrnm.length < 5) {
      setAvailable(false);
      return;
    }
    setChecking(true);
    try {
      const res = await api.post("/auth/checkavailablity", { username: usrnm });
      if (res.status === 209 && res.data.success) {
        setAvailable(false);
      }
      if (res.status === 200 && res.data.success) {
        setAvailable(true);
      }
    } catch (err) {
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, scale }}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${!isAuthenticated ? 'pt-16' : ''} ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-pink-50/60 to-blue-50/60 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-blue-500/20" />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: [
              `${mousePosition.x}% ${mousePosition.y}%`,
              `${Math.min(mousePosition.x * 1.1, 100)}% ${Math.min(mousePosition.y * 1.1, 100)}%`,
            ],
          }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.08), transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center space-y-6 sm:space-y-7 md:space-y-8">
          {/* Main Heading with Typewriter */}
          {words.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <TypewriterEffect words={words} className="mb-6" />
            </motion.div>
          )}

          {/* Subheading with Flip Words */}
          {flipWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 dark:text-gray-300 mb-3 sm:mb-4 px-4"
            >
              Create personalized links for your{' '}
              <span className="inline-block">
                <FlipWords words={flipWords} duration={100} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold" />
              </span>
            </motion.div>
          )}

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4"
            >
              {description}
              {highlightText && (
                <>
                  <br />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-purple-600 dark:text-purple-400">
                    {highlightText}
                  </span>
                </>
              )}
            </motion.p>
          )}

          {/* Username Input and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col gap-4 justify-center items-center mt-10 group relative"
            tabIndex={0}
            onMouseEnter={() => {
              if (username.length === 0) {
                setShowTooltip(true);
                if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 2000);
              }
            }}
            onMouseLeave={() => {
              setShowTooltip(false);
              if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
            }}
          >
            {/* Tooltip as toast-like message */}
            {showTooltip && username.length === 0 && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-200">
                <div className="bg-purple-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg font-semibold whitespace-nowrap animate-fade-in">
                  Always choose easy and memorable username
                </div>
              </div>
            )}
            <div className="flex flex-row flex-nowrap gap-1 sm:gap-2 items-center w-full max-w-full px-4 sm:px-0 justify-center">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap flex-shrink-0">https://</span>
              <div className="relative flex-shrink-0 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] w-auto sm:w-36 md:w-44 max-w-[120px] sm:max-w-none">
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
                    setUsername(val);
                    if (val.length >= 5) {
                      checkAvailablity(val.toLowerCase());
                    } else {
                      setAvailable(false);
                    }
                  }}
                  placeholder="username"
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm md:text-base lg:text-lg font-semibold placeholder-gray-400 dark:placeholder-gray-500 hover:border-purple-400 dark:hover:border-purple-400"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap flex-shrink-0">.clickly.cv/</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCtaClick(username)}
              disabled={username.length < 5 || !isAvailable || checking}
              className="group relative px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base md:text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start with your username
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            {username.length >= 5 && (
              <p className={`mt-2 text-xs sm:text-sm ml-1 transition-all duration-300 ${isAvailable ? "text-green-400" : "text-red-400"}`}>
                {isAvailable ? "✓ Username is available" : "✗ Username is not available"}
              </p>
            )}
            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 mt-2 px-4 text-center">Get your own domain <strong>FREE</strong> to manage your links</p>
            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 mt-1 font-semibold px-4 text-center">That will reflect your brand identity ✨</p>
          </motion.div>

          {/* Platform Icons */}
          {platforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-16"
            >
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 px-4">Works with all platforms</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 px-4">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name || index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${platform.color || 'text-gray-600'} cursor-pointer hover:drop-shadow-lg transition-all`}
                  >
                    {platform.icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, repeat: Infinity, repeatType: "reverse", duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-purple-600 dark:border-purple-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-purple-600 dark:bg-purple-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default HeroSection;

