import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaRocket, 
  FaLink, 
  FaChartLine, 
  FaSyncAlt, 
  FaUsers,
  FaClock,
  FaEnvelope,
  FaCheckCircle,
  FaBriefcase,
  FaUserTie,
  FaCode,
  FaGraduationCap,
  FaCog,
  FaServer,
  FaHome,
  FaShieldAlt,
  FaLock
} from 'react-icons/fa';
import { 
  SiLinkedin, 
  SiGithub, 
  SiInstagram, 
  SiFacebook,
  SiLeetcode,
  SiYoutube,
  SiX
} from 'react-icons/si';
import Footer from '../../footer/Footer';
import logo from '../../../assets/logo.png';
import { FlipWords } from '../../ui/flip-words';
import {
  HeroSection,
  StatisticsSection,
  CTASection,
  ComparisonTable,
  FeaturesSection
} from './sections';

// 3D Card Component with Magnetic Hover
const MagneticCard = ({ children, className = "", intensity = 0.3 }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setRotate({ x: y * intensity, y: -x * intensity });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 30, mass: 0.5 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const statsRef = useRef(null);
  // Ref to store latest mouse position, avoiding stale closure values in RAF callback
  const latestMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId = null;
    let lastUpdateTime = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e) => {
      // Always update the latest position ref immediately with current event coordinates
      // This ensures we always have the most recent position, even if RAF hasn't executed yet
      // Convert to percentages (0-100%) for proper CSS gradient positioning
      latestMousePositionRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      
      const now = Date.now();
      if (now - lastUpdateTime < throttleDelay) {
        // Throttle updates to reduce re-renders
        // If RAF is already scheduled, don't schedule another one
        // The scheduled RAF will read the latest position from the ref at execution time
        if (rafId === null) {
          // Update lastUpdateTime immediately when scheduling RAF to prevent continuous scheduling
          // This ensures subsequent mousemove events correctly see we're still throttling
          lastUpdateTime = now;
          rafId = requestAnimationFrame(() => {
            // Read latest position from ref at execution time, not from closure-captured event
            // This ensures we always use the most recent mouse position, not the position
            // from when the RAF was first scheduled
            setMousePosition({
              x: latestMousePositionRef.current.x,
              y: latestMousePositionRef.current.y,
            });
            rafId = null;
          });
        }
        return;
      }
      
      // Update immediately if throttle delay has passed
      lastUpdateTime = now;
      setMousePosition({
        x: latestMousePositionRef.current.x,
        y: latestMousePositionRef.current.y,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, []);

  const words = [
    {
      text: "Transform",
      className: "text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400",
    },
    {
      text: "Your",
      className: "text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-gray-200",
    },
    {
      text: "Social",
      className: "text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-gray-200",
    },
    {
      text: "Presence",
      className: "text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400",
    },
  ];

  const flipWords = ["LinkedIn", "GitHub", "Instagram", "Portfolio", "YouTube", "Twitter"];

  const platformsForFlip = [
    "linkedin",
    "github",
    "leetcode",
    "portfolio",
    "instagram",
    "codeforce",
  ];

  const exampleLinks = [
    {
      platform: "LinkedIn",
      url: "https://dpkrn.clickly.cv/linkedin",
      color: "from-blue-500 to-cyan-500",
    },
    {
      platform: "GitHub",
      url: "https://dpkrn.clickly.cv/github",
      color: "from-gray-600 to-gray-800",
    },
    {
      platform: "LeetCode",
      url: "https://dpkrn.clickly.cv/leetcode",
      color: "from-orange-500 to-yellow-500",
    },
    {
      platform: "Portfolio",
      url: "https://dpkrn.clickly.cv/portfolio",
      color: "from-purple-500 to-pink-500",
    },
    {
      platform: "Instagram",
      url: "https://dpkrn.clickly.cv/instagram",
      color: "from-pink-500 to-rose-500",
    },
    {
      platform: "Codeforces",
      url: "https://dpkrn.clickly.cv/codeforces",
      color: "from-red-500 to-orange-500",
    },
  ];

  const useCases = [
    {
      title: "Job Seekers",
      desc: "Create professional links for your resume, LinkedIn, portfolio, and GitHub. Share one memorable link with recruiters. Track which platforms recruiters visit most with detailed analytics including location, device, browser, and referrer insights to optimize your job search strategy.",
      icon: FaBriefcase,
      gradient: "from-blue-500 to-cyan-500",
      examples: [
        "Resume sharing",
        "Interview preparation",
        "Professional networking",
      ],
    },
    {
      title: "Content Creators",
      desc: "Manage all your social media profiles from one place. Share your LinkBridger link in bio and watch engagement grow. Track which platforms drive the most traffic with comprehensive analytics including device, browser, OS, and referrer insights.",
      icon: FaUserTie,
      gradient: "from-purple-500 to-pink-500",
      examples: [
        "Instagram bio links",
        "YouTube descriptions",
        "TikTok profiles",
      ],
    },
    {
      title: "Developers",
      desc: "Showcase your GitHub, portfolio, blog, and coding profiles. Perfect for developer portfolios and tech resumes. Analyze click patterns with detailed analytics including hourly distribution, day-of-week analysis, and referrer tracking to optimize your professional presence.",
      icon: FaCode,
      gradient: "from-green-500 to-emerald-500",
      examples: [
        "Portfolio websites",
        "GitHub profiles",
        "Tech blogs",
      ],
    },
    {
      title: "Students",
      desc: "Share academic profiles, LinkedIn, research papers, and project portfolios. Great for college applications and networking.",
      icon: FaGraduationCap,
      gradient: "from-orange-500 to-red-500",
      examples: [
        "College applications",
        "Academic networking",
        "Project showcases",
      ],
    },
    {
      title: "Businesses",
      desc: "Create branded links for your company's social media presence. Manage multiple team member profiles efficiently.",
      icon: FaUsers,
      gradient: "from-indigo-500 to-purple-500",
      examples: [
        "Team profiles",
        "Brand consistency",
        "Social media management",
      ],
    },
    {
      title: "Freelancers",
      desc: "Consolidate your work samples, client testimonials, and contact information in one professional link.",
      icon: FaRocket,
      gradient: "from-pink-500 to-rose-500",
      examples: [
        "Client proposals",
        "Portfolio sharing",
        "Service showcases",
      ],
    },
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Create an Account",
      desc: "Sign up using your email and create an account on LinkBridger.",
      icon: FaRocket,
    },
    {
      step: "2",
      title: "Choose a Username",
      desc: "Pick a username that's easy to remember (e.g., dpkrn). Your link will follow this format: https://your-username.clickly.cv/instagram.",
      icon: FaLink,
    },
    {
      step: "3",
      title: "Verify Your Account",
      desc: "Complete email verification to activate your account.",
      icon: FaCheckCircle,
    },
    {
      step: "4",
      title: "Create a New Link",
      desc: "Enter the platform name (e.g., Instagram, LinkedIn) in lowercase. Paste your profile URL in the 'Destination URL' field. Click 'Create Link' to generate your personalized link.",
      icon: FaCog,
    },
    {
      step: "5",
      title: "Share the Link",
      desc: "Copy and share your smart link across various platforms. Share your hub link (https://yourname.clickly.cv) to let visitors see all your profiles in one place.",
      icon: FaSyncAlt,
    },
    {
      step: "6",
      title: "Get Real-Time Notifications",
      desc: "Receive instant email notifications every time someone visits your links. Customize notification preferences (link clicks, profile views, weekly reports) to stay informed about engagement in real-time.",
      icon: FaEnvelope,
    },
    {
      step: "7",
      title: "Analyze with Advanced Analytics",
      desc: "Track clicks, profile visits, location, devices, browsers, operating systems, referrers, hourly patterns, and day-of-week analysis. Use multiple chart types with customizable time ranges to understand your audience and optimize your strategy.",
      icon: FaChartLine,
    },
  ];


  const platforms = [
    { name: "LinkedIn", icon: <SiLinkedin />, color: "text-blue-600" },
    { name: "GitHub", icon: <SiGithub />, color: "text-gray-800 dark:text-gray-200" },
    { name: "Instagram", icon: <SiInstagram />, color: "text-pink-600" },
    { name: "Facebook", icon: <SiFacebook />, color: "text-blue-700" },
    { name: "LeetCode", icon: <SiLeetcode />, color: "text-orange-600" },
    { name: "YouTube", icon: <SiYoutube />, color: "text-red-600" },
    { name: "Twitter", icon: <SiX />, color: "text-blue-400" },
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Active Users", icon: <FaUsers /> },
    { value: 50000, suffix: "+", label: "Links Created", icon: <FaLink /> },
    { value: 1000000, suffix: "+", label: "Clicks Tracked", icon: <FaChartLine /> },
    { value: 99, suffix: "%", label: "Uptime", icon: <FaClock /> },
  ];

  const features = [
    {
      icon: FaLink,
      title: "Personalized Smart Links",
      description: "Generate easy-to-remember links for your social profiles using your username and platform names.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      icon: FaHome,
      title: "All Links at One Place",
      description: "Access all your profiles with a single hub link. Visit your domain (without any platform name) to see all your links in one beautiful, organized page.",
      color: "from-violet-500 to-purple-500",
      delay: 0.2
    },
    {
      icon: FaSyncAlt,
      title: "Centralized Link Management",
      description: "Update your social profile links in one place, and the change reflects everywhere. No more hunting down old links across multiple platforms.",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: FaEnvelope,
      title: "Real-Time Email Notifications",
      description: "Get instant email notifications every time someone visits your links. Customize notification preferences (link clicks, profile views, weekly reports) to stay informed about engagement in real-time.",
      color: "from-cyan-500 to-blue-500",
      delay: 0.4
    },
    {
      icon: FaServer,
      title: "Your Own Domain",
      description: "After registering, you'll get your own personalized domain to manage all your links. Your domain will reflect your brand identity and make your links more professional and memorable.",
      color: "from-teal-500 to-cyan-500",
      delay: 0.5
    },
    {
      icon: FaChartLine,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive analytics with detailed insights. Track clicks, profile visits, location (country-level), devices (Desktop/Mobile/Tablet), browsers (Chrome/Safari/Firefox/Edge), operating systems (Windows/macOS/Linux/iOS/Android), referrers (Direct/Search/Social/Internal/External), hourly patterns, day-of-week analysis, platform performance, and link-based metrics. Multiple chart types (Line, Bar, Area, Pie) with customizable time ranges (7d, 30d, 90d, 1y, all time). Summary cards with key metrics and full dark/light theme support.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.6
    },
    {
      icon: FaCog,
      title: "Responsive & Mobile-Optimized",
      description: "Fully responsive design with adaptive text sizing that works perfectly on all devices. Mobile-optimized layouts with single-row URL inputs, touch-friendly interfaces, and seamless dark/light theme support across all screen sizes.",
      color: "from-purple-500 to-pink-500",
      delay: 0.7
    },
    {
      icon: FaShieldAlt,
      title: "Enterprise-Grade Security",
      description: "JWT-based authentication with bcrypt password hashing, HTTPS encryption, Helmet.js security headers, CORS protection, secure cookie-based sessions, and password-protected private links. Your data is encrypted in transit and at rest with comprehensive privacy controls and granular visibility settings.",
      color: "from-indigo-500 to-purple-500",
      delay: 0.8
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Navigation is handled by App.jsx for all public routes */}

      {/* Hero Section */}
      <HeroSection
        words={words}
        flipWords={flipWords}
        description="LinkBridger transforms your social media presence with memorable, personalized URLs by providing your own FREE domain that will reflect your brand identity"
        highlightText="One link to rule them all. Update once, reflect everywhere."
        ctaText="Get Started Free"
        secondaryCtaText="Learn More"
        platforms={platforms}
        mousePosition={mousePosition}
        isAuthenticated={isAuthenticated}
      />

      {/* Have You Ever Wondered Section - Redesigned with Perfect Alignment */}
      <section
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto max-w-3xl">
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent px-4"
          >
            Have You Ever Wondered How Link Has Been Personalized:
          </h2>

          <MagneticCard intensity={0.15}>
            <div
              className="relative bg-gradient-to-br from-slate-800/95 via-slate-700/95 to-slate-800/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-purple-500/20 dark:border-purple-400/20 p-4 md:p-5 lg:p-6 overflow-hidden"
            >
              {/* Static Background Glow */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-40"
              />

              {/* Static Particles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-purple-400/40"
                  style={{
                    left: `${10 + (i * 7)}%`,
                    top: `${15 + (i % 4) * 25}%`,
                  }}
                />
              ))}

              <div className="relative z-10">
                {/* Example Username Badge - Top Right */}
                <div className="absolute top-0 right-0 px-2 sm:px-3">
                  <span className="text-xs sm:text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400">
                    Example username: <span className="text-purple-600 dark:text-purple-400">dpkrn</span>
                  </span>
                </div>

                {/* Base URL Display - Shown Once */}
                <div
                  className="mb-4 pb-3 border-b border-purple-500/30 dark:border-purple-400/30"
                >
                  <p className="text-xs sm:text-xs md:text-sm text-gray-400 dark:text-gray-500 mb-1.5 font-semibold uppercase tracking-wider">
                    Base URL (Same for All):
                  </p>
                  <div
                    className="flex items-center gap-1.5 sm:gap-2 flex-wrap"
                  >
                    <a
                      href="https://dpkrn.clickly.cv/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-xs md:text-sm lg:text-base font-mono font-bold text-purple-300 dark:text-purple-200 bg-purple-500/20 dark:bg-purple-500/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-purple-400/30 hover:bg-purple-500/30 dark:hover:bg-purple-500/40 hover:border-purple-400/50 transition-all duration-300 inline-block break-all"
                    >
                      https://<span className="font-bold text-purple-200 dark:text-purple-100 bg-purple-400/20 dark:bg-purple-400/30 px-0.5 sm:px-1 rounded">dpkrn</span>.clickly.cv/
                    </a>
                    <span className="text-xs sm:text-xs md:text-sm text-gray-400 dark:text-gray-500 italic">
                      (accessible for all generated link at one place)
                    </span>
                    <span
                      className="text-sm sm:text-base md:text-lg"
                    >
                      ⬇️
                    </span>
                  </div>
                </div>

                {/* Links List - Perfectly Aligned */}
                <div className="space-y-1.5 md:space-y-2">
                  {[
                    { platform: "LinkedIn", url: "https://dpkrn.clickly.cv/linkedin", color: "from-blue-500 to-cyan-500" },
                    { platform: "GitHub", url: "https://dpkrn.clickly.cv/github", color: "from-gray-400 to-gray-600" },
                    { platform: "LeetCode", url: "https://dpkrn.clickly.cv/leetcode", color: "from-orange-500 to-yellow-500" },
                    { platform: "Portfolio", url: "https://dpkrn.clickly.cv/portfolio", color: "from-purple-500 to-pink-500" },
                    { platform: "Instagram", url: "https://dpkrn.clickly.cv/instagram", color: "from-pink-500 to-rose-500" },
                    { platform: "Facebook", url: "https://dpkrn.clickly.cv/facebook", color: "from-blue-600 to-blue-700" },
                    { platform: "Codeforces", url: "https://dpkrn.clickly.cv/codeforces", color: "from-red-500 to-orange-500" },
                  ].map((link, idx) => (
                    <div
                      key={link.platform}
                      className="group relative"
                    >
                      {/* Hover Glow Effect */}
                      <motion.div
                        className={`absolute -inset-1 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-20 blur-md rounded-lg transition-opacity duration-300`}
                      />
                      
                      <div className="relative flex items-center gap-2 p-2 bg-slate-700/50 dark:bg-slate-800/50 rounded-lg border border-slate-600/50 dark:border-slate-700/50 backdrop-blur-sm group-hover:border-purple-400/50 transition-all duration-300">
                        {/* Platform Label */}
                        <motion.div
                          className="flex-shrink-0 w-16 sm:w-20 md:w-24"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-300 dark:text-gray-400">
                            {link.platform}:
                          </span>
                        </motion.div>

                        {/* Complete URL - No Space */}
                        <div className="flex items-center font-mono flex-wrap gap-0.5 sm:gap-1">
                          {/* Base URL - Static with highlighted username */}
                          <span className="text-xs sm:text-xs md:text-sm lg:text-base text-gray-400 dark:text-gray-500 select-all break-all">
                            https://<span className="font-bold text-purple-400 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-0.5 sm:px-1 rounded">dpkrn</span>.clickly.cv/
                          </span>
                          {/* Platform Name - Animated (no space before) */}
                          <motion.a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs sm:text-xs md:text-sm lg:text-base font-bold bg-gradient-to-r ${link.color} bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 inline-block`}
                            whileHover={{ 
                              scale: 1.15,
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {link.platform.toLowerCase()}
                          </motion.a>
                        </div>

                        {/* Static Arrow */}
                        <div
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="text-purple-400">→</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div
                  className="mt-5 pt-4 border-t border-purple-500/30 dark:border-purple-400/30"
                >
                  <div
                    className="flex flex-col items-center justify-center gap-2"
                  >
                   
                    <div
                      className="flex items-center justify-center gap-2"
                    >
                      <span
                        className="text-lg"
                      >
                        ✨
                      </span>
                      <a
                        href="/login"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/login');
                        }}
                        className="text-center text-sm md:text-base text-purple-300 dark:text-purple-200 font-bold hover:text-purple-200 dark:hover:text-purple-100 transition-colors underline decoration-2 underline-offset-3 decoration-purple-400/50 hover:decoration-purple-400"
                      >
                        You can create your own links: click here to start
                      </a>
                      <span
                        className="text-lg"
                      >
                        ✨
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MagneticCard>
        </div>
      </section>

      {/* Only the platform name changes Section */}
      <section
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto">
          <MagneticCard intensity={0.1}>
            <div
              className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 dark:from-purple-950/60 dark:via-pink-950/60 dark:to-blue-950/60 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-purple-500/30 dark:border-purple-400/20 p-4 sm:p-5 md:p-6 lg:p-8 overflow-hidden"
            >
              <div className="relative z-10 text-center">
                <div
                  className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
                >
                  <span
                    className="text-2xl md:text-3xl"
                  >
                    ✨
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 dark:from-purple-200 dark:via-pink-200 dark:to-blue-200 bg-clip-text text-transparent"
                  >
                    Only the platform name changes
                  </h3>
                  <span
                    className="text-2xl md:text-3xl"
                  >
                    ✨
                  </span>
                </div>
                <p
                  className="text-base md:text-lg text-gray-200 dark:text-gray-300 font-medium"
                >
                  All else remains the same
                </p>
              </div>
            </div>
          </MagneticCard>
        </div>
      </section>

      {/* It will provide a special link Section */}
      <section
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-black/5 dark:bg-black/20"
      >
        <div className="container mx-auto">
          <MagneticCard intensity={0.1}>
            <div
              className="relative bg-black dark:bg-black backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-gray-900 dark:border-gray-800 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 overflow-hidden"
            >
              <div className="relative z-10 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                <div
                  className="text-center"
                >
                  <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-2 md:py-4">
                    <span className="uppercase text-sm md:text-base lg:text-xl font-bold block">
                      It will provide a special link for all your platforms.
                    </span>
                  </div>
                </div>

                <p
                  className="text-base md:text-lg lg:text-2xl xl:text-3xl text-center"
                >
                  <a
                    href="https://dpkrn.clickly.cv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 dark:hover:text-blue-200 transition-colors break-all md:break-normal"
                  >
                    https://<span className="font-bold text-purple-400 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-1 rounded">dpkrn</span>.clickly.cv
                  </a>
                </p>

                <div
                  className="text-center"
                >
                  <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-2 md:py-4">
                    <span className="uppercase text-sm md:text-base lg:text-xl font-bold block">
                      Change only the platform name to redirect to all profiles
                    </span>
                  </div>
                </div>

                <div
                  className="text-base md:text-lg lg:text-2xl xl:text-3xl text-center"
                >
                  <a
                    href="https://dpkrn.clickly.cv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 dark:hover:text-blue-200 transition-colors break-all md:break-normal"
                  >
                    https://<span className="font-bold text-purple-400 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-1 rounded">dpkrn</span>.clickly.cv/
                    <FlipWords
                    duration={100}
                      className="text-blue-400 dark:text-blue-300"
                      words={platformsForFlip}
                    />
                  </a>
                </div>
              </div>
            </div>
          </MagneticCard>
        </div>
      </section>

      {/* Use Cases Section - Title changed to "Perfect for Everyone" */}
      <section
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            Perfect for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {useCases.map((useCase, idx) => {
              const IconComponent = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className={`bg-gradient-to-r ${useCase.gradient} p-3 sm:p-4 rounded-xl w-fit mb-3 sm:mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconComponent className="text-2xl sm:text-3xl text-white" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-3 sm:mb-4">
                      {useCase.desc}
                    </p>
                    <div className="space-y-2">
                      {useCase.examples.map((example, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400"
                        >
                          <FaCheckCircle className="text-green-600 dark:text-green-400 text-xs" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection
        features={features}
        title="Powerful Features"
        subtitle="Everything you need to manage your social presence in one place"
        layout="grid"
      />

       <section
        className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-2 sm:pb-4 md:pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-slate-900/60 dark:via-purple-950/40 dark:to-pink-950/40"
      >
         <ComparisonTable/>
      </section>

      {/* How It Works Section */}
      <section
        className="pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-slate-900/60 dark:via-purple-950/40 dark:to-pink-950/40"
      >
        <div className="container mx-auto">
          <div
            className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              How It Works
            </h2>
            <p
              className="text-base md:text-lg lg:text-xl leading-8 text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6"
            >
              The core idea behind{" "}
              <b className="text-gray-900 dark:text-white">LinkBridger</b> is
              to simplify the management of social media links. Instead of
              sharing long, hard-to-remember URLs, you create a single,
              personalized URL that automatically redirects users to the
              correct platform. Access all your links at one place by visiting{" "}
              <b className="text-gray-900 dark:text-white">
                https://<span className="font-bold text-purple-600 dark:text-purple-400">yourname</span>.clickly.cv
              </b>{" "}
              (without any platform name). Plus, get real-time email
              notifications every time someone visits your links! Analyze your
              audience with comprehensive analytics including device, browser,
              OS, referrer, and temporal patterns to optimize your strategy.
            </p>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {howItWorksSteps.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-white/5 dark:bg-gray-800/30 rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 sm:p-4 rounded-xl flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconComponent className="text-xl sm:text-2xl text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                        {item.step}. {item.title}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-white/5 dark:bg-gray-800/30 rounded-xl sm:rounded-2xl border border-white/10"
            >
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Example:
              </p>
              <div className="space-y-2">
                <a
                  href="https://dpkrn.clickly.cv/instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 underline font-mono text-base md:text-lg"
                >
                  Instagram: https://<span className="font-bold text-purple-400 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-1 rounded">dpkrn</span>.clickly.cv/instagram
                </a>
                <a
                  href="https://dpkrn.clickly.cv/leetcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 underline font-mono text-base md:text-lg"
                >
                  LeetCode: https://<span className="font-bold text-purple-400 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-1 rounded">dpkrn</span>.clickly.cv/leetcode
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <StatisticsSection
        stats={stats}
        title="Trusted by Thousands"
        subtitle="Join the community of professionals, creators, and developers"
        sectionRef={statsRef}
      />

      {/* Final CTA Section */}
      <CTASection
        title="Ready to Transform Your Links?"
        subtitle="Join thousands of professionals who trust LinkBridger. Get your own domain FREE to manage your links and reflect your brand identity professionally."
        ctaText="Get Started Now"
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

