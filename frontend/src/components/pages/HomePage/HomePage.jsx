import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaRocket, FaLink, FaChartLine, FaSyncAlt, FaUsers,
  FaClock, FaEnvelope, FaCheckCircle, FaBriefcase, FaUserTie,
  FaCode, FaGraduationCap, FaCog, FaServer, FaHome, FaShieldAlt,
} from 'react-icons/fa';
import {
  SiLinkedin, SiGithub, SiInstagram, SiFacebook,
  SiLeetcode, SiYoutube, SiX,
} from 'react-icons/si';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import Footer from '../../footer/Footer';
import { FlipWords } from '../../ui/flip-words';
import { HeroSection, StatisticsSection, CTASection, ComparisonTable, FeaturesSection } from './sections';

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const statsRef = useRef(null);

  const words = [
    { text: "Transform", className: "text-4xl md:text-6xl font-extrabold text-violet-600 dark:text-violet-400" },
    { text: "Your", className: "text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-200" },
    { text: "Social", className: "text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-200" },
    { text: "Presence", className: "text-4xl md:text-6xl font-extrabold text-violet-600 dark:text-violet-400" },
  ];

  const flipWords = ["LinkedIn", "GitHub", "Instagram", "Portfolio", "YouTube", "Twitter"];
  const platformsForFlip = ["linkedin", "github", "leetcode", "portfolio", "instagram", "codeforce"];

  const platforms = [
    { name: "LinkedIn", icon: <SiLinkedin />, color: "text-blue-600" },
    { name: "GitHub", icon: <SiGithub />, color: "text-slate-800 dark:text-slate-200" },
    { name: "Instagram", icon: <SiInstagram />, color: "text-pink-600" },
    { name: "Facebook", icon: <SiFacebook />, color: "text-blue-700" },
    { name: "LeetCode", icon: <SiLeetcode />, color: "text-orange-600" },
    { name: "YouTube", icon: <SiYoutube />, color: "text-red-600" },
    { name: "Twitter", icon: <SiX />, color: "text-blue-400" },
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Active Users", icon: <FaUsers /> },
    { value: 50000, suffix: "+", label: "Links Created", icon: <FaLink /> },
    { value: 1000000, suffix: "+", label: "Clicks Tracked", icon: <FaChartLine /> },
    { value: 99, suffix: "%", label: "Uptime", icon: <FaClock /> },
  ];

  const features = [
    { icon: FaLink, title: "Personalized Smart Links", description: "Generate easy-to-remember links for your social profiles using your username and platform names.", delay: 0.1 },
    { icon: FaHome, title: "All Links at One Place", description: "Access all your profiles with a single hub link. Visit your domain (without any platform name) to see all your links in one organized page.", delay: 0.2 },
    { icon: FaSyncAlt, title: "Centralized Link Management", description: "Update your social profile links in one place, and the change reflects everywhere. No more hunting down old links.", delay: 0.3 },
    { icon: FaEnvelope, title: "Real-Time Email Notifications", description: "Get instant email notifications every time someone visits your links. Customize notification preferences to stay informed in real-time.", delay: 0.4 },
    { icon: FaServer, title: "Your Own Domain", description: "After registering, you'll get your own personalized domain to manage all your links — reflecting your brand identity.", delay: 0.5 },
    { icon: FaChartLine, title: "Advanced Analytics Dashboard", description: "Track clicks, profile visits, location, devices, browsers, OS, referrers, hourly patterns, and day-of-week analysis. Multiple chart types with customizable time ranges.", delay: 0.6 },
    { icon: FaCog, title: "Responsive & Mobile-Optimized", description: "Fully responsive design with adaptive text sizing that works perfectly on all devices with seamless dark/light theme support.", delay: 0.7 },
    { icon: FaShieldAlt, title: "Enterprise-Grade Security", description: "JWT-based authentication, bcrypt password hashing, HTTPS encryption, Helmet.js security headers, CORS protection, and password-protected private links.", delay: 0.8 },
  ];

  const useCases = [
    { title: "Job Seekers", desc: "Create professional links for your resume, LinkedIn, portfolio, and GitHub. Share one memorable link with recruiters and track which platforms they visit most.", icon: FaBriefcase, examples: ["Resume sharing", "Interview preparation", "Professional networking"] },
    { title: "Content Creators", desc: "Manage all your social media profiles from one place. Share your link in bio and watch engagement grow with comprehensive analytics.", icon: FaUserTie, examples: ["Instagram bio links", "YouTube descriptions", "TikTok profiles"] },
    { title: "Developers", desc: "Showcase your GitHub, portfolio, blog, and coding profiles. Analyze click patterns with detailed analytics to optimize your professional presence.", icon: FaCode, examples: ["Portfolio websites", "GitHub profiles", "Tech blogs"] },
    { title: "Students", desc: "Share academic profiles, LinkedIn, research papers, and project portfolios. Great for college applications and networking.", icon: FaGraduationCap, examples: ["College applications", "Academic networking", "Project showcases"] },
    { title: "Businesses", desc: "Create branded links for your company's social media presence. Manage multiple team member profiles efficiently.", icon: FaUsers, examples: ["Team profiles", "Brand consistency", "Social media management"] },
    { title: "Freelancers", desc: "Consolidate your work samples, client testimonials, and contact information in one professional link.", icon: FaRocket, examples: ["Client proposals", "Portfolio sharing", "Service showcases"] },
  ];

  const howItWorksSteps = [
    { step: "1", title: "Create an Account", desc: "Sign up using your email and create an account on All in1 url.", icon: FaRocket },
    { step: "2", title: "Choose a Username", desc: "Pick a username that's easy to remember (e.g., dpkrn). Your link will follow: https://your-username.allin1url.in/instagram.", icon: FaLink },
    { step: "3", title: "Verify Your Account", desc: "Complete email verification to activate your account.", icon: FaCheckCircle },
    { step: "4", title: "Create a New Link", desc: "Enter the platform name (e.g., instagram) in lowercase, paste your profile URL, and click Create Link.", icon: FaCog },
    { step: "5", title: "Share the Link", desc: "Copy and share your smart link. Share your hub link (https://yourname.allin1url.in) to let visitors see all your profiles.", icon: FaSyncAlt },
    { step: "6", title: "Get Real-Time Notifications", desc: "Receive instant email notifications every time someone visits your links. Customize notification preferences to stay informed.", icon: FaEnvelope },
    { step: "7", title: "Analyze with Advanced Analytics", desc: "Track clicks, visits, location, devices, browsers, OS, referrers, hourly patterns, and day-of-week analysis.", icon: FaChartLine },
  ];

  const exampleLinks = [
    { platform: "LinkedIn", color: "text-blue-600" },
    { platform: "GitHub", color: "text-slate-800 dark:text-slate-200" },
    { platform: "LeetCode", color: "text-orange-600" },
    { platform: "Portfolio", color: "text-violet-600 dark:text-violet-400" },
    { platform: "Instagram", color: "text-pink-600" },
    { platform: "Facebook", color: "text-blue-700" },
    { platform: "Codeforces", color: "text-red-600" },
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      {/* Hero */}
      <HeroSection
        words={words}
        flipWords={flipWords}
        description="All in1 url transforms your social media presence with memorable, personalized URLs by providing your own FREE domain that reflects your brand identity."
        highlightText="One link to rule them all. Update once, reflect everywhere."
        platforms={platforms}
        isAuthenticated={isAuthenticated}
      />

      {/* Link demo section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              How Your Links Look
            </h2>
            <p className="text-slate-600 dark:text-slate-400">One base URL — only the platform name changes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
            {/* Header bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 dark:bg-slate-950 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-slate-700 rounded-md px-3 py-1 text-xs font-mono text-slate-400 text-center">
                  https://<span className="text-violet-400 font-bold">dpkrn</span>.allin1url.in
                </div>
              </div>
              <span className="text-xs text-slate-500">Example: username = dpkrn</span>
            </div>

            {/* Links */}
            <div className="p-4 space-y-2">
              {exampleLinks.map((link) => (
                <div key={link.platform} className="flex items-center gap-3 group px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 w-20 flex-shrink-0">{link.platform}</span>
                  <code className="flex-1 text-sm font-mono text-slate-600 dark:text-slate-300 truncate">
                    https://<span className="text-violet-600 dark:text-violet-400 font-bold">dpkrn</span>.allin1url.in/
                    <span className={`font-bold ${link.color}`}>{link.platform.toLowerCase()}</span>
                  </code>
                  <FiArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-violet-500 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Only the platform name changes — everything else stays the same ✨</p>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
              >
                Create your own links →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FlipWords demo */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 dark:bg-slate-800 rounded-2xl border border-slate-700 p-8 sm:p-10 text-center max-w-3xl mx-auto"
          >
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-4">Your personalized hub link</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-mono text-slate-200">
              https://<span className="text-violet-400 font-bold">yourname</span>.allin1url.in/
              <FlipWords words={platformsForFlip} duration={100} className="text-blue-400 font-bold" />
            </p>
            <p className="text-slate-500 text-sm mt-4">Update once — your link always points to the right place</p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Perfect for Everyone</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">AllIn1URL helps creators, developers, founders and professionals manage their online presence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all"
                >
                  <div className="inline-flex w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-950/40 items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{useCase.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{useCase.desc}</p>
                  <div className="space-y-1.5">
                    {useCase.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <FiCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <FeaturesSection
        features={features}
        title="Powerful Features"
        subtitle="Everything you need to manage your social presence in one place"
        layout="grid"
      />

      {/* Comparison Table */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <ComparisonTable />
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              The core idea behind <strong className="text-slate-900 dark:text-white">AllIn1URL – Link in Bio Platform</strong> is to simplify social media link management. Instead of sharing long, hard-to-remember URLs, you create a single personalized URL that automatically redirects users to the correct platform. Create your professional profile at{' '}
              <strong className="text-slate-900 dark:text-white">https://<span className="text-violet-600 dark:text-violet-400">yourname</span>.allin1url.in</strong>.
            </p>
          </motion.div>

          <div className="space-y-4">
            {howItWorksSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                      {item.step}. {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Example box */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-6 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"
          >
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Example:</p>
            <div className="space-y-1.5">
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400">
                Instagram: https://<span className="text-violet-600 dark:text-violet-400 font-bold">dpkrn</span>.allin1url.in/<span className="text-pink-600">instagram</span>
              </p>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400">
                LeetCode: https://<span className="text-violet-600 dark:text-violet-400 font-bold">dpkrn</span>.allin1url.in/<span className="text-orange-600">leetcode</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <StatisticsSection
        stats={stats}
        title="Trusted by Thousands"
        subtitle="Join the community of professionals, creators, and developers"
        sectionRef={statsRef}
      />

      {/* Final CTA */}
      <CTASection
        title="Ready to Transform Your Links?"
        subtitle="Join thousands of professionals who trust All in1 url. Get your own domain FREE to manage your links and reflect your brand identity professionally."
        ctaText="Get Started Now"
      />

      <Footer />
    </div>
  );
};

export default HomePage;
