import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaBriefcase, FaUserTie, FaCode, FaGraduationCap, FaClock, FaCheckCircle, FaInfinity } from 'react-icons/fa';
import Footer from '../../footer/Footer';

const Benefits = () => {
  const benefits = [
    {
      icon: FaStar,
      title: "Memorable & Professional Links",
      description: "Transform long, complex URLs into clean, branded links. Instead of 'linkedin.com/in/john-doe-software-engineer-123456789', get 'johndoe.allin1url.in/linkedin' that's easy to remember and share. Get your own domain FREE that will reflect your brand identity.",
      example: "Before: https://www.linkedin.com/in/john-doe-software-engineer-123456789/\nAfter: https://johndoe.allin1url.in/linkedin",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FaBriefcase,
      title: "For Professionals",
      benefits: [
        "Build your brand with consistent, memorable links",
        "Get your own domain FREE to reflect your brand identity",
        "Professional appearance on resumes and business cards",
        "Time-saving centralized link management",
        "Analytics to understand engagement",
        "Credibility through transparent, readable URLs",
        "SEO-friendly descriptive URLs"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaUserTie,
      title: "For Content Creators",
      benefits: [
        "Easy sharing with one simple link format",
        "Get your own domain FREE to manage all your links",
        "Audience insights through click tracking",
        "Flexibility to add any platform",
        "Customization to match your brand identity",
        "Cross-platform promotion with hub link",
        "Engagement tracking to focus content strategy"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: FaCode,
      title: "For Developers",
      benefits: [
        "Open source - full access to source code",
        "Modern stack (React, Node.js, MongoDB)",
        "Well documented with comprehensive examples",
        "Active development and regular updates",
        "Learning resource with best practices",
        "Growing community of developers"
      ],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: FaGraduationCap,
      title: "For Students & Job Seekers",
      benefits: [
        "Professional links that stand out on resumes",
        "Get your own domain FREE to build your brand identity",
        "Easy management - update once, changes everywhere",
        "Analytics to see which platforms recruiters visit",
        "Free forever - no subscription fees",
        "Privacy control - no third-party tracking"
      ],
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: FaClock,
      title: "Centralized Link Management",
      description: "Imagine you've shared your LinkedIn link in 10+ places. If your account gets banned or you change usernames, update the destination URL once in LinkBridger, and all your shared links automatically redirect to the new URL.",
      example: "Update once → All links update automatically",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: FaCheckCircle,
      title: "No Expiration - Links Work Forever",
      description: "Unlike many link shorteners that expire links or require premium subscriptions, LinkBridger links work forever. As long as you maintain your account, your links remain active with no expiration dates.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: FaInfinity,
      title: "Platform Flexibility",
      description: "Not limited to popular platforms! Add any platform you use: Social Media (LinkedIn, Instagram, Facebook, Twitter), Professional (GitHub, Portfolio, Resume), Coding Platforms (LeetCode, Codeforces), Creative (Behance, Dribbble), or any custom platform with a URL.",
      gradient: "from-yellow-500 to-orange-500"
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
            Benefits
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover the advantages of using LinkBridger for your social media presence
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden group"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className="relative z-10 mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${benefit.gradient} text-white`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  
                  {benefit.description && (
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                      {benefit.description}
                    </p>
                  )}
                  
                  {benefit.example && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs md:text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {benefit.example}
                      </p>
                    </div>
                  )}
                  
                  {benefit.benefits && (
                    <ul className="mt-4 space-y-2">
                      {benefit.benefits.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                          <FaCheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Benefits;



