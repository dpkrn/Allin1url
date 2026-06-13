import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit2, FiTrash2, FiExternalLink, FiMousePointer, FiLock, FiEyeOff, FiGlobe, FiChevronDown } from "react-icons/fi";
import api from "../../utils/api";
import { setLinks } from "../../redux/userSlice";
import { setEditLinkData } from "../../redux/pageSlice";
import { getUserLinkUrl } from "../../lib/utils";

const visibilityConfig = {
  public: { label: "Public", icon: FiGlobe, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  unlisted: { label: "Unlisted", icon: FiEyeOff, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  private: { label: "Private", icon: FiLock, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
};

const Linkcard = ({ sources }) => {
  const linkRef = useRef(null);
  const { username } = useSelector((store) => store.admin.user);
  const links = useSelector((store) => store.admin.links);
  const dispatch = useDispatch();
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { source, destination, clicked, _id, visibility = 'public' } = sources;
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const vis = visibilityConfig[visibility] || visibilityConfig.public;
  const VisIcon = vis.icon;

  useEffect(() => {
    if (showVisibilityMenu && buttonRef.current) {
      const updatePosition = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const ddW = 200, ddH = 180, pad = 8;
        let left = rect.left, top = rect.bottom + pad;
        if (left + ddW > window.innerWidth) left = window.innerWidth - ddW - pad;
        if (left < pad) left = pad;
        if (top + ddH > window.innerHeight) {
          top = rect.top - ddH - pad;
          if (top < pad) top = pad;
        }
        setDropdownPosition({ top, left });
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      const id = requestAnimationFrame(updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        cancelAnimationFrame(id);
      };
    }
  }, [showVisibilityMenu]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
        setShowVisibilityMenu(false);
      }
    };
    if (showVisibilityMenu) document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [showVisibilityMenu]);

  const handleDeleteLink = async (id) => {
    try {
      const res = await api.post('/source/deletelink', { id }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        dispatch(setLinks(links.filter(l => l._id !== id)));
        toast.success("Link deleted");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const handleEditLink = (id) => {
    const link = links.find(l => l._id === id);
    if (!link) { toast.error("Link not found"); return; }
    dispatch(setEditLinkData({ id: link._id, source: link.source, destination: link.destination }));
    setTimeout(() => {
      const el = document.querySelector('[data-create-bridge]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkRef.current.innerText)
      .then(() => toast.success("Copied!"))
      .catch(() => toast.error("Failed to copy"));
  };

  const handleVisibilityChange = async (newVis) => {
    if (newVis === 'private') { setShowPasswordModal(true); setShowVisibilityMenu(false); return; }
    await updateVisibility(newVis);
  };

  const updateVisibility = async (newVis, pwd = null) => {
    try {
      setUpdatingVisibility(true);
      const payload = { id: _id, visibility: newVis };
      if (pwd) payload.password = pwd;
      const res = await api.post('/source/updatevisibility', payload, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        dispatch(setLinks(links.map(l => l._id === _id ? { ...l, visibility: newVis } : l)));
        toast.success(`Visibility: ${newVis}`);
        setShowVisibilityMenu(false);
        setShowPasswordModal(false);
        setPassword(''); setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 4) { toast.error("Password must be at least 4 characters"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    await updateVisibility('private', password);
  };

  const toggleVisibilityMenu = (e) => {
    e.stopPropagation();
    const next = !showVisibilityMenu;
    if (next && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ddW = 200, ddH = 180, pad = 8;
      let left = rect.left, top = rect.bottom + pad;
      if (left + ddW > window.innerWidth) left = window.innerWidth - ddW - pad;
      if (left < pad) left = pad;
      if (top + ddH > window.innerHeight) { top = rect.top - ddH - pad; if (top < pad) top = pad; }
      setDropdownPosition({ top, left });
    }
    setShowVisibilityMenu(next);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:border-violet-200 dark:hover:border-violet-800 transition-colors group">
      <div className="flex items-start gap-4">
        {/* Click count */}
        <div className="hidden sm:flex flex-col items-center justify-center min-w-[56px] py-1">
          <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-1.5">
            <FiMousePointer className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-white leading-none">{clicked || 0}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">clicks</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-slate-100 dark:bg-slate-800" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">{source}</h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${vis.bg} ${vis.color}`}>
                  <VisIcon className="w-2.5 h-2.5" />
                  {vis.label}
                </span>
                {/* Mobile clicks */}
                <span className="sm:hidden flex items-center gap-1 text-xs text-slate-400">
                  <FiMousePointer className="w-3 h-3" />{clicked || 0}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5 max-w-xs">{destination}</p>
            </div>
          </div>

          {/* Personalized link */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-100 dark:border-slate-700">
            <span ref={linkRef} className="flex-1 text-xs font-mono text-slate-600 dark:text-slate-400 truncate min-w-0">
              {getUserLinkUrl(username, source)}
            </span>
            <button onClick={copyToClipboard} className="flex-shrink-0 p-1 rounded text-slate-400 hover:text-violet-600 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="Copy">
              <MdContentCopy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 mt-3">
            {/* Visibility Toggle */}
            <div className="relative" ref={menuRef}>
              <button
                ref={buttonRef}
                onClick={toggleVisibilityMenu}
                disabled={updatingVisibility}
                type="button"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border disabled:opacity-50 ${vis.bg} ${vis.color} ${vis.border}`}
              >
                {updatingVisibility
                  ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <VisIcon className="w-3 h-3" />}
                <span className="hidden sm:inline">{vis.label}</span>
                <FiChevronDown className="w-3 h-3" />
              </button>

              {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                  {showVisibilityMenu && (
                    <motion.div
                      key="vis-dd"
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{ top: dropdownPosition.top, left: dropdownPosition.left, zIndex: 999999, position: 'fixed' }}
                      className="w-52 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.entries(visibilityConfig).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => handleVisibilityChange(key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${visibility === key ? `${cfg.bg}` : ''}`}
                          >
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                            <div>
                              <div className="text-xs font-semibold text-slate-900 dark:text-white">{cfg.label}</div>
                              <div className="text-xs text-slate-400 dark:text-slate-500">
                                {key === 'public' ? 'Visible everywhere' : key === 'unlisted' ? 'Not in hub' : 'Password required'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )}
            </div>

            <div className="flex-1" />

            <button
              onClick={() => handleEditLink(_id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 transition-colors"
              title="Edit"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <a
              href={`https://allin1url.in/${username}/${source}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-colors"
              title="Open link"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open</span>
            </a>

            <button
              onClick={() => handleDeleteLink(_id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
              title="Delete"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) { setShowPasswordModal(false); setPassword(''); setConfirmPassword(''); } }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center">
                    <FiLock className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Set link password</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Visitors will need a password to access this link</p>
                  </div>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  {[
                    { label: "Password", value: password, onChange: setPassword },
                    { label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword },
                  ].map(({ label, value, onChange }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
                      <input
                        type="password"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        placeholder="Min. 4 characters"
                        required
                        minLength={4}
                        autoFocus={label === "Password"}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => { setShowPasswordModal(false); setPassword(''); setConfirmPassword(''); }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={updatingVisibility}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50">
                      {updatingVisibility ? "Setting..." : "Set Private"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Linkcard;
