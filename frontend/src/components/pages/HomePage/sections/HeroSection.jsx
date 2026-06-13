import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TypewriterEffect } from '../../../ui/typewriter-effect';
import { FlipWords } from '../../../ui/flip-words';
import { FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import api from '../../../../utils/api';
import { buildGoogleOAuthUrl } from '../../../../utils/urlConfig';
import toast from 'react-hot-toast';

const HeroSection = ({
  words = [],
  flipWords = [],
  description = "",
  highlightText = "",
  ctaText = "Start with your username",
  ctaAction = null,
  platforms = [],
  showScrollIndicator = true,
  className = "",
  isAuthenticated = false,
}) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const [username, setUsername] = React.useState("");
  const [isAvailable, setAvailable] = React.useState(false);
  const [checking, setChecking] = React.useState(false);

  const checkAvailablity = async (usrnm) => {
    if (usrnm.length < 5) { setAvailable(false); return; }
    setChecking(true);
    try {
      const res = await api.post("/auth/checkavailablity", { username: usrnm });
      setAvailable(res.status === 200 && res.data.success);
    } catch (err) {
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleCtaClick = () => {
    if (ctaAction) { ctaAction(); return; }
    if (!username || username.length < 5) { toast.error("Please enter a valid username (min 5 characters)"); return; }
    if (!isAvailable) { toast.error("Username is not available. Please choose another one."); return; }
    try {
      window.location.href = buildGoogleOAuthUrl({ username: username.toLowerCase(), usertype: "onboarding" });
    } catch (err) {
      toast.error(err.message || "Google sign-up is unavailable");
    }
  };

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity }}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${!isAuthenticated ? 'pt-16' : ''} ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.08),transparent)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Main heading */}
          {words.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <TypewriterEffect words={words} className="mb-4" />
            </motion.div>
          )}

          {/* Flip words subheading */}
          {flipWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-700 dark:text-slate-300"
            >
              Create personalized links for your{' '}
              <span className="inline-block">
                <FlipWords words={flipWords} duration={100} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 dark:text-violet-400" />
              </span>
            </motion.div>
          )}

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              {description}
              {highlightText && (
                <>
                  <br />
                  <span className="font-semibold text-violet-600 dark:text-violet-400 mt-1 block">{highlightText}</span>
                </>
              )}
            </motion.p>
          )}

          {/* Username CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col items-center gap-4 mt-8"
          >
            {/* URL input row */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">https://</span>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
                    setUsername(val);
                    if (val.length >= 5) checkAvailablity(val.toLowerCase());
                    else setAvailable(false);
                  }}
                  placeholder="username"
                  className="w-32 sm:w-40 px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm sm:text-base font-semibold placeholder:text-slate-400 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 transition-colors"
                  autoComplete="off"
                  spellCheck="false"
                />
                {username.length >= 5 && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {checking ? (
                      <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    ) : isAvailable ? (
                      <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <FiX className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </span>
                )}
              </div>
              <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">.allin1url.in/</span>
            </div>

            {/* Availability hint */}
            {username.length >= 5 && (
              <p className={`text-xs sm:text-sm ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {isAvailable ? '✓ Username available' : '✗ Username not available'}
              </p>
            )}

            {/* CTA button */}
            <button
              onClick={handleCtaClick}
              disabled={username.length < 5 || !isAvailable || checking}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all disabled:cursor-not-allowed disabled:shadow-none"
            >
              Get your free domain
              <FiArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Get your own domain <strong className="text-slate-700 dark:text-slate-300">FREE</strong> · No credit card required
            </p>
          </motion.div>

          {/* Platforms */}
          {platforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-14"
            >
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">Works with all your platforms</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name || index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.08, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.15 }}
                    className={`text-2xl sm:text-3xl ${platform.color || 'text-slate-600'} cursor-pointer transition-transform`}
                    title={platform.name}
                  >
                    {platform.icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, repeat: Infinity, repeatType: "reverse", duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-9 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2.5 bg-slate-400 dark:bg-slate-600 rounded-full mt-1.5"
            />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default HeroSection;
