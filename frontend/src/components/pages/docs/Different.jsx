import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaCheck, FaTimes, FaStar, FaDollarSign, FaLock, FaCode, FaUsers } from 'react-icons/fa';
import Footer from '../../footer/Footer';

const Different = () => {
  const comparisons = [
    {
      platform: "All in1 url",
      features: [
        "Human-readable, memorable links",
        "Never expires",
        "Centralized management",
        "Built-in analytics",
        "Free and open source",
        "Link privacy controls",
        "Password protection",
        "User search",
        "Granular privacy settings",
        "Customizable email notifications"
      ],
      color: "from-purple-500 to-pink-500",
      icon: FaStar
    },
    {
      platform: "Link Shorteners (bit.ly, tinyurl)",
      features: [
        "Random codes",
        "Often expires",
        "Must update each link",
        "Limited or premium analytics",
        "Often requires paid plans",
        "No privacy controls",
        "No password protection",
        "No user search",
        "No privacy settings",
        "No notifications"
      ],
      color: "from-gray-400 to-gray-600",
      icon: FaTimes
    },
    {
      platform: "Linktree",
      features: [
        "Platform-dependent branding",
        "Usually permanent",
        "Centralized management",
        "Premium analytics",
        "Premium features locked",
        "Limited privacy controls",
        "Premium password protection",
        "Limited search",
        "Limited privacy settings",
        "Premium notifications"
      ],
      color: "from-green-400 to-green-600",
      icon: FaCheck
    },
    {
      platform: "Bio.link",
      features: [
        "Platform-dependent branding",
        "Usually permanent",
        "Centralized management",
        "Premium analytics",
        "Premium features locked",
        "Limited privacy controls",
        "Premium password protection",
        "Limited search",
        "Limited privacy settings",
        "Premium notifications"
      ],
      color: "from-blue-400 to-blue-600",
      icon: FaCheck
    }
  ];

  const advantages = [
    {
      icon: FaStar,
      title: "Brand Identity",
      description: "Your links become part of your brand identity, not generic shortened URLs. When someone sees 'yourname.allin1url.in/linkedin', they immediately know it's your link and can easily remember the pattern for other platforms.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FaUsers,
      title: "User Trust",
      description: "Transparent, readable URLs build more trust than mysterious short codes. Users can see where the link will take them before clicking, reducing phishing concerns.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaCode,
      title: "SEO Friendly",
      description: "Descriptive URLs are better for search engines (better indexing), social media previews (richer link previews), email clients (clear link text), and screen readers (better accessibility).",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: FaLock,
      title: "No Vendor Lock-in",
      description: "Open source means you can self-host if needed, you're not dependent on a single service, you can customize to your needs, and the community can improve and maintain it.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: FaUsers,
      title: "Community Driven",
      description: "Built by developers, for developers: active community support, regular updates and improvements, open to contributions, and transparent development process.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: FaDollarSign,
      title: "Cost Effective",
      description: "All in1 url is free forever and open source. Compare to Linktree Pro ($6-24/month), Bio.link Pro ($3-9/month), or Custom Domain Services ($10-50+/month + setup fees).",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: FaLock,
      title: "Privacy First",
      description: "No tracking scripts, no third-party analytics, no data selling, open source (auditable), and user-controlled data.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: FaCode,
      title: "Flexibility",
      description: "Add any platform (not limited to predefined list), custom platform names, full control over link structure, and no restrictions on number of links.",
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
            How It's Different
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            See how All in1 url compares to other platforms and why it's superior
          </motion.p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 overflow-x-auto"
        >
          <div className="min-w-full inline-block">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {comparisons.map((platform, idx) => {
                const IconComponent = platform.icon;
                return (
                  <motion.div
                    key={platform.platform}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6 overflow-hidden ${
                      idx === 0 ? "ring-2 ring-purple-500" : ""
                    }`}
                  >
                    {/* Platform Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${platform.color} text-white`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
                        {platform.platform}
                      </h3>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2">
                      {platform.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {idx === 0 ? (
                            <FaCheck className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <span className="w-3 h-3 mt-0.5 flex-shrink-0">•</span>
                          )}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Why All in1 url is Superior */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white">
            Why All in1 url is Superior
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {advantages.map((advantage, idx) => {
              const IconComponent = advantage.icon;
              return (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden group"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className="relative z-10 mb-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${advantage.gradient} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      {advantage.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Different;



