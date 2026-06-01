import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaTwitter, FaDribbble, FaHeart, FaRocket } from 'react-icons/fa';

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const footerLinks = {
    Resources: [
      { href: 'https://deepak-aryan.vercel.app/', label: 'Portfolio', external: true },
      { href: 'https://www.instagram.com/uffh_rn/?hl=en', label: 'Instagram', external: true },
    ],
    'Follow Us': [
      { href: 'https://github.com/DpkRn', label: 'GitHub', external: true },
      { href: 'https://www.linkedin.com/in/deepak-kumar-b3181a236/', label: 'LinkedIn', external: true },
    ],
    Legal: [
      { href: '#', label: 'Privacy Policy', external: false },
      { href: '#', label: 'Terms & Conditions', external: false },
    ],
    About: [
      { to: '/about-developer', label: 'About Developer', external: false },
    ],
  };

  const socialLinks = [
    { href: '#', icon: FaFacebook, label: 'Facebook', color: 'hover:text-blue-500' },
    { href: '#', icon: FaTwitter, label: 'Twitter', color: 'hover:text-cyan-400' },
    { href: 'https://github.com/DpkRn', icon: FaGithub, label: 'GitHub', color: 'hover:text-gray-300' },
    { href: '#', icon: FaDribbble, label: 'Dribbble', color: 'hover:text-pink-500' },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 dark:border-gray-700/50">
      {/* Interactive Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <a
                href="https://deepak-aryan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group mb-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-10 w-10 filter brightness-0 invert dark:brightness-100 dark:invert-0 transition-all duration-300"
                    alt="Dwizard Logo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Dwizard
                </span>
              </a>
              <p className="text-gray-700 dark:text-gray-500 text-sm leading-normal max-w-xs">
                Building innovative solutions to simplify digital life and empower users worldwide.
              </p>
            </motion.div>
          </div>

          {/* Footer Links Sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                {title}
              </h2>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => {
                  // Special styling for "About Developer" button
                  const isAboutDeveloper = link.label === 'About Developer';
                  
                  return (
                    <li key={linkIndex}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 dark:text-gray-500 hover:text-purple-600 dark:hover:text-gray-300 transition-colors duration-200 text-sm flex items-center gap-2 group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                          <FaRocket className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </a>
                      ) : link.to ? (
                        <motion.div
                          className="relative inline-block"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Animated Background Glow for About Developer */}
                          {isAboutDeveloper && (
                            <>
                              <motion.div
                                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 blur-sm"
                                animate={{
                                  opacity: [0.2, 0.4, 0.2],
                                  scale: [1, 1.05, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                              <motion.div
                                className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-30 blur-xs"
                                animate={{
                                  opacity: [0.1, 0.3, 0.1],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.5,
                                }}
                              />
                            </>
                          )}
                          <Link
                            to={link.to}
                            className={`relative text-sm flex items-center gap-2 group ${
                              isAboutDeveloper
                                ? 'px-3 py-1.5 rounded-lg font-semibold bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 dark:from-purple-500/30 dark:via-pink-500/30 dark:to-blue-500/30 border border-purple-400/30 dark:border-purple-400/50 text-purple-700 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl'
                                : 'text-gray-700 dark:text-gray-500 hover:text-purple-600 dark:hover:text-gray-300 transition-colors duration-200'
                            }`}
                          >
                            <motion.span
                              className={`${
                                isAboutDeveloper
                                  ? 'group-hover:translate-x-1'
                                  : 'group-hover:translate-x-1'
                              } transition-transform duration-200`}
                              animate={
                                isAboutDeveloper
                                  ? {
                                      x: [0, 2, 0],
                                    }
                                  : {}
                              }
                              transition={
                                isAboutDeveloper
                                  ? {
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }
                                  : {}
                              }
                            >
                              {link.label}
                            </motion.span>
                            <motion.div
                              animate={
                                isAboutDeveloper
                                  ? {
                                      rotate: [0, 10, -10, 0],
                                      scale: [1, 1.2, 1],
                                    }
                                  : {}
                              }
                              transition={
                                isAboutDeveloper
                                  ? {
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }
                                  : {}
                              }
                            >
                              <FaRocket
                                className={`${
                                  isAboutDeveloper
                                    ? 'w-4 h-4 opacity-100 text-purple-500 dark:text-purple-400'
                                    : 'w-3 h-3 opacity-0 group-hover:opacity-100'
                                } transition-opacity duration-200`}
                              />
                            </motion.div>
                            {/* Shimmer effect for About Developer */}
                            {isAboutDeveloper && (
                              <motion.div
                                className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{
                                  x: ['-100%', '100%'],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatDelay: 1,
                                  ease: "easeInOut",
                                }}
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-700 dark:text-gray-500 hover:text-purple-600 dark:hover:text-gray-300 transition-colors duration-200 text-sm flex items-center gap-2 group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                          <FaRocket className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="my-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-gray-700 dark:text-gray-500 text-center sm:text-left"
          >
            © 2025{' '}
            <a
              href="https://allin1url.in"
              className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-200"
            >
              All in1 url™
            </a>
            . All Rights Reserved.
          </motion.span>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center sm:justify-end gap-4"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target={social.href !== '#' ? '_blank' : undefined}
                  rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-700 dark:text-gray-500 ${social.color} transition-colors duration-200 p-2 rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 dark:border-gray-700/50`}
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Made with Love */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-gray-700 dark:text-gray-600 flex items-center justify-center gap-2">
            Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              className="text-red-500"
            >
              <FaHeart />
            </motion.span>
            by{' '}
            <a
              href="https://deepak-aryan.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-200"
            >
              Dwizard
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
