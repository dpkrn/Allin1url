import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../redux/pageSlice';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import axios from 'axios';
import profile from '../../assets/profile.png';
import logo from '../../assets/logo.png';

const AboutDeveloper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const darkMode = useSelector(store => store.page.darkMode);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [collaborators, setCollaborators] = useState([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);

  // Add edge animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes edge-glow {
        0%, 100% {
          box-shadow: 
            0 0 5px rgba(147, 51, 234, 0.4),
            0 0 10px rgba(236, 72, 153, 0.3),
            0 0 15px rgba(59, 130, 246, 0.2),
            inset 0 0 5px rgba(147, 51, 234, 0.2);
        }
        50% {
          box-shadow: 
            0 0 15px rgba(147, 51, 234, 0.6),
            0 0 25px rgba(236, 72, 153, 0.5),
            0 0 35px rgba(59, 130, 246, 0.4),
            inset 0 0 10px rgba(147, 51, 234, 0.3);
        }
      }
      @keyframes edge-shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }
      .edge-animated {
        position: relative;
        transition: all 0.3s ease;
      }
      .edge-animated::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(147, 51, 234, 0.6),
          rgba(236, 72, 153, 0.6),
          rgba(59, 130, 246, 0.6),
          rgba(147, 51, 234, 0.6),
          transparent
        );
        background-size: 200% 100%;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 0;
      }
      .edge-animated:hover {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .edge-animated:hover::before {
        opacity: 1;
        animation: edge-shimmer 2s linear infinite;
      }
      .dark .edge-animated:hover {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .edge-animated-always {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .edge-animated-always::before {
        opacity: 1;
        animation: edge-shimmer 2s linear infinite;
      }
      .dark .edge-animated-always {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .dark .edge-animated::before {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(168, 85, 247, 0.7),
          rgba(244, 114, 182, 0.7),
          rgba(96, 165, 250, 0.7),
          rgba(168, 85, 247, 0.7),
          transparent
        );
        background-size: 200% 100%;
      }
      .edge-animated > * {
        position: relative;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

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

  // Fetch GitHub collaborators
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        setLoadingCollaborators(true);
        const response = await axios.get('https://api.github.com/repos/DpkRn/LinkBridger/collaborators', {
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${import.meta.env?.VITE_GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });
        setCollaborators(response.data);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      } finally {
        setLoadingCollaborators(false);
      }
    };

    fetchCollaborators();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const roles = [
    {
      title: 'Role: Backend Development',
      name: 'Deepak Kumar',
      email: 'd.wizard.techno@gmail.com',
    //   description: 'Building robust server-side applications with Node.js, Express, and MongoDB.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
    },
    {
      title: 'Role: Frontend Development',
      name: 'Deepak Kumar',
      email: 'd.wizard.techno@gmail.com',
    //   description: ' beautiful and responsive user interfaces with React, Tailwind CSS, and modern web technologies.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Role: Network Architecture',
      name: 'Deepak Kumar',
      email: 'd.wizard.techno@gmail.com',
    //   description: 'Designing and implementing scalable network architectures, ensuring optimal performance and security.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-sky-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation Bar */}
    
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="py-12 px-4"
      >
        <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
            About Developer
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Developer Card */}
        <motion.div
          variants={fadeInUp}
          className="edge-animated edge-animated-always bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 mb-12 transition-colors duration-300"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50"></div>
                <img
                  src={profile}
                  alt="Deepak Kumar"
                  className="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/224?text=DK';
                  }}
                />
              </motion.div>
            </div>

            {/* Developer Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300"
              >
                Deepak Kumar
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300"
              >
                I created LinkBridger to solve a real problem: managing multiple social media and professional links scattered across different platforms. 
                Instead of sharing long, forgettable URLs, LinkBridger lets you create memorable, personalized links that reflect your brand. With granular
                privacy controls, customizable notifications, and password protection, you have complete control over your digital presence. Plus, get a free custom domain to make your link truly yours and establish your unique online identity.
              </motion.p>

              {/* Social Links */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center md:justify-start gap-4"
              >
                <a
                  href="https://github.com/DpkRn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/deepak-kumar-b3181a236/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://deepak-aryan.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Portfolio"
                >
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Roles Section */}
        <motion.div variants={staggerContainer} className="mb-8">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 transition-colors duration-300"
          >
            Developers & Contributors
          </motion.h2>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="edge-animated bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 mx-auto">
                  <div className="text-white">{role.icon}</div>
                </div>

                {/* Role Title */}
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center transition-colors duration-300">
                  {role.title}
                </h3>

                {/* Name and Email */}
                <div className="mb-3 text-center">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-300">
                    {role.name}
                  </p>
                  <a
                    href={`mailto:${role.email}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                  >
                    {role.email}
                  </a>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-center transition-colors duration-300">
                  {role.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Back Button */}
        <motion.div variants={fadeInUp} className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </motion.div>

        {/* GitHub Collaborators Section */}
        {collaborators.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-16 pt-12 border-t border-gray-300 dark:border-gray-700">
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8 transition-colors duration-300"
            >
              GitHub Collaborators
            </motion.h2>
            <motion.div variants={staggerContainer} className="bg-black rounded-xl p-8 shadow-lg">
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {collaborators.map((collaborator) => (
                  <motion.a
                    key={collaborator.id}
                    href={collaborator.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-2 p-4 hover:bg-gray-900 rounded-lg transition-colors duration-200"
                  >
                    <img
                      src={collaborator.avatar_url}
                      alt={collaborator.login}
                      className="w-12 h-12 rounded-full border-2 border-gray-600"
                    />
                    <span className="text-sm font-semibold text-white">
                      {collaborator.login}
                    </span>
                  </motion.a>
                ))}
              </div>
              <p className="text-center text-sm text-gray-400 mt-6">
                These talented developers contribute to LinkBridger on GitHub
              </p>
            </motion.div>
          </motion.div>
        )}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutDeveloper;
