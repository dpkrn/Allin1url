import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiBell, FiLink, FiTrendingUp, FiClock } from "react-icons/fi";

const getRelativeTime = (dateStr) => {
  if (!dateStr) return null;
  const ms = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(ms / 60000);
  const h = Math.floor(ms / 3600000);
  const d = Math.floor(ms / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const Notification = ({ onClose }) => {
  const navigate = useNavigate();
  const links = useSelector((store) => store.admin.links);
  const notificationsWithClicks = links.filter((link) => link.notSeen > 0);

  const handleItemClick = (link) => {
    navigate(`/click-details?linkId=${link._id}`);
    onClose?.();
  };

  if (notificationsWithClicks.length === 0) {
    return (
      <div className="py-10 px-4 text-center">
        <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <FiBell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">All caught up</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          No new clicks since your last visit
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {notificationsWithClicks.map((link) => (
        <button
          key={link._id}
          onClick={() => handleItemClick(link)}
          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center mt-0.5">
              <FiTrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {link.notSeen} new {link.notSeen === 1 ? "click" : "clicks"}
                </span>
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-violet-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                <FiLink className="w-3 h-3 flex-shrink-0" />
                {link.source || "link"}
              </p>
              {link.destination && (
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {link.destination}
                </p>
              )}
              {link.updatedAt && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                  <FiClock className="w-3 h-3 flex-shrink-0" />
                  {getRelativeTime(link.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Notification;
