import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEnvelope, FaSignInAlt, FaLink, FaLock, FaShare, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Footer from '../../footer/Footer';

const HowToUse = () => {
  const steps = [
    {
      icon: FaUserPlus,
      title: "1. Register",
      description: "Create your account to get started",
      details: [
        "Visit the signup page",
        "Enter your email address",
        "Choose a short, memorable username (this becomes your FREE domain like username.allin1url.in)",
        "Get your own domain FREE to reflect your brand identity",
        "Create a strong password",
        "Click 'Sign Up' to create your account"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FaEnvelope,
      title: "2. Verify Your Email",
      description: "Verify your email address to activate your account",
      details: [
        "Check your email inbox for verification code",
        "Enter the OTP (One-Time Password) sent to your email",
        "Click 'Verify' to complete email verification",
        "Your account will be activated after verification"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaSignInAlt,
      title: "3. Login",
      description: "Sign in to access your dashboard",
      details: [
        "Enter your username or email",
        "Enter your password",
        "Click 'Sign In' to access your account",
        "You'll be redirected to your dashboard"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: FaLink,
      title: "4. Generate Links",
      description: "Create personalized links for your platforms using your own domain",
      details: [
        "Go to the 'Links' page from navigation",
        "Click 'Add New Link' or 'Create Bridge'",
        "Enter platform name (e.g., 'LinkedIn', 'GitHub', 'Portfolio')",
        "Enter the destination URL (the actual link to your profile)",
        "Get your own domain FREE to manage all your links professionally",
        "Click 'Create' to generate your personalized link",
        "Your professional link will be: allin1url.in/yourusername/platformname"
      ],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: FaLock,
      title: "5. Secure Links",
      description: "Set privacy and visibility for your links",
      details: [
        "Click the lock icon on any link card",
        "Choose visibility level:",
        "  • Public: Visible everywhere (hub, profile, search)",
        "  • Unlisted: Visible in profile only, not in hub",
        "  • Private: Hidden everywhere, password-protected",
        "For private links, set a password when prompted",
        "Save your settings"
      ],
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: FaShare,
      title: "6. Share LinkHub",
      description: "Share your main hub link that reflects your brand identity",
      details: [
        "Your professional hub link is: yourusername.allin1url.in",
        "Get your own domain FREE to manage all your links professionally",
        "This link acts as a beautiful landing page for all your profiles",
        "Share it on:",
        "  • Business cards",
        "  • Email signatures",
        "  • Resumes",
        "  • Social media bios",
        "  • Portfolio websites",
        "Visitors can browse and choose which platform to visit"
      ],
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: FaShare,
      title: "7. Share Particular Links",
      description: "Share individual platform links when needed",
      details: [
        "Each platform has its own link: allin1url.in/yourusername/platformname",
        "Share specific links when you want to direct someone to a particular profile",
        "Examples:",
        "  • Share LinkedIn link in job applications",
        "  • Share GitHub link in developer communities",
        "  • Share Portfolio link in client proposals",
        "All links automatically redirect to your current destination URL"
      ],
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-lime-100 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-12 md:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            How to Use
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Step-by-step guide to get started with All in1 url
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden group"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10 flex items-start gap-4 md:gap-6">
                  {/* Icon */}
                  <div className={`flex-shrink-0 inline-flex p-4 rounded-xl bg-gradient-to-r ${step.gradient} text-white`}>
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 + i * 0.05 }}
                          className="flex items-start gap-2 text-sm md:text-base text-gray-700 dark:text-gray-300"
                        >
                          <FaCheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                          <span className={detail.startsWith("  •") ? "ml-4" : ""}>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow (except for last step) */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="text-gray-400 dark:text-gray-600"
                    >
                      <FaArrowRight className="w-6 h-6 rotate-90" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowToUse;



