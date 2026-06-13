import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedCounter = ({ end, suffix = "", statsInView }) => {
  const [count, setCount] = React.useState(0);
  const rafRef = React.useRef(null);
  const mountedRef = React.useRef(true);
  const hasAnimatedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasAnimatedRef.current) {
      setCount(0);
      hasAnimatedRef.current = false;
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    }
    if (!statsInView) return;
    mountedRef.current = true;
    hasAnimatedRef.current = true;
    let startTime = null;
    const duration = 2000;
    const animate = (t) => {
      if (!mountedRef.current) return;
      if (!startTime) startTime = t;
      const progress = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      if (mountedRef.current) setCount(Math.floor(eased * end));
      if (progress < 1 && mountedRef.current) rafRef.current = requestAnimationFrame(animate);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      mountedRef.current = false;
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [statsInView, end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const StatisticsSection = ({
  stats = [],
  title = "Trusted by Thousands",
  subtitle = "Join the community of professionals, creators, and developers",
  className = "",
  sectionRef = null,
}) => {
  const fallbackRef = useRef(null);
  const statsRef = sectionRef || fallbackRef;
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section ref={statsRef} className={`py-20 bg-slate-50 dark:bg-slate-900 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl text-violet-600 dark:text-violet-400 flex justify-center mb-3">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {statsInView ? <AnimatedCounter end={stat.value} suffix={stat.suffix} statsInView={statsInView} /> : `0${stat.suffix}`}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
