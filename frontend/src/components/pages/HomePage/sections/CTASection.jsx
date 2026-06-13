import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const CTASection = ({
  title = "Ready to Transform Your Links?",
  subtitle = "Join thousands of professionals who trust All in1 url to manage their social presence",
  ctaText = "Get Started Now",
  ctaAction = null,
  className = "",
}) => {
  const navigate = useNavigate();
  const handleCtaClick = () => (ctaAction ? ctaAction() : navigate('/login'));

  return (
    <section className={`py-24 bg-violet-600 dark:bg-violet-700 relative overflow-hidden ${className}`}>
      {/* Subtle decorative rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/5" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">{title}</h2>
          <p className="text-lg sm:text-xl text-violet-100 mb-8 sm:mb-10">{subtitle}</p>
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold text-base sm:text-lg rounded-xl shadow-xl hover:shadow-2xl hover:bg-violet-50 transition-all duration-200"
          >
            {ctaText}
            <FiArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
