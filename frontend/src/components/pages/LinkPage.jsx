import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Linkcard from "../linkcard/Linkcard";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { FiLink, FiBarChart2, FiPlus, FiEye, FiExternalLink } from "react-icons/fi";
import { setLinks } from "../../redux/userSlice";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { getUserLinkUrl } from "../../lib/utils";

const LinkPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const linkRef = useRef(null);
  const location = useLocation();
  const isStandalone = location.pathname === "/links";

  const links = useSelector((store) => store.admin.links);
  const username = useSelector((store) => store.admin.user.username);
  const totalClicks = links.reduce((sum, l) => sum + (l.clicked || 0), 0);

  useEffect(() => {
    const getAllLinks = async () => {
      try {
        const res = await api.post("/source/getallsource", { username }, { withCredentials: true });
        if (res.status === 200 && res.data.success) dispatch(setLinks(res.data.sources));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load links");
      }
    };
    getAllLinks();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkRef.current.innerText)
      .then(() => toast.success("Hub link copied!"))
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div className={isStandalone ? "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto" : ""}>
      {/* Page header — only when standalone */}
      {isStandalone && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Links</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage all your personalized links</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/preview")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 transition-colors"
            >
              <FiEye className="w-4 h-4" />
              Preview Hub
            </button>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              New Link
            </button>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Links", value: links.length, icon: FiLink, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" },
          { label: "Total Clicks", value: totalClicks, icon: FiBarChart2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
          { label: "Hub Status", value: "Live", icon: FiExternalLink, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-3 sm:p-4">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Hub link card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Hub Link</p>
          <a
            href={`https://${username}.allin1url.in`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"
          >
            Open <FiExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2.5 border border-slate-200 dark:border-slate-700">
          <span ref={linkRef} className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 truncate">
            {getUserLinkUrl(username)}
          </span>
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 p-1.5 rounded-md text-slate-400 hover:text-violet-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            title="Copy hub link"
          >
            <MdContentCopy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Links list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {links.length > 0 ? `${links.length} link${links.length !== 1 ? 's' : ''}` : "Links"}
          </h2>
        </div>

        {links.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-10 text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiLink className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">No links yet</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Create your first link to get started</p>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Create Link
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {links.map((link, i) => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Linkcard sources={link} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkPage;
