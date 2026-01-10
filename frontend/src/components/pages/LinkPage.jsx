import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import Linkcard from "../linkcard/Linkcard";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MdContentCopy, MdAddCircle } from "react-icons/md";
import { FaRocket, FaLink, FaChartLine, FaHome, FaEye } from "react-icons/fa";
import { setLinks } from "../../redux/userSlice";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { getUserLinkUrl } from "../../lib/utils";

const LinkPage = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const linkRef = useRef(null);
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const links = useSelector((store) => store.admin.links);
  const username = useSelector((store) => store.admin.user.username);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCreateNewBridge = () => {
    navigate("/home");
  };

  const handlePreviewLinkHub = () => {
    navigate("/preview");
  };

  useEffect(() => {
    const getAllLinks = async () => {
      try {
        const res = await api.post(
          "/source/getallsource",
          { username },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.success) {
          dispatch(setLinks(res.data.sources));
          // Trigger preview refresh when links are updated
          setRefreshKey(prev => prev + 1);
        }
      } catch (err) {
        console.log(err);
        const message = err.response?.data?.message || "Server Internal Error";
        toast.error(message);
      }
    };
    getAllLinks();
  }, []);

  // Watch for link changes and refresh preview
  useEffect(() => {
    if (links.length > 0) {
      setRefreshKey(prev => prev + 1);
    }
  }, [links]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.7 - 200,
            y: mousePosition.y * 0.7 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12">
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Your Links
                </h1>
                <p className="text-gray-700 dark:text-gray-400 text-lg md:text-xl">
                  Manage and track all your personalized social media links
                </p>
              </motion.div>

              {location.pathname === "/links" && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePreviewLinkHub}
                    className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 text-base sm:text-lg"
                  >
                    <FaEye className="text-xl sm:text-2xl" />
                    <span className="hidden sm:inline">Preview LinkHub</span>
                    <span className="sm:hidden">Preview</span>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateNewBridge}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 text-base sm:text-lg"
                  >
                    <MdAddCircle className="text-xl sm:text-2xl" />
                    <span className="hidden sm:inline">Create New Bridge</span>
                    <span className="sm:hidden">Create</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Hub Link Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <FaHome className="text-3xl text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Your Linktree Hub
                    </h3>
                    <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base">
                      Share this link to let visitors see all your profiles in
                      one place
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-800/40 dark:bg-gray-800/30 rounded-2xl border border-gray-700/30 dark:border-white/10">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 dark:text-gray-500 mb-2 font-semibold">
                      Hub Link:
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        ref={linkRef}
                        className="break-all font-mono text-base md:text-lg text-white dark:text-gray-200"
                      >
                        {getUserLinkUrl(username)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={copyToClipboard}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-2 rounded-lg transition-all duration-300 flex-shrink-0"
                        title="Copy link"
                      >
                        <MdContentCopy className="text-xl text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content: Links and Preview */}
          <div className={`grid grid-cols-1 ${children ? 'lg:grid-cols-[2fr_1fr]' : ''} gap-6 lg:gap-8`}>
            {/* Left Side: Links Section - Scrollable - Height matches template preview */}
            <motion.div 
              variants={itemVariants} 
              className={`space-y-3 scroll-smooth custom-scrollbar ${children && location.pathname !== '/links' ? 'lg:h-[680px] lg:overflow-y-auto lg:pr-4' : ''}`}
            >
              {links.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-12 md:p-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-6"
                  >
                    <FaLink className="text-6xl md:text-8xl text-gray-400 dark:text-gray-600 mx-auto" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    No Links Yet
                  </h2>
                  <p className="text-gray-700 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    Get started by creating your first personalized link. Click
                    the button above to create a new bridge!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateNewBridge}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
                  >
                    <FaRocket className="text-xl" />
                    Create Your First Link
                  </motion.button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {links.map((link, index) => (
                    <motion.div
                      key={link._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Linkcard sources={link} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Right Side: Template Preview - Fixed/Sticky */}
            {children && location.pathname !== '/links' && (
              <motion.div 
                variants={itemVariants} 
                className="lg:sticky lg:top-8 lg:self-start"
              >
                <div key={refreshKey} className="w-full">
                  {React.cloneElement(children, { refreshTrigger: refreshKey, height: "h-[600px] md:h-[650px]" })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats Summary */}
          {links.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 text-center"
              >
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl w-fit mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaLink className="text-3xl text-white" />
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {links.length}
                </h3>
                <p className="text-gray-700 dark:text-gray-400">Total Links</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 text-center"
              >
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl w-fit mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaChartLine className="text-3xl text-white" />
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {links.reduce((sum, link) => sum + (link.clicked || 0), 0)}
                </h3>
                <p className="text-gray-700 dark:text-gray-400">Total Clicks</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 text-center"
              >
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl w-fit mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaHome className="text-3xl text-white" />
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Live
                </h3>
                <p className="text-gray-700 dark:text-gray-400">Hub Page</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LinkPage;
