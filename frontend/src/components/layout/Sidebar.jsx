import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarMenu, toggleDarkMode } from "../../redux/pageSlice";
import { setAuthenticated, setLinks, setNotifications, setUser } from "../../redux/userSlice";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FiHome, FiLink, FiBarChart2, FiList, FiSettings, FiLogOut,
  FiMoon, FiSun, FiBell, FiMenu, FiX, FiUser, FiExternalLink
} from "react-icons/fi";
import { useState, useEffect, useRef, useCallback } from "react";
import Notification from "../notification/Notification";

const navItems = [
  { to: "/home", label: "Dashboard", icon: FiHome },
  { to: "/links", label: "My Links", icon: FiLink },
  { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/click-details", label: "Click Details", icon: FiList },
];

const SidebarContent = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useSelector((s) => s.page);
  const { user, links, notifications } = useSelector((s) => s.admin);
  const username = user?.username;
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    dispatch(setNotifications(links.reduce((acc, l) => acc + (l.notSeen || 0), 0)));
  }, [links, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const handleSignOut = async () => {
    try {
      const res = await api.get("/auth/signout", { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
        dispatch(setLinks([]));
        navigate("/login", { replace: true });
        toast.success(res.data.message);
        onClose?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign out failed");
    }
  };

  const handleMarkRead = async () => {
    try {
      const res = await api.post("/source/notifications", {}, { withCredentials: true });
      if (res.status === 201) {
        const linksRes = await api.post("/source/getallsource", { username }, { withCredentials: true });
        if (linksRes.status === 200) dispatch(setLinks(linksRes.data.sources));
        dispatch(setNotifications(0));
        toast.success("All notifications marked as read");
      }
    } catch (err) {
      toast.error("Failed to mark notifications as read");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <img src="/web-app-manifest-192x192.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain" onError={(e) => { e.target.src = '/favicon-96x96.png'; }} />
        <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">All in1 url</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Menu</p>
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-600 dark:text-violet-400" : ""}`} />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Profile</p>
          <Link
            to="/profile"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/profile"
                ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <FiUser className="w-4 h-4 flex-shrink-0" />
            Profile
          </Link>
          <Link
            to="/settings"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/settings"
                ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <FiSettings className="w-4 h-4 flex-shrink-0" />
            Settings
          </Link>
        </div>

        {/* Hub Link */}
        {username && (
          <div className="pt-4">
            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Hub</p>
            <a
              href={`https://${username}.allin1url.in`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <FiExternalLink className="w-4 h-4 flex-shrink-0" />
              View Hub Page
            </a>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 border-t border-slate-100 dark:border-slate-800 p-3 space-y-1">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((s) => !s)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <div className="relative">
              <FiBell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </div>
            Notifications
            {notifications > 0 && (
              <span className="ml-auto text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                {notifications}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                  {notifications > 0 && (
                    <button onClick={handleMarkRead} className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <Notification onClose={() => { setNotifOpen(false); onClose?.(); }} />
                </div>
                <button
                  onClick={async () => {
                    if (notifications > 0) await handleMarkRead();
                    setNotifOpen(false);
                    navigate("/click-details");
                    onClose?.();
                  }}
                  className="w-full p-2.5 text-xs font-medium text-center text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors border-t border-slate-100 dark:border-slate-800"
                >
                  View all activity
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* User + Sign Out */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 mt-1">
          <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
            {username?.[0] || "U"}
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate flex-1">{username}</span>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarMenu } = useSelector((s) => s.page);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-60 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => dispatch(setSidebarMenu(true))}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/web-app-manifest-192x192.png" alt="Logo" className="w-7 h-7 rounded-lg object-contain" onError={(e) => { e.target.src = '/favicon-96x96.png'; }} />
          <span className="text-sm font-bold text-slate-900 dark:text-white">All in1 url</span>
        </div>
        <div className="w-9" />
      </header>

      {/* Mobile Drawer */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {sidebarMenu && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => dispatch(setSidebarMenu(false))}
                className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
              />
              <motion.div
                key="drawer"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 w-60 z-[9999] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col lg:hidden"
              >
                <button
                  onClick={() => dispatch(setSidebarMenu(false))}
                  className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
                <SidebarContent onClose={() => dispatch(setSidebarMenu(false))} />
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Sidebar;
