import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = ({
  features = [],
  title = "Powerful Features",
  subtitle = "Everything you need to manage your social presence in one place",
  className = "",
  sectionRef = null,
  layout = "grid",
}) => {
  const featuresRef = sectionRef || React.useRef(null);

  const normalizedFeatures = features.map(f => ({
    ...f,
    description: f.description || f.desc || "",
    color: f.color || f.gradient || 'from-violet-500 to-purple-500',
  }));

  const ICON_BG_COLORS = [
    'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
    'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400',
    'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
    'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
    'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  ];

  return (
    <section ref={featuresRef} className={`py-20 bg-white dark:bg-slate-950 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
        </motion.div>

        {layout === "list" ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {normalizedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const iconColor = ICON_BG_COLORS[index % ICON_BG_COLORS.length];
              return (
                <motion.div
                  key={feature.title || index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 sm:p-6 flex items-start gap-4 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                >
                  {Icon && (
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                      {typeof Icon === 'function' ? <Icon className="w-5 h-5" /> : <div className="text-lg">{Icon}</div>}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {normalizedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const iconColor = ICON_BG_COLORS[index % ICON_BG_COLORS.length];
              return (
                <motion.div
                  key={feature.title || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all flex flex-col"
                >
                  {Icon && (
                    <div className={`inline-flex w-10 h-10 rounded-lg items-center justify-center mb-4 ${iconColor}`}>
                      {typeof Icon === 'function' ? <Icon className="w-5 h-5" /> : <div className="text-xl">{Icon}</div>}
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
