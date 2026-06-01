import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaExternalLinkAlt, FaMousePointer, FaLock, FaUnlock, FaEyeSlash, FaGlobe } from "react-icons/fa";
import api from "../../utils/api";
import { setLinks } from "../../redux/userSlice";
import { setEditLinkData } from "../../redux/pageSlice";
import { FcImageFile } from "react-icons/fc";
import { getUserLinkUrl } from "../../lib/utils";

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

  // Update dropdown position when menu opens
  useEffect(() => {
    if (showVisibilityMenu && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const dropdownWidth = 200;
          const dropdownHeight = 180;
          const padding = 8;
          
          // Use viewport-relative coordinates (getBoundingClientRect)
          let left = rect.left;
          let top = rect.bottom + padding;
          
          // Check if dropdown would go off right edge
          if (left + dropdownWidth > window.innerWidth) {
            left = window.innerWidth - dropdownWidth - padding;
          }
          
          // Check if dropdown would go off left edge
          if (left < padding) {
            left = padding;
          }
          
          // Check if dropdown would go off bottom - show above button instead
          if (top + dropdownHeight > window.innerHeight) {
            top = rect.top - dropdownHeight - padding;
            // If still off-screen at top, position at top of viewport
            if (top < padding) {
              top = padding;
            }
          }
          
          setDropdownPosition({ top, left });
        }
      };
      
      // Calculate position immediately
      updatePosition();
      
      // Update on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      // Also update on next frame to ensure accurate positioning
      const frameId = requestAnimationFrame(updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        cancelAnimationFrame(frameId);
      };
    }
  }, [showVisibilityMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) && 
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        !event.target.closest('.privacy-button')
      ) {
        setShowVisibilityMenu(false);
      }
    };

    if (showVisibilityMenu) {
      // Use capture phase to catch clicks early
      document.addEventListener('mousedown', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showVisibilityMenu]);

  const handleDeleteLink = async (id) => {
    try {
      const res = await api.post('/source/deletelink', { id: id }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const tempArr = links.filter(link => link._id != id);
        dispatch(setLinks(tempArr));
        toast.success("Bridge has been deleted successfully!");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    }
  };

  const handleEditLink = (id) => {
    const linkToEdit = links.find(link => link._id === id);
    if (!linkToEdit) {
      toast.error("Link not found");
      return;
    }
    
    dispatch(setEditLinkData({
      id: linkToEdit._id,
      source: linkToEdit.source,
      destination: linkToEdit.destination
    }));
    
    setTimeout(() => {
      const createBridgeElement = document.querySelector('[data-create-bridge]');
      if (createBridgeElement) {
        createBridgeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const copyToClipboard = () => {
    const linkText = linkRef.current.innerText;
    navigator.clipboard
      .writeText(linkText)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy!");
      });
  };

  const handleVisibilityChange = async (newVisibility) => {
    // If changing to private, show password modal first
    if (newVisibility === 'private') {
      setShowPasswordModal(true);
      setShowVisibilityMenu(false);
      return;
    }
    
    // For public and unlisted, proceed directly
    await updateVisibility(newVisibility);
  };

  const updateVisibility = async (newVisibility, passwordToSet = null) => {
    try {
      setUpdatingVisibility(true);
      const payload = { id: _id, visibility: newVisibility };
      if (passwordToSet) {
        payload.password = passwordToSet;
      }
      
      const res = await api.post(
        '/source/updatevisibility',
        payload,
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.success) {
        const updatedLinks = links.map(link =>
          link._id === _id ? { ...link, visibility: newVisibility } : link
        );
        dispatch(setLinks(updatedLinks));
        toast.success(`Link visibility changed to ${newVisibility}`);
        setShowVisibilityMenu(false);
        setShowPasswordModal(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.data.message || "Failed to update visibility");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Server Internal Error";
      toast.error(message);
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || password.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    await updateVisibility('private', password);
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public':
        return <FaGlobe className="text-sm" />;
      case 'unlisted':
        return <FaEyeSlash className="text-sm" />;
      case 'private':
        return <FaLock className="text-sm" />;
      default:
        return <FaGlobe className="text-sm" />;
    }
  };

  const getVisibilityColor = () => {
    switch (visibility) {
      case 'public':
        return 'from-green-600 to-emerald-600';
      case 'unlisted':
        return 'from-yellow-600 to-orange-600';
      case 'private':
        return 'from-red-600 to-red-700';
      default:
        return 'from-green-600 to-emerald-600';
    }
  };

  const getVisibilityLabel = () => {
    switch (visibility) {
      case 'public':
        return 'Public';
      case 'unlisted':
        return 'Unlisted';
      case 'private':
        return 'Private';
      default:
        return 'Public';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-4 md:p-5 relative group"
      style={{ transformOrigin: 'center', willChange: 'transform', overflow: 'visible', zIndex: 1 }}
    >
      {/* Gradient Background on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ pointerEvents: 'none', zIndex: 0 }}
      />
      <div className="relative z-10" style={{ pointerEvents: 'auto', position: 'relative' }}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Click Counter Section */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center border-r-2 border-dashed border-white/20 dark:border-gray-600 pr-4 min-w-[90px]"
            whileHover={{ scale: 1.05 }}
            style={{ transformOrigin: 'center', willChange: 'transform' }}
          >
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg mb-2"
              whileHover={{ rotate: 5, scale: 1.05 }}
              style={{ transformOrigin: 'center', willChange: 'transform' }}
            >
              <FaMousePointer className="text-xl text-white" />
            </motion.div>
            <motion.div
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {clicked || 0}
            </motion.div>
            <span className="bg-white/10 dark:bg-gray-800/50 px-2 py-1 rounded-md text-xs font-semibold text-gray-900 dark:text-gray-200 border border-white/20">
              Clicks
            </span>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-2">
            {/* Platform Name */}
            <div>
              <motion.h3
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-1"
                whileHover={{ scale: 1.02 }}
                style={{ transformOrigin: 'center', willChange: 'transform' }}
              >
                {source.toUpperCase()}
              </motion.h3>
              <p className="font-mono text-xs md:text-sm text-gray-700 dark:text-gray-400 break-all line-clamp-1">
                {destination}
              </p>
            </div>

            {/* Personalized Link */}
            <div className="p-3 bg-gray-800/40 dark:bg-gray-800/30 rounded-xl border border-gray-700/30 dark:border-white/10">
              <p className="text-xs text-gray-300 dark:text-gray-500 mb-1.5 font-semibold">
                Your Personalized Link:
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  ref={linkRef}
                  className="break-all font-mono text-xs md:text-sm text-white dark:text-gray-200 flex-1 min-w-0 line-clamp-1"
                >
                  {getUserLinkUrl(username, source)}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  style={{ transformOrigin: 'center', willChange: 'transform' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-2 rounded-md transition-all duration-300 flex-shrink-0"
                  title="Copy link"
                >
                  <MdContentCopy className="text-base text-white" />
                </motion.button>
              </div>
            </div>

            {/* Mobile Click Counter */}
            <div className="md:hidden flex items-center gap-3 p-2.5 bg-white/5 dark:bg-gray-800/30 rounded-xl border border-white/10">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg"
                whileHover={{ scale: 1.05, rotate: 3 }}
                style={{ transformOrigin: 'center', willChange: 'transform' }}
              >
                <FaMousePointer className="text-lg text-white" />
              </motion.div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{clicked || 0}</div>
                <div className="text-xs text-gray-700 dark:text-gray-500">Total Clicks</div>
              </div>
            </div>

            {/* Visibility Badge and Action Buttons Row */}
            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              {/* Visibility Badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getVisibilityColor()} text-white flex items-center gap-1.5`}>
                {getVisibilityIcon()}
                <span className="hidden sm:inline">{getVisibilityLabel()}</span>
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap relative" style={{ zIndex: 100 }}>
              {/* Visibility Toggle Button */}
              <div className="relative" ref={menuRef} style={{ zIndex: 1000 }}>
                <motion.button
                  ref={buttonRef}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const newState = !showVisibilityMenu;
                    
                    // Calculate position BEFORE state update
                    if (newState && buttonRef.current) {
                      const rect = buttonRef.current.getBoundingClientRect();
                      const dropdownWidth = 200;
                      const dropdownHeight = 180; // Increased for 3 items
                      const padding = 8;
                      
                      // Use getBoundingClientRect which gives viewport-relative coordinates
                      // For position: fixed, we use viewport coordinates (not document coordinates)
                      let left = rect.left;
                      let top = rect.bottom + padding;
                      
                      // Check if dropdown would go off right edge
                      if (left + dropdownWidth > window.innerWidth) {
                        left = window.innerWidth - dropdownWidth - padding;
                      }
                      
                      // Check if dropdown would go off left edge
                      if (left < padding) {
                        left = padding;
                      }
                      
                      // Check if dropdown would go off bottom - show above button instead
                      if (top + dropdownHeight > window.innerHeight) {
                        top = rect.top - dropdownHeight - padding;
                        // If still off-screen at top, position at top of viewport
                        if (top < padding) {
                          top = padding;
                        }
                      }
                      
                      setDropdownPosition({ top, left });
                    }
                    
                    setShowVisibilityMenu(newState);
                  }}
                  disabled={updatingVisibility}
                  className={`privacy-button bg-gradient-to-r ${getVisibilityColor()} hover:opacity-90 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1.5 disabled:opacity-50 relative cursor-pointer`}
                  title="Change visibility"
                  type="button"
                  style={{ 
                    transformOrigin: 'center', 
                    willChange: 'transform',
                    zIndex: 1000, 
                    position: 'relative', 
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {updatingVisibility ? (
                    <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    getVisibilityIcon()
                  )}
                  <span className="hidden sm:inline text-xs">Privacy</span>
                </motion.button>

                {/* Visibility Menu - Using Portal to render outside DOM hierarchy */}
                {typeof document !== 'undefined' && createPortal(
                  <AnimatePresence mode="wait">
                    {showVisibilityMenu && (
                      <motion.div
                        key="visibility-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-2 min-w-[200px]"
                        ref={dropdownRef}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                          zIndex: 999999,
                          pointerEvents: 'auto',
                          position: 'fixed',
                          transform: 'translateZ(0)', // Force GPU acceleration
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisibilityChange('public');
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                            visibility === 'public' ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                        >
                          <FaGlobe className={`text-lg ${visibility === 'public' ? 'text-green-600' : 'text-gray-400'}`} />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">Public</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Visible everywhere</div>
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisibilityChange('unlisted');
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                            visibility === 'unlisted' ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                          }`}
                        >
                          <FaEyeSlash className={`text-lg ${visibility === 'unlisted' ? 'text-yellow-600' : 'text-gray-400'}`} />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">Unlisted</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">In profile, not in hub</div>
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisibilityChange('private');
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                            visibility === 'private' ? 'bg-red-50 dark:bg-red-900/20' : ''
                          }`}
                        >
                          <FaLock className={`text-lg ${visibility === 'private' ? 'text-red-600' : 'text-gray-400'}`} />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">Private</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Hidden, password required</div>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}
              </div>

              {/* Password Modal for Private Links */}
              {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                  {showPasswordModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          setShowPasswordModal(false);
                          setPassword('');
                          setConfirmPassword('');
                        }
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                            <FaLock className="text-xl text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              Set Private Link Password
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              This link will be hidden and require a password to access
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Password
                            </label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-red-500 focus:outline-none transition-colors"
                              placeholder="Enter password (min 4 characters)"
                              required
                              minLength={4}
                              autoFocus
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-red-500 focus:outline-none transition-colors"
                              placeholder="Confirm password"
                              required
                              minLength={4}
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <motion.button
                              type="button"
                              onClick={() => {
                                setShowPasswordModal(false);
                                setPassword('');
                                setConfirmPassword('');
                              }}
                              whileHover={{ scale: 1.02 }}
                              style={{ transformOrigin: 'center', willChange: 'transform' }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              type="submit"
                              disabled={updatingVisibility || !password || !confirmPassword}
                              whileHover={{ scale: updatingVisibility ? 1 : 1.02 }}
                              style={{ transformOrigin: 'center', willChange: 'transform' }}
                              whileTap={{ scale: updatingVisibility ? 1 : 0.98 }}
                              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                              {updatingVisibility ? (
                                <span className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Setting...
                                </span>
                              ) : (
                                'Set Private'
                              )}
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )}

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteLink(_id)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1.5"
                title="Delete link"
              >
                <FaTrash className="text-sm" />
                <span className="hidden sm:inline text-xs">Delete</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditLink(_id)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1.5"
                title="Edit link"
                style={{ transformOrigin: 'center', willChange: 'transform' }}
              >
                <FaEdit className="text-sm" />
                <span className="hidden sm:inline text-xs">Edit</span>
              </motion.button>

              <motion.a
                href={`https://allin1url.in/${username}/${source}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1.5"
                title="Open link"
                style={{ transformOrigin: 'center', willChange: 'transform' }}
              >
                <FaExternalLinkAlt className="text-sm" />
                <span className="hidden sm:inline text-xs">Open</span>
              </motion.a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Linkcard;
