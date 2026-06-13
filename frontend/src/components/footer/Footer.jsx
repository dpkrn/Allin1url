import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

const docLinks = [
  { to: '/docs/features', label: 'Features' },
  { to: '/docs/benefits', label: 'Benefits' },
  { to: '/docs/security', label: 'Security' },
  { to: '/docs/how-to-use', label: 'How to Use' },
  { to: '/docs/different', label: "How it's Different" },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img
                src="/web-app-manifest-192x192.png"
                alt="AllIn1URL – Link in Bio Platform"
                className="w-7 h-7 rounded-lg object-contain"
                onError={(e) => { e.target.src = '/favicon-96x96.png'; }}
              />
              <span className="font-bold text-slate-900 dark:text-white">AllIn1URL</span>
            </Link>
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Link in Bio Platform</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              AllIn1URL helps creators, developers, founders and professionals manage their online presence. Create your professional profile at allin1url.in.
            </p>
          </div>

          {/* Docs */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Docs
            </h3>
            <ul className="space-y-2.5">
              {docLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Project
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about-developer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  About Developer
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/DpkRn/LinkBridger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Source Code
                  <FiGithub className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-slate-400 dark:text-slate-600 cursor-not-allowed select-none">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-400 dark:text-slate-600 cursor-not-allowed select-none">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} AllIn1URL – Link in Bio Platform. Built by{' '}
            <a
              href="https://deepak-aryan.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
            >
              Deepak Kumar
            </a>.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/DpkRn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FiGithub className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/deepak-kumar-b3181a236/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            >
              <FiLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
