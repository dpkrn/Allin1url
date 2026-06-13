import React, { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/logo.png";

// Floating Particle Component
const FloatingParticle = ({
  delay = 0,
  duration = 20,
  size = 4,
  color = "purple",
  initialX = 0,
  initialY = 0,
  xOffset = 0,
}) => {
  const colors = {
    purple: "bg-purple-400/30",
    pink: "bg-pink-400/30",
    blue: "bg-blue-400/30",
    cyan: "bg-cyan-400/30",
  };

  return (
    <motion.div
      className={`absolute ${colors[color]} rounded-full blur-sm`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, xOffset, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
};

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

// Animated Link Card Component
const AnimatedLinkCard = ({ link, idx }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      animate={
        inView
          ? {
              y: [0, -10, 0],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: idx * 0.2 + 0.8,
      }}
    >
      <MagneticCard intensity={0.2}>
        <motion.a
          ref={cardRef}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, rotateY: -20, scale: 0.8 }}
          animate={
            inView
              ? {
                  opacity: 1,
                  rotateY: 0,
                  scale: 1,
                }
              : { opacity: 0 }
          }
          transition={{
            opacity: { duration: 0.6, delay: idx * 0.1 },
            rotateY: { duration: 0.6, delay: idx * 0.1 },
            scale: { duration: 0.6, delay: idx * 0.1 },
          }}
          whileHover={{
            scale: 1.1,
            y: -15,
            z: 50,
            rotateY: 5,
          }}
          className={`relative group bg-gradient-to-br ${link.color} p-6 rounded-2xl shadow-2xl overflow-hidden cursor-pointer min-h-[180px] flex flex-col justify-between`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Animated Background Gradient */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-90`}
            animate={
              isHovered
                ? {
                    opacity: [0.9, 1, 0.9],
                    scale: [1, 1.1, 1],
                  }
                : {
                    opacity: [0.7, 0.9, 0.7],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Card Glow Animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 255, 255, 0.1)",
                "0 0 40px rgba(255, 255, 255, 0.3)",
                "0 0 20px rgba(255, 255, 255, 0.1)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "200%" } : { x: "-100%" }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 0.5,
              ease: "linear",
            }}
            style={{ transform: "skewX(-20deg)" }}
          />

          {/* Content */}
          <div
            className="relative z-10"
            style={{ transform: "translateZ(20px)" }}
          >
            {/* Platform Icon with Glow Effect */}
            <div className="flex justify-center mb-3 relative h-16">
              {/* Icon with Continuous Animation and Glow */}
              <motion.div
                className="text-4xl relative z-10 flex items-center justify-center"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Glow Effect - moves with icon */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full blur-xl" />
                </motion.div>

                {/* Floating Particles - Centered with Icon */}
                <AnimatePresence>
                  {isHovered && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: `${Math.cos((i / 6) * Math.PI * 2) * 60}px`,
                            y: `${Math.sin((i / 6) * Math.PI * 2) * 60}px`,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Icon */}
                <span className="relative z-10">{link.icon}</span>
              </motion.div>
            </div>

            {/* Platform Name */}
            <motion.h3
              className="text-xl md:text-2xl font-bold text-white mb-2 text-center"
              animate={
                isHovered
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
              }}
            >
              {link.platform}
            </motion.h3>

            {/* URL - Tightened with full text visible */}
            <motion.p
              className="text-[10px] md:text-xs text-white/90 font-mono text-center px-1"
              style={{ letterSpacing: "-0.3px", wordSpacing: "-1px" }}
              animate={
                isHovered
                  ? {
                      x: [0, 5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
              }}
            >
              {link.url}
            </motion.p>

            {/* Arrow Indicator */}
            <motion.div
              className="absolute bottom-4 right-4 text-white/80"
              animate={
                isHovered
                  ? {
                      x: [0, 5, 0],
                      opacity: [0.8, 1, 0.8],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: isHovered ? Infinity : 0,
              }}
            >
              <FaArrowRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Glow Effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${link.color} blur-2xl opacity-0`}
            animate={{
              opacity: isHovered ? [0, 0.6, 0] : 0,
              scale: isHovered ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </motion.a>
      </MagneticCard>
    </motion.div>
  );
};

// Feature Card Component - Enhanced with 3D and Magnetic Effects
const FeatureCard = ({ feature, idx, hoveredFeature, setHoveredFeature }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const IconComponent = feature.icon;
  const isLeft = idx % 2 === 0;
  const [cardHover, setCardHover] = useState(false);

  return (
    <MagneticCard intensity={0.15}>
      <motion.div
        key={feature.title}
        ref={ref}
        initial={{
          opacity: 0,
          x: isLeft ? -100 : 100,
          rotateY: isLeft ? -15 : 15,
        }}
        animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        onHoverStart={() => {
          setHoveredFeature(idx);
          setCardHover(true);
        }}
        onHoverEnd={() => {
          setHoveredFeature(null);
          setCardHover(false);
        }}
        className={`group relative bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 overflow-hidden ${
          isLeft ? "" : "md:flex-row-reverse"
        } flex flex-col md:flex-row items-center gap-6 md:gap-8 cursor-pointer transition-all duration-300`}
        whileHover={{ scale: 1.02, z: 50 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Animated Gradient Background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0`}
          animate={{
            opacity: cardHover ? 0.15 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          animate={cardHover ? { x: "200%" } : { x: "-100%" }}
          transition={{
            duration: 0.8,
            repeat: cardHover ? Infinity : 0,
            repeatDelay: 0.5,
          }}
          style={{ transform: "skewX(-20deg)" }}
        />

        {/* Floating Particles Around Card */}
        {cardHover && (
          <>
            {[...Array(6)].map((_, i) => (
              <FloatingParticle
                key={i}
                delay={i * 0.2}
                duration={3 + Math.random() * 2}
                size={3 + Math.random() * 3}
                color={["purple", "pink", "blue"][i % 3]}
              />
            ))}
          </>
        )}

        {/* Icon with 3D Rotation */}
        <motion.div
          className={`relative bg-gradient-to-r ${feature.gradient} p-6 rounded-2xl shadow-lg`}
          whileHover={{ scale: 1.15, rotateZ: 5, rotateY: 10 }}
          animate={cardHover ? { rotateY: [0, 5, -5, 0] } : {}}
          transition={{ duration: 2, repeat: cardHover ? Infinity : 0 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            animate={cardHover ? { rotate: 360 } : {}}
            transition={{
              duration: 3,
              repeat: cardHover ? Infinity : 0,
              ease: "linear",
            }}
          >
            <IconComponent className="text-4xl md:text-5xl text-white" />
          </motion.div>
          {/* Glow Effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0`}
            animate={{ opacity: cardHover ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Image with Parallax Effect */}
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.img
            src={feature.img}
            alt={feature.title}
            className="h-48 w-48 md:h-64 md:w-64 rounded-2xl object-cover flex-shrink-0 shadow-lg"
            whileHover={{ scale: 1.1, rotateZ: 2, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ transformStyle: "preserve-3d" }}
          />
          {/* Image Glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl -z-10"
            animate={{
              scale: cardHover ? [1, 1.2, 1] : 1,
              opacity: cardHover ? [0.3, 0.6, 0.3] : 0.3,
            }}
            transition={{ duration: 2, repeat: cardHover ? Infinity : 0 }}
          />
        </motion.div>

        {/* Content */}
        <div
          className="flex-1 text-center md:text-left"
          style={{ transform: "translateZ(20px)" }}
        >
          <motion.h3
            className={`text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
            animate={cardHover ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: cardHover ? Infinity : 0 }}
          >
            {feature.title}
          </motion.h3>
          <motion.p
            className="text-base md:text-lg text-gray-700 dark:text-gray-400 leading-relaxed"
            animate={cardHover ? { x: [0, 5, 0] } : {}}
            transition={{ duration: 2, repeat: cardHover ? Infinity : 0 }}
          >
            {feature.desc}
          </motion.p>
        </div>
      </motion.div>
    </MagneticCard>
  );
};
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toggleDarkMode } from "../../../redux/pageSlice";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { TypewriterEffect } from "../../ui/typewriter-effect";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "../../ui/text-reveal-card";
import { FlipWords } from "../../ui/flip-words";
import { BackgroundBeamsWithCollision } from "../../ui/background-beams-with-collision";
import Footer from "../../footer/Footer";
import { FeaturesSection } from "./sections";
import {
  FaRocket,
  FaLink,
  FaChartLine,
  FaSyncAlt,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaLightbulb,
  FaShieldAlt,
  FaClock,
  FaPalette,
  FaBriefcase,
  FaUserTie,
  FaCode,
  FaGraduationCap,
  FaUsers,
  FaLock,
  FaEye,
  FaServer,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaCheck,
  FaTimes,
  FaHome,
  FaEnvelope,
} from "react-icons/fa";

const Documentation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarMenu = useSelector((store) => store.page.sidebarMenu);
  const darkMode = useSelector((store) => store.page.darkMode);
  const isAuthenticated = useSelector((store) => store.admin.isAuthenticated);
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [openFAQ, setOpenFAQ] = useState([false, false, false, false, false, false, false, false]);
  const [openFeature, setOpenFeature] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const toggleFAQ = (idx) => {
    setOpenFAQ((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const words = [
    {
      text: "All in1 url : ",
      className: "text-blue-500 dark:text-blue-400 text-4xl font-bold",
    },
    {
      text: "Personalized",
      className: "text-4xl font-bold text-gray-900 dark:text-gray-200",
    },
    {
      text: "Social ",
      className: "text-4xl font-bold text-gray-900 dark:text-gray-200",
    },
    {
      text: "Profile ",
      className: "text-4xl font-bold text-gray-900 dark:text-gray-200",
    },
    {
      text: "Link ",
      className: "text-4xl font-bold text-gray-900 dark:text-gray-200",
    },
    {
      text: "Manager.",
      className: "text-4xl font-bold text-gray-900 dark:text-gray-200",
    },
  ];

  const platforms = [
    "linkedin",
    "github",
    "leetcode",
    "portfolio",
    "instagram",
    "codeforce",
  ];

  const features = [
    {
      img: "easy-to-remember.webp",
      title: "Personalized Smart Links",
      desc: "Generate easy-to-remember links for your social profiles using your username and platform names.",
      icon: FaLink,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      img: logo,
      title: "All Links at One Place",
      desc: "Access all your profiles with a single hub link. Simply visit https://allin1url.in/yourname (without any platform name) to see all your links in one beautiful, organized page. Perfect for sharing in bios, resumes, and business cards.",
      icon: FaHome,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      img: "update.webp",
      title: "Centralized Link Management",
      desc: "Update your social profile links in one place, and the change reflects everywhere.",
      icon: FaSyncAlt,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      img: "click.webp",
      title: "Real-Time Email Notifications",
      desc: "Get instant email notifications every time someone visits your links. Stay informed about who's checking out your profiles in real-time. Perfect for tracking engagement and knowing when potential clients or employers view your links.",
      icon: FaEnvelope,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      img: "click.webp",
      title: "Click Tracking",
      desc: "Keep track of how many times your social profile links are clicked.",
      icon: FaChartLine,
      gradient: "from-orange-500 to-red-500",
    },
    {
      img: "easysetup.webp",
      title: "Easy to Setup",
      desc: "No complicated setup; just choose your username, add the platform, and you're ready to go!",
      icon: FaCog,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      img: logo,
      title: "Your Own Domain",
      desc: "After registering, you'll get your own personalized domain to manage all your links. Your domain will reflect your brand identity and make your links more professional and memorable. Perfect for building your online presence!",
      icon: FaServer,
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      img: "click.webp",
      title: "Advanced Analytics",
      desc: "Get comprehensive insights into every click with detailed analytics. Track where clicks originated from, the exact time of each click, geographic location, device type (mobile, tablet, desktop), browser type, referrer information, and much more. Understand your audience better with granular data about every interaction.",
      icon: FaChartLine,
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  const futureFeatures = [
    {
      title: "Custom Link Themes",
      desc: "Add custom themes or styles to your personalized links to match your branding or style preferences.",
      icon: FaPalette,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Link Expiration",
      desc: "Set expiration dates for temporary links, ensuring they are only accessible for a certain period.",
      icon: FaClock,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Link Password Protection",
      desc: "Add a layer of security by allowing password protection on sensitive links.",
      icon: FaShieldAlt,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Enhanced Animated Background with Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic Gradient Orbs with Morphing */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            x: { type: "spring", stiffness: 50, damping: 20 },
            y: { type: "spring", stiffness: 50, damping: 20 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            x: { type: "spring", stiffness: 50, damping: 20 },
            y: { type: "spring", stiffness: 50, damping: 20 },
            scale: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
            opacity: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.7 - 200,
            y: mousePosition.y * 0.7 - 200,
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            x: { type: "spring", stiffness: 50, damping: 20 },
            y: { type: "spring", stiffness: 50, damping: 20 },
            scale: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
            opacity: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
          }}
        />

        {/* Additional Floating Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-64 h-64 ${
              i % 3 === 0
                ? "bg-cyan-500/10"
                : i % 3 === 1
                ? "bg-violet-500/10"
                : "bg-rose-500/10"
            } rounded-full blur-3xl`}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
          />
        ))}

        {/* Floating Particles Layer */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.3}
              duration={15 + Math.random() * 10}
              size={2 + Math.random() * 4}
              color={["purple", "pink", "blue", "cyan"][i % 4]}
            />
          ))}
        </div>

        {/* Animated Grid with Wave Effect */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Rotating Gradient Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `conic-gradient(from ${i * 120}deg, transparent, ${
                i === 0
                  ? "rgba(147, 51, 234, 0.1)"
                  : i === 1
                  ? "rgba(236, 72, 153, 0.1)"
                  : "rgba(59, 130, 246, 0.1)"
              }, transparent)`,
              maskImage: "radial-gradient(circle, transparent 60%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 60%, black 100%)",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Pulsing Glow Rings */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`glow-ring-${i}`}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              scale: [1, 1.5 + i * 0.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div
              className={`w-96 h-96 rounded-full border-2 ${
                i % 4 === 0
                  ? "border-purple-500/30"
                  : i % 4 === 1
                  ? "border-pink-500/30"
                  : i % 4 === 2
                  ? "border-blue-500/30"
                  : "border-cyan-500/30"
              } blur-xl`}
              style={{
                boxShadow: `0 0 ${40 + i * 20}px ${
                  i % 4 === 0
                    ? "rgba(147, 51, 234, 0.3)"
                    : i % 4 === 1
                    ? "rgba(236, 72, 153, 0.3)"
                    : i % 4 === 2
                    ? "rgba(59, 130, 246, 0.3)"
                    : "rgba(6, 182, 212, 0.3)"
                }`,
              }}
            />
          </motion.div>
        ))}

        {/* Static Glowing Waves */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.2), transparent)",
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.2), transparent)",
          }}
        />

        {/* Radial Glow Effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`radial-glow-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${(i * 15) % 80}%`,
              top: `${(i * 20) % 80}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0
                  ? "rgba(147, 51, 234, 0.2)"
                  : i % 3 === 1
                  ? "rgba(236, 72, 153, 0.2)"
                  : "rgba(59, 130, 246, 0.2)"
              }, transparent)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
              x: [0, Math.sin(i) * 50, 0],
              y: [0, Math.cos(i) * 50, 0],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Glowing Grid Lines */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(147, 51, 234, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(236, 72, 153, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated Glow Spots */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`glow-spot-${i}`}
            className="absolute rounded-full blur-2xl"
            style={{
              width: "150px",
              height: "150px",
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 15) % 100}%`,
              background: `radial-gradient(circle, ${
                i % 4 === 0
                  ? "rgba(147, 51, 234, 0.3)"
                  : i % 4 === 1
                  ? "rgba(236, 72, 153, 0.3)"
                  : i % 4 === 2
                  ? "rgba(59, 130, 246, 0.3)"
                  : "rgba(6, 182, 212, 0.3)"
              }, transparent)`,
            }}
            animate={{
              scale: [0.8, 1.5, 0.8],
              opacity: [0.2, 0.6, 0.2],
              x: [0, Math.sin(i * 0.5) * 30, 0],
              y: [0, Math.cos(i * 0.5) * 30, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Navigation Header with Glow Effects */}
      {!isAuthenticated && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative z-50 w-full h-[70px] shadow-lg bg-white/95 dark:bg-gray-900/50 backdrop-blur-xl flex items-center justify-between border-b border-gray-200 dark:border-white/10 transition-colors duration-300 px-4 sm:px-6 md:px-10 lg:px-12"
        >
          {/* Animated Background Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Logo with 3D Rotation */}
          <motion.div
            className="flex items-center gap-4 cursor-pointer relative z-10"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="h-8 w-8 rounded-full overflow-hidden"
            >
              <motion.img
                className="h-8 w-8 rounded-full object-contain bg-white/10 dark:bg-gray-800/20 p-1 transition-all duration-300"
                src={logo}
                alt="All in1 url Logo"
                onError={(e) => {
                  e.target.src =
                    "https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500";
                }}
                whileHover={{ scale: 1.2, rotateZ: 15 }}
              />
            </motion.div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent relative">
              All in1 url
              {/* Text Glow */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent blur-sm opacity-50"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                All in1 url
              </motion.span>
            </span>
          </motion.div>

          {/* Enhanced Navigation Items */}
          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            {/* Navigation Links with Magnetic Effect */}
            <div className="hidden md:flex items-center gap-6">
              <motion.button
                onClick={() => navigate("/")}
                className="relative text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors overflow-hidden group"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Home</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
              <motion.button
                onClick={() => navigate("/login")}
                className="relative text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors overflow-hidden group"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Login</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </div>

            {/* Enhanced Dark Mode Toggle with Glow */}
            <motion.button
              onClick={() => dispatch(toggleDarkMode())}
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 rounded-xl bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 text-gray-800 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden group"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="relative z-10"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {darkMode ? (
                  <MdLightMode className="text-xl" />
                ) : (
                  <MdDarkMode className="text-xl" />
                )}
              </motion.div>
            </motion.button>

            {/* Enhanced Get Started Button with Particle Effect */}
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 md:px-6 rounded-xl text-sm md:text-lg transition-all shadow-lg hover:shadow-2xl flex items-center gap-2 overflow-hidden group"
            >
              {/* Static Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "linear",
                }}
                style={{ transform: "skewX(-20deg)" }}
              />

              {/* Button Content */}
              <span className="relative z-10 hidden sm:inline">
                Get Started
              </span>
              <span className="relative z-10 sm:hidden">Start</span>
              <motion.span
                className="relative z-10"
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaArrowRight />
              </motion.span>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-xl opacity-0 group-hover:opacity-50"
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-6 md:p-10 lg:p-12"
        >
          {/* Hero Section */}
          <motion.section
            variants={itemVariants}
            className="mb-6 md:mb-8 text-center"
          >
            <div className="mb-4">
              <TypewriterEffect words={words} className="mb-4" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <TextRevealCard
                className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 mb-4 transition-colors duration-300"
                text="Generate Links You'll Never Forget."
                revealText="Turn Usernames into Smart Links - Quick and Simple!"
              />
            </motion.div>
          </motion.section>

          {/* Enhanced Introduction Section with 3D Effects */}
          <motion.section variants={itemVariants} className="mb-6 md:mb-8">
            <MagneticCard intensity={0.15}>
              <div
                className="relative bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12 overflow-hidden group"
                style={{
                  willChange: "transform",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none z-0"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.25), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2), transparent 70%)",
                  }}
                />

                {/* Corner Glow Effects */}
                <motion.div
                  className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none blur-3xl z-0"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(147, 51, 234, 0.5), transparent 70%)",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none blur-3xl z-0"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(236, 72, 153, 0.5), transparent 70%)",
                    transform: "translate(50%, 50%)",
                  }}
                />
                <motion.div
                  className="absolute top-1/2 right-0 w-32 h-32 rounded-full pointer-events-none blur-2xl z-0"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)",
                    transform: "translate(50%, -50%)",
                  }}
                />

                {/* Animated Border Glow */}
                <motion.div
                  className="absolute -inset-[2px] rounded-3xl pointer-events-none z-0"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.35), rgba(59, 130, 246, 0.35), rgba(147, 51, 234, 0.4))",
                    filter: "blur(10px)",
                  }}
                />

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none z-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.15), transparent 70%)",
                    filter: "blur(25px)",
                  }}
                />

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent relative z-10"
                  transition={{
                    opacity: { duration: 0.6, ease: "easeOut" },
                    y: { duration: 0.6, ease: "easeOut" },
                  }}
                >
                  Introduction
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                  className="relative z-10 space-y-5"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  <p className="text-base md:text-lg lg:text-[1.125rem] leading-relaxed md:leading-[1.85] text-gray-700 dark:text-gray-300 font-normal tracking-wide">
                    Welcome to{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      All in1 url
                    </span>
                    , your ultimate partner for streamlined online presence and
                    effortless link management. We offer innovative IT support
                    and services that make your social media profiles,
                    portfolios, and professional links easy to remember, manage,
                    and share.
                  </p>

                  <p className="text-base md:text-lg lg:text-[1.125rem] leading-relaxed md:leading-[1.85] text-gray-700 dark:text-gray-300 font-normal tracking-wide">
                    Whether you're sharing your Instagram, GitHub, LinkedIn, or
                    any other platform, All in1 url allows you to generate a
                    single, personalized URL that leads to a beautiful,
                    customizable landing page featuring all your profiles.
                    Simply visit{" "}
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      https://allin1url.in/yourname
                    </span>{" "}
                    (without any platform name) to access your unified link hub.
                  </p>

                  <p className="text-base md:text-lg lg:text-[1.125rem] leading-relaxed md:leading-[1.85] text-gray-700 dark:text-gray-300 font-normal tracking-wide">
                    With real-time visitor notifications and detailed analytics,
                    you can effortlessly track performance, monitor click rates,
                    and gain valuable insights into your audience engagement.
                    Enjoy the convenience of centralized updating—any changes
                    you make are instantly reflected across all your platforms,
                    eliminating the need for manual updates everywhere.
                  </p>

                  <p className="text-base md:text-lg lg:text-[1.125rem] leading-relaxed md:leading-[1.85] text-gray-700 dark:text-gray-300 font-normal tracking-wide">
                    Experience the power of simplified link management and take
                    control of your digital presence today.
                  </p>
                </motion.div>
              </div>
            </MagneticCard>
          </motion.section>

          {/* Enhanced Example Links Section with 3D Floating Cards */}
          <motion.section variants={itemVariants} className="mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Static Title */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-10 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                Have You Ever Wondered How Link Has Been Personalized:
              </motion.h2>

              {/* 3D Floating Cards Container */}
              <div className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center py-8">
                {/* Background Glow Effects */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-full h-full max-w-4xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-3xl" />
                </motion.div>

                {/* Floating Link Cards in 3D Space */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[
                      {
                        platform: "LinkedIn",
                        url: "https://allin1url.in/dpkrn/linkedin",
                        color: "from-blue-500 to-cyan-500",
                        icon: "💼",
                      },
                      {
                        platform: "GitHub",
                        url: "https://allin1url.in/dpkrn/github",
                        color: "from-gray-600 to-gray-800",
                        icon: "🐙",
                      },
                      {
                        platform: "LeetCode",
                        url: "https://allin1url.in/dpkrn/leetcode",
                        color: "from-orange-500 to-yellow-500",
                        icon: "💻",
                      },
                      {
                        platform: "Portfolio",
                        url: "https://allin1url.in/dpkrn/portfolio",
                        color: "from-purple-500 to-pink-500",
                        icon: "🎨",
                      },
                      {
                        platform: "Instagram",
                        url: "https://allin1url.in/dpkrn/instagram",
                        color: "from-pink-500 to-rose-500",
                        icon: "📸",
                      },
                      {
                        platform: "Codeforces",
                        url: "https://allin1url.in/dpkrn/codeforces",
                        color: "from-red-500 to-orange-500",
                        icon: "⚔️",
                      },
                    ].map((link, idx) => (
                      <AnimatedLinkCard
                        key={link.platform}
                        link={link}
                        idx={idx}
                      />
                    ))}
                  </div>

                  {/* Interactive Matrix Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-8 md:mt-12 relative"
                  >
                    <MagneticCard intensity={0.1}>
                      <motion.div
                        className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 dark:from-purple-950/60 dark:via-pink-950/60 dark:to-blue-950/60 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-purple-500/30 dark:border-purple-400/20 p-6 md:p-8 overflow-hidden group"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Matrix Background Effect */}
                        <div className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none">
                          {[...Array(50)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute text-green-400 dark:text-green-300 font-mono text-xs md:text-sm"
                              style={{
                                left: `${(i * 7) % 100}%`,
                                top: `${(i * 11) % 100}%`,
                              }}
                              animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "linear",
                              }}
                            >
                              {String.fromCharCode(0x30a0 + Math.random() * 96)}
                            </motion.div>
                          ))}
                        </div>

                        {/* Animated Border Glow */}
                        <motion.div
                          className="absolute -inset-[2px] rounded-2xl md:rounded-3xl pointer-events-none z-0"
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.5), rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5))",
                            filter: "blur(8px)",
                          }}
                        />

                        {/* Floating Particles */}
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-purple-400/40 dark:bg-purple-300/40"
                            style={{
                              left: `${20 + i * 10}%`,
                              top: `${10 + (i % 3) * 30}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              x: [0, Math.sin(i) * 10, 0],
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                              duration: 2 + i * 0.3,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          />
                        ))}

                        {/* Content */}
                        <div className="relative z-10 text-center">
                          <motion.div
                            className="flex items-center justify-center gap-2 mb-4"
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <motion.span
                              className="text-2xl md:text-3xl"
                              animate={{
                                rotate: [0, 360],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              ✨
                            </motion.span>
                            <motion.h3
                              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 dark:from-purple-200 dark:via-pink-200 dark:to-blue-200 bg-clip-text text-transparent"
                              animate={{
                                backgroundPosition: ["0%", "100%", "0%"],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              style={{
                                backgroundSize: "200% 100%",
                              }}
                            >
                              Only the platform name changes
                            </motion.h3>
                            <motion.span
                              className="text-2xl md:text-3xl"
                              animate={{
                                rotate: [360, 0],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              ✨
                            </motion.span>
                          </motion.div>

                          <motion.p
                            className="text-base md:text-lg text-gray-200 dark:text-gray-300 font-medium"
                            animate={{
                              opacity: [0.8, 1, 0.8],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            All else remains the same
                          </motion.p>

                          {/* Interactive Glow on Hover */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background:
                                "radial-gradient(circle at center, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2), transparent 70%)",
                              filter: "blur(20px)",
                            }}
                          />
                        </div>
                      </motion.div>
                    </MagneticCard>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Special Link Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <MagneticCard intensity={0.1}>
              <motion.div
                className="relative bg-black dark:bg-black backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-gray-900 dark:border-gray-800 p-6 md:p-8 lg:p-10 overflow-hidden group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Matrix Background Effect */}
                <div className="absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none">
                  {[...Array(80)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-green-500 dark:text-green-400 font-mono text-xs md:text-sm font-bold"
                      style={{
                        left: `${(i * 5.7) % 100}%`,
                        top: `${(i * 8.3) % 100}%`,
                      }}
                      animate={{
                        y: [0, -150, 0],
                        opacity: [0, 1, 0.8, 0],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "linear",
                      }}
                    >
                      {String.fromCharCode(
                        0x30a0 + Math.floor(Math.random() * 96)
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Additional Matrix Rain Effect */}
                <div className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={`rain-${i}`}
                      className="absolute w-px h-20 bg-gradient-to-b from-green-400 to-transparent"
                      style={{
                        left: `${(i * 7.3) % 100}%`,
                        top: `-20%`,
                      }}
                      animate={{
                        y: [
                          0,
                          (typeof window !== "undefined"
                            ? window.innerHeight
                            : 800) + 100,
                        ],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>

                {/* Subtle Glowing Background Effects - More Subtle */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-950/10 via-pink-950/10 to-blue-950/10 dark:from-purple-950/15 dark:via-pink-950/15 dark:to-blue-950/15"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Subtle Corner Glow Effects */}
                <motion.div
                  className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none blur-3xl"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent 70%)",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-48 h-48 rounded-full pointer-events-none blur-3xl"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%)",
                    transform: "translate(50%, 50%)",
                  }}
                />

                {/* Animated Border Glow - More Subtle */}
                <motion.div
                  className="absolute -inset-[2px] rounded-2xl md:rounded-3xl pointer-events-none z-0"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.4))",
                    filter: "blur(6px)",
                  }}
                />

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.1), transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 space-y-4 md:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative mx-auto w-full text-center"
                  >
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-2 md:py-4">
                      <span className="uppercase text-sm md:text-base lg:text-xl font-bold block">
                        It will provide a special link for all your platforms.
                      </span>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-base md:text-lg lg:text-2xl xl:text-3xl text-center"
                  >
                    <a
                      href="https://allin1url.in/dpkrn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 dark:hover:text-blue-200 transition-colors break-all md:break-normal"
                    >
                      https://allin1url.in/dpkrn
                    </a>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative mx-auto w-full text-center"
                  >
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-2 md:py-4">
                      <span className="uppercase text-sm md:text-base lg:text-xl font-bold block">
                        Change only the platform name to redirect to all
                        profiles
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-base md:text-lg lg:text-2xl xl:text-3xl text-center"
                  >
                    <a
                      href="https://allin1url.in/dpkrn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 dark:hover:text-blue-200 transition-colors break-all md:break-normal"
                    >
                      https://allin1url.in/dpkrn/
                      <FlipWords
                        className="text-blue-400 dark:text-blue-300"
                        words={platforms}
                      />
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </MagneticCard>
          </motion.section>

          {/* Enhanced Get Started CTA with 3D Effects */}
          <motion.section
            variants={itemVariants}
            className="mb-6 md:mb-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="space-y-6"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              <MagneticCard intensity={0.2}>
                <motion.button
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.1, y: -5, z: 50 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg md:text-xl transition-all shadow-lg hover:shadow-2xl flex items-center gap-3 mx-auto overflow-hidden group"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Static Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      ease: "linear",
                    }}
                    style={{ transform: "skewX(-20deg)" }}
                  />

                  {/* Content */}
                  <span className="relative z-10">Get Started</span>
                  <motion.span
                    className="relative z-10"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <FaRocket />
                  </motion.span>

                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-2xl opacity-0 group-hover:opacity-60 -z-10"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Floating Particles on Hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={false}
                    whileHover="hover"
                  >
                    <motion.div
                      variants={{
                        hover: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          variants={{
                            hover: {
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: Math.cos((i / 8) * Math.PI * 2) * 50,
                              y: Math.sin((i / 8) * Math.PI * 2) * 50,
                            },
                          }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                          }}
                          style={{
                            left: "50%",
                            top: "50%",
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.button>
              </MagneticCard>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gray-600 dark:text-gray-500 text-sm md:text-base"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  y: { delay: 0.2 },
                }}
              >
                Create an account and start managing your personalized links
                today!
              </motion.p>
            </motion.div>
          </motion.section>

          {/* Key Features Section */}
          <FeaturesSection
            features={features}
            title="Key Features"
            subtitle=""
            layout="list"
            className="mb-12 md:mb-16"
          />

          {/* How It Works Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg lg:text-xl leading-8 text-gray-700 dark:text-gray-300 mb-4 md:mb-6"
              >
                The core idea behind{" "}
                <b className="text-gray-900 dark:text-white">All in1 url</b> is
                to simplify the management of social media links. Instead of
                sharing long, hard-to-remember URLs, you create a single,
                personalized URL that automatically redirects users to the
                correct platform. Access all your links at one place by visiting{" "}
                <b className="text-gray-900 dark:text-white">
                  https://allin1url.in/yourname
                </b>{" "}
                (without any platform name). Plus, get real-time email
                notifications every time someone visits your links!
              </motion.p>

              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Create an Account",
                    desc: "Sign up using your email and create an account on All in1 url.",
                    icon: FaRocket,
                  },
                  {
                    step: "2",
                    title: "Choose a Username",
                    desc: "Pick a username that's easy to remember (e.g., dpkrn). Your link will follow this format: https://allin1url.in/your-username/instagram.",
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
                    desc: "Copy and share your smart link across various platforms. Share your hub link (https://allin1url.in/yourname) to let visitors see all your profiles in one place.",
                    icon: FaSyncAlt,
                  },
                  {
                    step: "6",
                    title: "Get Real-Time Notifications",
                    desc: "Receive instant email notifications every time someone visits your links. Stay informed about engagement and track who's viewing your profiles in real-time.",
                    icon: FaEnvelope,
                  },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <motion.div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-2xl text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {item.step}. {item.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10"
              >
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Example:
                </p>
                <div className="space-y-2">
                  <motion.a
                    href="https://allin1url.in/dpkrn/instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="block text-blue-400 hover:text-blue-300 underline font-mono text-base md:text-lg"
                  >
                    Instagram: https://allin1url.in/dpkrn/instagram
                  </motion.a>
                  <motion.a
                    href="https://allin1url.in/dpkrn/leetcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="block text-blue-400 hover:text-blue-300 underline font-mono text-base md:text-lg"
                  >
                    LeetCode: https://allin1url.in/dpkrn/leetcode
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Click Tracking Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaChartLine className="text-3xl text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
                >
                  Click Tracking
                </motion.h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-base md:text-lg lg:text-xl leading-8 text-gray-800 dark:text-gray-300"
              >
                With{" "}
                <b className="text-gray-900 dark:text-white">All in1 url</b>,
                you can track how many times each of your links has been
                clicked. This allows you to monitor the engagement on your
                social media profiles across different platforms. Access the
                analytics section from your dashboard to see detailed statistics
                about each link's performance.
              </motion.p>
            </motion.div>
          </motion.section>

          {/* Future Enhancements Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Future Enhancements
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {futureFeatures.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <motion.div
                        className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-xl w-fit mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-2xl text-white" />
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Use Cases Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Use Cases
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Job Seekers",
                  desc: "Create professional links for your resume, LinkedIn, portfolio, and GitHub. Share one memorable link with recruiters.",
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
                  desc: "Manage all your social media profiles from one place. Share your All in1 url link in bio and watch engagement grow.",
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
                  desc: "Showcase your GitHub, portfolio, blog, and coding profiles. Perfect for developer portfolios and tech resumes.",
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
              ].map((useCase, idx) => {
                const IconComponent = useCase.icon;
                return (
                  <motion.div
                    key={useCase.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <motion.div
                        className={`bg-gradient-to-r ${useCase.gradient} p-4 rounded-xl w-fit mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-3xl text-white" />
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-4">
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
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Best Practices Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div className="flex items-center gap-4 mb-4 md:mb-6">
                <motion.div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaLightbulb className="text-3xl text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                >
                  Best Practices
                </motion.h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Choose a Memorable Username",
                    desc: "Pick a username that's easy to remember and spell. Avoid numbers and special characters when possible. Your username becomes part of your brand identity.",
                    icon: FaCheck,
                    color: "text-green-400",
                  },
                  {
                    title: "Keep Platform Names Consistent",
                    desc: "Use lowercase and consistent naming (e.g., 'linkedin' not 'LinkedIn' or 'linked-in'). This makes your links predictable and easy to remember.",
                    icon: FaCheck,
                    color: "text-green-400",
                  },
                  {
                    title: "Update Links Regularly",
                    desc: "Keep your destination URLs up to date. Since all your shared links automatically update, you only need to change them once in your dashboard.",
                    icon: FaSyncAlt,
                    color: "text-blue-400",
                  },
                  {
                    title: "Use Analytics to Optimize",
                    desc: "Monitor which links get the most clicks. Use this data to prioritize which platforms to feature prominently in your profile.",
                    icon: FaChartLine,
                    color: "text-purple-400",
                  },
                  {
                    title: "Test Your Links",
                    desc: "Always test your links after creating or updating them. Make sure they redirect correctly to the intended destination.",
                    icon: FaCheckCircle,
                    color: "text-cyan-400",
                  },
                  {
                    title: "Share Your Hub Link",
                    desc: "Prominently feature your main hub link (username) in your email signature, business cards, and social media bios for maximum visibility.",
                    icon: FaRocket,
                    color: "text-pink-400",
                  },
                ].map((practice, idx) => {
                  const IconComponent = practice.icon;
                  return (
                    <motion.div
                      key={practice.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <motion.div
                        className="flex-shrink-0 mt-1"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        <IconComponent
                          className={`text-2xl ${practice.color}`}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {practice.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                          {practice.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>

          {/* Platform Support Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Supported Platforms
            </motion.h2>
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 mb-4 md:mb-6 text-center">
                All in1 url supports{" "}
                <b className="text-gray-900 dark:text-white">any platform</b>{" "}
                you can think of! Just provide the destination URL and we'll
                create your personalized link.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  "LinkedIn",
                  "GitHub",
                  "Instagram",
                  "Facebook",
                  "Twitter/X",
                  "YouTube",
                  "TikTok",
                  "Snapchat",
                  "Pinterest",
                  "Reddit",
                  "Discord",
                  "Telegram",
                  "WhatsApp",
                  "Medium",
                  "Dev.to",
                  "Behance",
                  "Dribbble",
                  "Figma",
                  "Portfolio",
                  "Blog",
                  "Website",
                  "Email",
                  "Resume",
                  "LeetCode",
                  "Codeforces",
                  "HackerRank",
                  "CodeChef",
                  "Stack Overflow",
                  "Quora",
                  "Tumblr",
                ].map((platform, idx) => (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.03, type: "spring" }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-4 text-center border border-purple-200/50 dark:border-white/10 hover:border-purple-300/80 dark:hover:border-white/30 transition-all cursor-pointer"
                  >
                    <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                      {platform}
                    </p>
                  </motion.div>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center text-gray-600 dark:text-gray-500 mt-6 text-sm md:text-base"
              >
                And many more! If you can share a URL, we can create a
                personalized link for it.
              </motion.p>
            </motion.div>
          </motion.section>

          {/* Security & Privacy Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div className="flex items-center gap-4 mb-4 md:mb-6">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaLock className="text-3xl text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                >
                  Security & Privacy
                </motion.h2>
              </motion.div>
              <div className="space-y-6">
                {[
                  {
                    title: "Secure Authentication",
                    desc: "All user accounts are protected with secure password hashing. We use industry-standard encryption to keep your data safe.",
                    icon: FaShieldAlt,
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Privacy First",
                    desc: "We respect your privacy. Your personal information and link data are stored securely and never shared with third parties without your consent.",
                    icon: FaEye,
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    title: "HTTPS Encryption",
                    desc: "All connections to All in1 url are encrypted using HTTPS, ensuring your data is protected during transmission.",
                    icon: FaLock,
                    gradient: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Secure Server Infrastructure",
                    desc: "Our servers are hosted on secure, reliable infrastructure with regular security updates and monitoring.",
                    icon: FaServer,
                    gradient: "from-orange-500 to-red-500",
                  },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <motion.div
                        className={`bg-gradient-to-r ${item.gradient} p-4 rounded-xl flex-shrink-0`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-2xl text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>

          {/* Troubleshooting Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Troubleshooting
            </motion.h2>
            <div className="space-y-4">
              {[
                {
                  issue: "My link is not redirecting correctly",
                  solution:
                    "Double-check that your destination URL is correct and includes the full protocol (https://). Make sure the URL is accessible and not behind a login wall.",
                  icon: FaExclamationTriangle,
                  color: "from-red-500 to-orange-500",
                },
                {
                  issue: "I forgot my password",
                  solution:
                    "Use the 'Forgot Password' link on the login page to reset your password. You'll receive an email with instructions to create a new password.",
                  icon: FaQuestionCircle,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  issue: "My username is already taken",
                  solution:
                    "Usernames must be unique. Try adding numbers or variations to your desired username. Remember, usernames cannot be changed once created.",
                  icon: FaTimes,
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  issue: "I'm not receiving verification emails",
                  solution:
                    "Check your spam/junk folder. Make sure you entered the correct email address. If the issue persists, contact support for assistance.",
                  icon: FaExclamationTriangle,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  issue: "My click count seems incorrect",
                  solution:
                    "Click tracking may take a few moments to update. Refresh your dashboard. Note that clicks from the same IP within a short time may be filtered to prevent spam.",
                  icon: FaChartLine,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  issue: "I want to delete my account",
                  solution:
                    "Contact our support team to request account deletion. We'll process your request and ensure all your data is permanently removed from our systems.",
                  icon: FaUserTie,
                  color: "from-indigo-500 to-purple-500",
                },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden group"
                  >
                    <motion.div className="p-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`bg-gradient-to-r ${item.color} p-3 rounded-xl flex-shrink-0`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <IconComponent className="text-xl text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {item.issue}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              Solution:{" "}
                            </span>
                            {item.solution}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 dark:border-purple-400/30 text-center"
            >
              <p className="text-lg md:text-xl text-gray-900 dark:text-white mb-2">
                Still need help?
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Contact our support team at{" "}
                <a
                  href="mailto:d.wizard.techno@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
                >
                  d.wizard.techno@gmail.com
                </a>{" "}
                
                and we'll be happy to assist you!
              </p>
            </motion.div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is AllIn1URL?",
                  a: "AllIn1URL is a Link in Bio Platform that lets you create a professional profile at your own subdomain — username.allin1url.in. Think of it as your digital business card: one URL that points to all your links, bios, and contact info.",
                },
                {
                  q: "Who is AllIn1URL for?",
                  a: "AllIn1URL helps creators, developers, founders and professionals manage their online presence. Whether you're a job seeker, content creator, freelancer, startup founder, or developer — AllIn1URL gives you a clean, professional profile page for free.",
                },
                {
                  q: "What is LinkHub by AllIn1URL?",
                  a: "LinkHub is your personal public profile page hosted at username.allin1url.in. It shows your links, bio, skills, contact details, and social profiles — all in one place. You can choose from 20+ themes and control exactly what's visible using the Visibility settings.",
                },
                {
                  q: "How is AllIn1URL different from Linktree?",
                  a: "Unlike Linktree, AllIn1URL gives you a free custom subdomain (username.allin1url.in), a full professional profile with headline, skills, contact info, and social links, click analytics, 20+ themes, and no branding on your page — all completely free.",
                },
                {
                  q: "Can I change my username after creating an account?",
                  a: "Unfortunately, usernames cannot be changed once they are set. Choose your username carefully — it becomes your permanent professional profile URL at allin1url.in.",
                },
                {
                  q: "How do I track my link clicks?",
                  a: "Click tracking is built into every AllIn1URL profile. Visit your Analytics dashboard to see total clicks, per-link breakdown, and your top performing link.",
                },
                {
                  q: "Can I use custom platforms other than the popular ones (Instagram, LinkedIn, etc.)?",
                  a: "Yes! You can add any platform as long as you provide the correct profile URL. AllIn1URL is designed to work with every platform.",
                },
                {
                  q: "Is AllIn1URL free?",
                  a: "Yes — AllIn1URL is completely free. You get a free subdomain at allin1url.in, all 20+ themes, click analytics, a professional profile page, and no ads or branding. No credit card required.",
                },
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden cursor-pointer group"
                  onClick={() => toggleFAQ(idx)}
                >
                  <motion.div
                    className="p-6 flex justify-between items-center"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="font-semibold text-lg md:text-xl text-gray-900 dark:text-gray-200 flex-1">
                      Q: {faq.q}
                    </p>
                    <motion.div
                      animate={{ rotate: openFAQ[idx] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openFAQ[idx] ? (
                        <FaChevronUp className="text-purple-600 dark:text-purple-400 text-xl" />
                      ) : (
                        <FaChevronDown className="text-purple-600 dark:text-purple-400 text-xl" />
                      )}
                    </motion.div>
                  </motion.div>
                  <AnimatePresence>
                    {openFAQ[idx] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          className="px-6 pb-6 text-gray-700 dark:text-gray-400 text-base md:text-lg leading-relaxed"
                        >
                          A: {faq.a}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              What Our Users Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  text: "All in1 url made sharing my profiles so much easier. The personalized links look great and are super easy to remember!",
                  author: "Amit S.",
                },
                {
                  text: "I love the analytics and the ability to update all my links in one place. Highly recommended!",
                  author: "Priya K.",
                },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-lg" />
                      ))}
                    </div>
                    <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <motion.img
                        src="profile.jpg"
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full object-cover border-2 border-purple-400"
                        whileHover={{ scale: 1.1 }}
                      />
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">
                        {testimonial.author}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Footer */}
          <Footer />
        </motion.div>
      </div>
    </div>
  );
};

export default Documentation;
