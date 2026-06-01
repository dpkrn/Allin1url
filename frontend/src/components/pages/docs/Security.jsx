import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaEye, FaEyeSlash, FaKey, FaUserShield, FaServer, FaCheckCircle } from 'react-icons/fa';
import Footer from '../../footer/Footer';

const Security = () => {
  const securityFeatures = [
    {
      icon: FaLock,
      title: "Link Privacy Controls",
      description: "Control who can access your links with three visibility levels:",
      levels: [
        {
          name: "Public Links",
          description: "Fully visible and accessible everywhere",
          features: [
            "Visible in link hub (/username)",
            "Visible in profile preview",
            "Visible in user search results",
            "Accessible via direct URL",
            "No password required"
          ],
          color: "from-green-500 to-emerald-500"
        },
        {
          name: "Unlisted Links",
          description: "Hidden from hub but visible in profile preview",
          features: [
            "NOT visible in link hub",
            "Visible in profile preview",
            "Accessible via direct URL",
            "No password required",
            "Perfect for 100+ links without cluttering hub"
          ],
          color: "from-yellow-500 to-orange-500"
        },
        {
          name: "Private Links",
          description: "Completely hidden - require password to access",
          features: [
            "NOT visible in profile preview",
            "NOT visible in link hub",
            "NOT visible in search results",
            "Only accessible via direct URL with password",
            "Secure password verification with bcrypt"
          ],
          color: "from-red-500 to-pink-500"
        }
      ]
    },
    {
      icon: FaKey,
      title: "Password Protection",
      description: "Secure your sensitive links with password protection. When someone visits a private link, they see a password prompt page. After successful verification, users are automatically redirected to the destination URL.",
      features: [
        "Secure password verification with bcrypt hashing",
        "Direct redirection after successful verification",
        "Secure encoding (Base64) for username and source",
        "User-friendly error messages for incorrect passwords",
        "Click tracking still works for private links"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FaEyeSlash,
      title: "Profile Privacy Settings",
      description: "Granular control over what information is visible in your public profile. Each setting can be toggled independently:",
      settings: [
        "Profile visibility (public/private)",
        "Search visibility (enable/disable)",
        "Email address visibility",
        "Location visibility",
        "Bio visibility",
        "Passion visibility",
        "Profile image visibility",
        "Link count display",
        "Click statistics display"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaUserShield,
      title: "Hide Your Profile",
      description: "Make your profile completely private. When set to private:",
      features: [
        "Profile only accessible if you share the direct link",
        "Not visible in user search results",
        "All content respects privacy settings",
        "You can still preview your own profile",
        "Full control over discoverability"
      ],
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: FaShieldAlt,
      title: "Security Features",
      description: "All in1 url implements industry-standard security measures:",
      features: [
        "JWT Authentication - Secure token-based authentication",
        "Password Hashing - Bcrypt encryption for passwords",
        "HTTPS Encryption - All data transmitted securely",
        "Cookie-based Sessions - Secure session management",
        "Helmet.js Protection - Security headers to prevent attacks",
        "CORS Configuration - Controlled cross-origin access",
        "Input Validation - Client and server-side validation",
        "SQL Injection Prevention - Using parameterized queries"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: FaServer,
      title: "Privacy First",
      description: "Your data is yours",
      features: [
        "No Tracking Scripts - No Google Analytics or third-party trackers",
        "No Data Selling - Your data is yours",
        "Open Source - Transparent code you can audit",
        "User Control - You control your data and links",
        "Secure Storage - All data stored securely"
      ],
      gradient: "from-orange-500 to-red-500"
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
            Security & Privacy
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Learn how to protect your links, secure your profile, and maintain your privacy. Get your own domain FREE to manage everything professionally and reflect your brand identity securely.
          </motion.p>
        </motion.div>

        {/* Security Features */}
        <div className="space-y-8 md:space-y-12">
          {securityFeatures.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden"
              >
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient || "from-purple-500 to-pink-500"} text-white`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {feature.description}
                </p>

                {/* Link Privacy Levels */}
                {feature.levels && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {feature.levels.map((level, i) => (
                      <motion.div
                        key={level.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 + i * 0.1 }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${level.color} bg-opacity-10 border border-gray-200 dark:border-gray-700`}
                      >
                        <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                          {level.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {level.description}
                        </p>
                        <ul className="space-y-1.5">
                          {level.features.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                              <FaCheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Features List */}
                {feature.features && (
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                        <FaCheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Settings List */}
                {feature.settings && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {feature.settings.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                        <FaCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
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

export default Security;



