import React from 'react';
import { motion } from 'framer-motion';
import { FaLink, FaCog, FaChartLine, FaSyncAlt, FaPalette, FaRocket, FaShieldAlt, FaUsers, FaLock, FaEye, FaServer } from 'react-icons/fa';
import Footer from '../../footer/Footer';

const Features = () => {
  const features = [
    {
      icon: FaLink,
      title: "Personalized Smart Links",
      description: "Create memorable, branded links using your username and platform name. Instead of random codes like 'bit.ly/xyz123', get clean URLs like 'yourname.clickly.cv/linkedin' that reflect your brand identity. Get your own domain FREE to manage all your links professionally.",
      gradient: "from-purple-500 to-pink-500",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaCog,
      title: "Link Customization",
      description: "Fully customize your links with any platform name. Add GitHub, LinkedIn, Portfolio, Instagram, Facebook, LeetCode, Codeforces, or any custom platform. Your links follow a clear, memorable pattern.",
      gradient: "from-blue-500 to-cyan-500",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaChartLine,
      title: "Click Analytics & Tracking",
      description: "Track clicks on all your links with detailed analytics. See which platforms get the most engagement, understand your audience, and optimize your networking strategy with real-time statistics.",
      gradient: "from-green-500 to-emerald-500",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: FaSyncAlt,
      title: "Centralized Link Management",
      description: "Update destination URLs once, and all your shared links automatically redirect to the new URL. No more hunting down old links across resumes, business cards, and email signatures.",
      gradient: "from-orange-500 to-red-500",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaPalette,
      title: "Single Hub Link",
      description: "Share one link (clickly.cv/yourname) that acts as a beautiful landing page for all your social profiles. Visitors can browse and choose which platform to visit, creating a professional digital business card.",
      gradient: "from-pink-500 to-rose-500",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaShieldAlt,
      title: "Link Privacy Controls",
      description: "Three-tier visibility system: Public (visible everywhere), Unlisted (visible in profile only), and Private (password-protected). Control who can access your links with granular privacy settings.",
      gradient: "from-indigo-500 to-purple-500",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaUsers,
      title: "User Search & Discovery",
      description: "Search for other users in real-time and view their public profiles. Discover professionals, creators, and developers. Control your own discoverability with search visibility settings.",
      gradient: "from-cyan-500 to-blue-500",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: FaLock,
      title: "Password Protection",
      description: "Secure your private links with password protection. Set passwords for sensitive links, and users will be prompted to enter the password before accessing the destination URL.",
      gradient: "from-red-500 to-orange-500",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: FaEye,
      title: "Profile Privacy Settings",
      description: "Granular control over what information is visible in your public profile. Toggle visibility of email, location, bio, passion, profile image, link count, and click statistics independently.",
      gradient: "from-yellow-500 to-orange-500",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: FaServer,
      title: "Your Own Domain",
      description: "After registering, you'll get your own personalized domain to manage all your links. Your domain will reflect your brand identity and make your links more professional and memorable. Perfect for building your online presence!",
      gradient: "from-teal-500 to-cyan-500",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: FaChartLine,
      title: "Advanced Analytics",
      description: "Get comprehensive insights into every click with detailed analytics. Track where clicks originated from, the exact time of each click, geographic location, device type (mobile, tablet, desktop), browser type, referrer information, and much more. Understand your audience better with granular data about every interaction.",
      gradient: "from-blue-500 to-cyan-500",
      color: "from-blue-500 to-cyan-500"
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
            Features
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover what LinkBridger can do for you. Powerful features designed to transform your social media presence.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden group"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className="relative z-10 mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
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

export default Features;



