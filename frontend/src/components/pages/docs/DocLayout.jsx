import { Link, useLocation } from "react-router-dom";
import { FiZap, FiAward, FiShield, FiBookOpen, FiBarChart2, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import Footer from "../../footer/Footer";

const navLinks = [
  { to: "/docs/features", label: "Features", icon: FiZap },
  { to: "/docs/benefits", label: "Benefits", icon: FiAward },
  { to: "/docs/security", label: "Security", icon: FiShield },
  { to: "/docs/how-to-use", label: "How to Use", icon: FiBookOpen },
  { to: "/docs/different", label: "How it's Different", icon: FiBarChart2 },
];

const DocLayout = ({ title, subtitle, badge, children }) => {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Page hero */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {badge && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 mb-3">
              {badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Mobile nav toggle */}
      <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-[65px] z-30">
        <button
          onClick={() => setMobileNavOpen((s) => !s)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          <span className="flex items-center gap-2">
            {(() => {
              const current = navLinks.find((l) => l.to === location.pathname);
              const Icon = current?.icon;
              return Icon ? <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" /> : null;
            })()}
            {navLinks.find((l) => l.to === location.pathname)?.label || "Docs"}
          </span>
          {mobileNavOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
        </button>
        {mobileNavOpen && (
          <nav className="border-t border-slate-100 dark:border-slate-800 px-3 pb-3 pt-1 space-y-0.5">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:flex lg:gap-10">
        {/* Left sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24 space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-3">
              Documentation
            </p>
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-600 dark:text-violet-400" : ""}`} />
                  {label}
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />}
                </Link>
              );
            })}

            <div className="pt-6 px-3">
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-4 border border-violet-100 dark:border-violet-900/50">
                <p className="text-xs font-semibold text-violet-800 dark:text-violet-300 mb-1">Ready to start?</p>
                <p className="text-xs text-violet-600 dark:text-violet-400 mb-3">Get your free subdomain and start managing links today.</p>
                <Link
                  to="/login"
                  className="block w-full text-center text-xs font-semibold py-1.5 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DocLayout;
