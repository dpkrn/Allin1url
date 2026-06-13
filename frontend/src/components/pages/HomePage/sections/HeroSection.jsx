import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiX, FiLink, FiExternalLink } from 'react-icons/fi';
import api from '../../../../utils/api';
import { buildGoogleOAuthUrl } from '../../../../utils/urlConfig';
import toast from 'react-hot-toast';

const PREVIEW_PLATFORMS = [
  { name: "linkedin", label: "LinkedIn", color: "text-blue-400" },
  { name: "github", label: "GitHub", color: "text-slate-300" },
  { name: "instagram", label: "Instagram", color: "text-pink-400" },
  { name: "portfolio", label: "Portfolio", color: "text-violet-400" },
  { name: "leetcode", label: "LeetCode", color: "text-orange-400" },
];

const HeroSection = ({
  words = [],
  flipWords = [],
  description = "",
  highlightText = "",
  ctaText = "Claim your free domain",
  ctaAction = null,
  platforms = [],
  showScrollIndicator = true,
  className = "",
  isAuthenticated = false,
}) => {
  const [username, setUsername] = React.useState("");
  const [isAvailable, setAvailable] = React.useState(false);
  const [checking, setChecking] = React.useState(false);

  const checkAvailablity = async (usrnm) => {
    if (usrnm.length < 5) { setAvailable(false); return; }
    setChecking(true);
    try {
      const res = await api.post("/auth/checkavailablity", { username: usrnm });
      setAvailable(res.status === 200 && res.data.success);
    } catch {
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

  const displayName = username.length >= 1 ? username : "yourname";

  return (
    <section className={`relative min-h-screen flex flex-col justify-center overflow-hidden ${!isAuthenticated ? 'pt-16 -mt-10' : ''} ${className}`}>

      {/* Background */}
      <div className="absolute inset-0 bg-white dark:bg-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,92,246,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Main content — same container as the rest of the page */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-20">

          {/* ── Left: copy + CTA ── */}
          <div className="flex-1 w-full text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 rounded-full text-xs font-semibold border border-violet-100 dark:border-violet-900/50 mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              AllIn1URL – Link in Bio Platform · Free forever
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5"
            >
              All your links,
              <br />
              <span className="text-violet-600 dark:text-violet-400">one free domain.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              AllIn1URL helps creators, developers, founders and professionals manage their online presence. Create your professional profile at allin1url.in — one free subdomain, every platform.
            </motion.p>

            {/* Username input */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4"
            >
              <div className="flex items-center max-w-sm mx-auto lg:mx-0 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus-within:border-violet-500 dark:focus-within:border-violet-500 transition-colors">
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
                    setUsername(val);
                    if (val.length >= 5) checkAvailablity(val.toLowerCase());
                    else setAvailable(false);
                  }}
                  placeholder="yourname"
                  className="flex-1 pl-5 py-4 bg-transparent text-slate-900 dark:text-white text-base sm:text-lg font-bold placeholder:text-slate-400 placeholder:font-normal focus:outline-none min-w-0"
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="flex items-center gap-2 px-4 flex-shrink-0">
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">.allin1url.in</span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    {username.length >= 5 && (
                      checking ? (
                        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      ) : isAvailable ? (
                        <FiCheck className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500" />
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="h-5 mt-2">
                {username.length >= 5 && !checking && (
                  <p className={`text-xs ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {isAvailable
                      ? `✓ ${username}.allin1url.in is available`
                      : `✗ ${username}.allin1url.in is already taken`}
                  </p>
                )}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10"
            >
              <button
                onClick={handleCtaClick}
                disabled={username.length < 5 || !isAvailable || checking}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-500 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-violet-500/20 transition-all disabled:cursor-not-allowed disabled:shadow-none"
              >
                Claim your free domain
                <FiArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2.5">
                Continues with Google · No password to create
              </p>
            </motion.div>

            {/* Platform icons */}
            {platforms.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-3">
                  Works with every platform
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5">
                  {platforms.map((platform, index) => (
                    <motion.div
                      key={platform.name || index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.06, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.15, y: -2 }}
                      className={`text-2xl ${platform.color || 'text-slate-600'} cursor-pointer transition-transform`}
                      title={platform.name}
                    >
                      {platform.icon}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right: live URL preview ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full lg:w-[440px] xl:w-[480px] flex-shrink-0"
          >
            <div className="bg-slate-900 dark:bg-slate-800/70 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-slate-900/20 dark:shadow-black/40">

              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 dark:bg-slate-900/70 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-slate-700/70 rounded-lg px-3 py-1.5 text-xs font-mono text-center">
                    <span className="text-violet-400 font-bold">{displayName}</span>
                    <span className="text-slate-400">.allin1url.in</span>
                  </div>
                </div>
              </div>

              {/* Profile header */}
              <div className="px-5 py-5 border-b border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-400">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{displayName}</p>
                    <p className="text-xs text-slate-500">{displayName}.allin1url.in</p>
                  </div>
                </div>
              </div>

              {/* Link rows */}
              <div className="p-4 space-y-2">
                {PREVIEW_PLATFORMS.map((platform, i) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-800/60 dark:bg-slate-900/40 hover:bg-slate-700/60 dark:hover:bg-slate-800/50 transition-colors group cursor-default"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FiLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-xs font-mono truncate">
                        <span className="text-violet-400 font-bold">{displayName}</span>
                        <span className="text-slate-500">.allin1url.in/</span>
                        <span className={`font-semibold ${platform.color}`}>{platform.name}</span>
                      </span>
                    </div>
                    <FiExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                  </motion.div>
                ))}
              </div>

              {/* Footer note */}
              <div className="px-5 py-3 border-t border-slate-700/40">
                <p className="text-xs text-slate-500 text-center">
                  Type your username — preview updates live ↑
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300 dark:text-slate-700">
          <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
