import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCamera,
  FaCheckCircle,
  FaLink,
  FaChartLine,
  FaHome,
  FaEye,
  FaLock,
  FaEyeSlash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  // State variables for profile information
  const [name, setName] = useState("");
  const [passion, setPassion] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("profile.png");
  const [isEditable, setEditable] = useState(false);
  const [hover, setHover] = useState(false);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { username } = useSelector((store) => store.admin.user);
  const links = useSelector((store) => store.admin.links) || [];

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

  const handleSaveEditClick = async () => {
    if (isEditable) {
      try {
        setLoader(true);
        const res = await api.post(
          "/profile/update",
          { username, name, passion, location, bio },
          { withCredentials: true }
        );
        if (res.status === 201 && res.data.success) {
          toast.success(res.data.msg);
          setEditable(false);
        }
      } catch (error) {
        const msg = error.response?.data?.msg || "Server internal error!";
        toast.error(msg);
      } finally {
        setLoader(false);
      }
    } else {
      setEditable(true);
    }
  };

  const getProfileInfo = useCallback(async () => {
    try {
      const profileinfo = await api.post(
        "/profile/getprofileinfo",
        { username },
        { withCredentials: true }
      );
      if (profileinfo.status === 200 && profileinfo.data.success) {
        const { name, location, bio, passion, image } = profileinfo.data.userinfo;
        setName(name || "");
        setLocation(location || "");
        setBio(bio || "");
        setPassion(passion || "");
        setImage(image || "profile.png");
      }
    } catch (error) {
      const message = error.response?.data?.msg || "Server error";
      toast.error(message);
    }
  }, [username]);

  const handleCancel = () => {
    setEditable(false);
    // Reload profile data to reset changes
    if (username) {
      getProfileInfo();
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    event.preventDefault();
    try {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"];
        if (!validTypes.includes(file.type)) {
          toast.error("Please select a valid image file (JPG, PNG, SVG, or WEBP)");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          setImageLoading(true);
          try {
            const response = await api.post(
              "/profile/updatepic",
              { username, image: reader.result },
              { withCredentials: true }
            );
            if (response.status === 201 && response.data.success) {
              setImage(response.data.resImage);
              toast.success("Image updated successfully!");
            } else {
              toast.error("Something went wrong! Please try again.");
            }
          } catch (error) {
            const message = error.response?.data?.msg || "Server error";
            toast.error(message);
          } finally {
            setImageLoading(false);
          }
        };
        reader.onerror = (error) => {
          console.log("Image error:", error);
          toast.error("Failed to read image file");
          setImageLoading(false);
        };
      }
    } catch (error) {
      const message = error.response?.data?.msg || "Server error";
      toast.error(message);
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      getProfileInfo();
    }
  }, [username, getProfileInfo]);

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
    <div className="w-full overflow-hidden relative min-h-screen" data-profile-page>
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <FaUser className="text-3xl text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                  Manage your profile information and preferences
                </p>
              </div>
            </motion.div>

            {/* Edit Mode Indicator */}
            <AnimatePresence>
              {isEditable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-blue-100/80 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-600/50 rounded-2xl p-4 flex items-center gap-3 mb-6"
                >
                  <FaCheckCircle className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0" />
                  <div>
                    <p className="text-blue-700 dark:text-blue-200 font-semibold">Edit Mode Active</p>
                    <p className="text-blue-600/80 dark:text-blue-300/80 text-sm">
                      Make your changes and click Save when done
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Profile Picture and Basic Info */}
              <motion.div variants={itemVariants} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={handleFileInputClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative rounded-full w-40 h-40 border-4 border-purple-500/30 dark:border-purple-400/30 overflow-hidden shadow-2xl">
                      <img
                        src={image}
                        alt="Profile"
                        className="rounded-full w-40 h-40 object-cover"
                        onError={(e) => {
                          e.target.src = "profile.png";
                        }}
                      />

                      {/* Hover Overlay */}
                      <AnimatePresence>
                        {hover && !imageLoader && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full pointer-events-none"
                          >
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.2, rotate: 5 }}
                            >
                              <FaCamera className="text-4xl text-white" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Loading Overlay */}
                      <AnimatePresence>
                        {imageLoader && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full"
                          >
                            <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      name="profile-image"
                      accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                      ref={fileInputRef}
                    />
                  </motion.div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                    Click on the image to change your profile picture
                  </p>
                </div>

                {/* Username Display */}
                <motion.div
                  variants={itemVariants}
                  className="text-center p-4 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-2xl border border-purple-400/20"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Username</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    @{username}
                  </p>
                </motion.div>
              </motion.div>

              {/* Right Column - Profile Information */}
              <motion.div variants={itemVariants} className="space-y-6">
                {/* Name Input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-lg">
                    <FaUser className="text-purple-600 dark:text-purple-400" />
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors z-10">
                      <FaUser className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      disabled={!isEditable}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </motion.div>

                {/* Location Input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-lg">
                    <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                    Location
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors z-10">
                      <FaMapMarkerAlt className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your location"
                      value={location}
                      disabled={!isEditable}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </motion.div>

                {/* Passion Input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-lg">
                    <FaHeart className="text-pink-600 dark:text-pink-400" />
                    Passion
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-pink-600 dark:group-focus-within:text-pink-400 transition-colors z-10">
                      <FaHeart className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="What are you passionate about?"
                      value={passion}
                      disabled={!isEditable}
                      onChange={(e) => setPassion(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </motion.div>

                {/* Bio Textarea */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-lg">
                    <FaEdit className="text-indigo-600 dark:text-indigo-400" />
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={bio}
                    disabled={!isEditable}
                    onChange={(e) => setBio(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-4 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <motion.button
                type="button"
                onClick={handleSaveEditClick}
                disabled={loader}
                whileHover={{ scale: loader ? 1 : 1.05 }}
                whileTap={{ scale: loader ? 1 : 0.95 }}
                className={`flex-1 py-4 px-8 bg-gradient-to-r ${isEditable ? 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700'} text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
              >
                {loader ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {isEditable ? <FaSave /> : <FaEdit />}
                    {isEditable ? "Save Changes" : "Edit Profile"}
                  </>
                )}
              </motion.button>

              {isEditable && (
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  disabled={loader}
                  whileHover={{ scale: loader ? 1 : 1.05 }}
                  whileTap={{ scale: loader ? 1 : 0.95 }}
                  className="py-4 px-8 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-white font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </motion.button>
              )}

              {!isEditable && (
                <motion.button
                  type="button"
                  onClick={() => navigate(`/profile/${username}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  title="Preview how your profile looks to visitors"
                >
                  <FaEye />
                  Preview
                </motion.button>
              )}
            </motion.div>

            {/* Stats Summary Cards */}
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

            {/* Public Profile Information */}
            <motion.div
              variants={itemVariants}
              className="mt-8 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 backdrop-blur-sm rounded-2xl border border-purple-400/30 dark:border-purple-600/30 p-6"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaEye className="text-2xl text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <FaEye className="text-purple-600 dark:text-purple-400" />
                    Public Profile Feature
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    Your profile can be viewed by other users through the search feature. This allows visitors to discover your profile and see your public links when your profile is set to public.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaLock className="text-gray-500" />
                    <span>Profile visibility settings</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
