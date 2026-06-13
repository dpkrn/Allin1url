import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { MdContentCopy } from "react-icons/md";
import { FiLink, FiGlobe, FiAlertTriangle, FiCheck, FiX, FiShuffle, FiEdit2, FiPlusCircle } from 'react-icons/fi';
import api from '../../utils/api';
import { setLinks } from '../../redux/userSlice';
import { setEditLinkData, clearEditLinkData } from '../../redux/pageSlice';
import { getUserLinkUrl } from '../../lib/utils';

const CreateBridge = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [showBridge, setShowBridge] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [source, setSource] = useState('');
  const linkRef = useRef(null);
  const { username, _id } = useSelector((store) => store.admin.user);
  let links = useSelector((store) => store.admin.links);
  const editLinkData = useSelector((store) => store.page.editLinkData);
  const isEditMode = editLinkData !== null;

  useEffect(() => {
    if (editLinkData) {
      const normalized = editLinkData.source.toLowerCase().trim();
      setPlatform(normalized);
      setProfileLink(editLinkData.destination);
      setSource(normalized);
      setShowBridge(false);
    } else {
      setPlatform('');
      setProfileLink('');
      setSource('');
      setShowBridge(false);
    }
  }, [editLinkData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode && editLinkData) {
      const platformChanged = platform.toLowerCase().trim() !== editLinkData.source.toLowerCase().trim();
      if (platformChanged) {
        setPendingUpdate({ id: editLinkData.id, source: platform.toLowerCase().trim(), destination: profileLink.trim() });
        setShowWarningModal(true);
        return;
      }
      await performUpdate({ id: editLinkData.id, source: platform.toLowerCase().trim(), destination: profileLink.trim() });
    } else {
      try {
        setLoading(true);
        const res = await api.post('/source/addnewsource', { userId: _id, username, source: platform, destination: profileLink }, { withCredentials: true });
        if (res.status === 201 && res.data.success) {
          links = [...links, res.data.link];
          dispatch(setLinks(links));
          setSource(res.data.link.source);
          setShowBridge(true);
          setPlatform('');
          setProfileLink('');
          toast.success("Link created successfully!");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    }
  };

  const performUpdate = async (updateData) => {
    try {
      setLoading(true);
      const res = await api.post('/source/editlink', updateData, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const updatedLink = res.data.link || res.data;
        const linkExists = links.some(link => link._id === editLinkData.id);
        const updatedLinks = linkExists
          ? links.map(link => link._id === editLinkData.id ? { ...link, ...updatedLink } : link)
          : [...links, updatedLink];
        dispatch(setLinks(updatedLinks));
        setSource(updatedLink.source);
        setShowBridge(true);
        dispatch(clearEditLinkData());
        toast.success("Link updated successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpdate = async () => {
    setLoading(true);
    setShowWarningModal(false);
    if (editLinkData) {
      await performUpdate({ id: editLinkData.id, source: platform.toLowerCase().trim(), destination: profileLink.trim() });
    }
    setPendingUpdate(null);
  };

  const handleCancel = () => {
    dispatch(clearEditLinkData());
    setPlatform('');
    setProfileLink('');
    setSource('');
    setShowBridge(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkRef.current.innerText)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setPlatform(code);
    if (isEditMode) setSource(code);
  };

  return (
    <div data-create-bridge>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEditMode ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-violet-50 dark:bg-violet-900/30'}`}>
              {isEditMode
                ? <FiEdit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                : <FiPlusCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              }
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {isEditMode ? "Edit Link" : "Create Link"}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isEditMode ? `Editing: ${editLinkData?.source}` : "Add a new personalized link"}
              </p>
            </div>
          </div>
          {isEditMode && (
            <button onClick={handleCancel} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Platform Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Platform Name
              </label>
              <button
                type="button"
                onClick={generateRandomCode}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors disabled:opacity-50"
              >
                <FiShuffle className="w-3 h-3" />
                Random
              </button>
            </div>
            <div className="relative">
              <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g., linkedin, github, instagram"
                value={platform}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  setPlatform(val);
                  if (isEditMode) setSource(val);
                }}
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors disabled:opacity-50 lowercase"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">Lowercase only. This becomes part of your link URL.</p>
          </div>

          {/* Destination URL */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Destination URL
            </label>
            <div className="relative">
              <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/your-profile"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading || showWarningModal}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isEditMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{isEditMode ? <FiEdit2 className="w-4 h-4" /> : <FiPlusCircle className="w-4 h-4" />}</>
              )}
              {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Link" : "Create Link")}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Success Result */}
          <AnimatePresence>
            {showBridge && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Your link is live</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 px-3 py-2">
                    <span ref={linkRef} className="flex-1 text-xs font-mono text-slate-700 dark:text-slate-300 break-all min-w-0">
                      {getUserLinkUrl(username, source)}
                    </span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="flex-shrink-0 p-1.5 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                    >
                      <MdContentCopy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarningModal && editLinkData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowWarningModal(false); setPendingUpdate(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <FiAlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Platform name change</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Changing from <code className="text-red-600 dark:text-red-400 font-mono text-xs bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded">{editLinkData.source}</code> to <code className="text-emerald-600 dark:text-emerald-400 font-mono text-xs bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">{platform.toLowerCase()}</code> will invalidate the old link.
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-mono">
                <p className="text-red-500 line-through">{getUserLinkUrl(username, editLinkData.source)}</p>
                <p className="text-emerald-600 dark:text-emerald-400">{getUserLinkUrl(username, platform.toLowerCase())}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowWarningModal(false); setPendingUpdate(null); }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpdate}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Continue anyway"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateBridge;
