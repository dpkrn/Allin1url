import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/pageSlice";
import { FiSun, FiMoon, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const docsItems = [
  { to: "/docs/features", label: "Features" },
  { to: "/docs/benefits", label: "Benefits" },
  { to: "/docs/security", label: "Security" },
  { to: "/docs/how-to-use", label: "How to Use" },
  { to: "/docs/different", label: "How it's Different" },
];

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const darkMode = useSelector((s) => s.page.darkMode);
  const [docsOpen, setDocsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const docsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (docsRef.current && !docsRef.current.contains(e.target)) setDocsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDocsActive = location.pathname.startsWith("/docs") || location.pathname === "/doc";

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/web-app-manifest-192x192.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain" onError={(e) => { e.target.src = '/favicon-96x96.png'; }} />
            <span className="text-base font-bold text-slate-900 dark:text-white">All in1 url</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Docs Dropdown — desktop */}
            <div className="relative hidden md:block" ref={docsRef}>
              <button
                onClick={() => setDocsOpen((s) => !s)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDocsActive
                    ? "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Docs
                <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${docsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {docsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {docsItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDocsOpen(false)}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          location.pathname === item.to
                            ? "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            {/* Get Started — desktop */}
            <button
              onClick={() => navigate("/login")}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ml-1"
            >
              Get Started
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">Docs</p>
              {docsItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    location.pathname === item.to
                      ? "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => { navigate("/login"); setMobileOpen(false); }}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Nav;
