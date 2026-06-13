import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";
import { setLinks, setNotifications } from "../redux/userSlice";
import CreateBridge from "./pages/CreateBridge";
import LinkPage from "./pages/LinkPage";
import Template from "./preview/Template";
import Notification from "./notification/Notification";

const DashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleMarkRead = async () => {
    try {
      const res = await api.post("/source/notifications", {}, { withCredentials: true });
      if (res.status === 201) {
        const linksRes = await api.post("/source/getallsource", { username }, { withCredentials: true });
        if (linksRes.status === 200) dispatch(setLinks(linksRes.data.sources));
        dispatch(setNotifications(0));
        toast.success("All notifications marked as read");
      }
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your links and see what's happening</p>
        </div>

        {/* Notification Bell */}
        <div className="relative flex-shrink-0" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((s) => !s)}
            className="relative p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
            title="Notifications"
          >
            <FiBell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {notifications > 9 ? "9+" : notifications}
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
                className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                  {notifications > 0 && (
                    <button onClick={handleMarkRead} className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  <Notification onClose={() => setNotifOpen(false)} />
                </div>
                <button
                  onClick={async () => {
                    if (notifications > 0) await handleMarkRead();
                    setNotifOpen(false);
                    navigate("/click-details");
                  }}
                  className="w-full p-2.5 text-xs font-medium text-center text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors border-t border-slate-100 dark:border-slate-800"
                >
                  View all activity
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          <CreateBridge />
          <LinkPage />
        </div>
        <div className="hidden xl:block">
          <div className="sticky top-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hub Preview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Live preview of your public link hub</p>
              </div>
              <Template height="h-[600px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
