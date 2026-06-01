import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const CTASection = ({
  title = "Ready to Transform Your Links?",
  subtitle = "Join thousands of professionals who trust All in1 url to manage their social presence",
  ctaText = "Get Started Now",
  ctaAction = null,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (ctaAction) {
      ctaAction();
    } else {
      navigate('/login');
    }
  };

  return (
    <section className={`py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            {title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
            {subtitle}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCtaClick}
            className="px-6 py-3 sm:px-10 sm:py-5 bg-white text-purple-600 font-bold text-base sm:text-lg md:text-xl rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
          >
            {ctaText}
            <FaArrowRight />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

