import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser } from "../redux/userSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GiSkullCrossedBones } from "react-icons/gi";
import { FaCheck, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { buildGoogleOAuthUrl } from "../utils/urlConfig";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isAvailable, setAvailable] = useState(false);
  const [isShow, setShow] = useState(false);
  const [isShowSignup, setShowSignup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const isMountedRef = useRef(true);

  const [loginemail, setLoginEmail] = useState("");
  const [loginpassword, setLoginPassword] = useState("");
  const [signinemail, setSigninEmail] = useState("");
  const [signinpassword, setSigninPassword] = useState("");
  const [username, setUsername] = useState("");

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      toast.error(oauthError);
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post(
        "/auth/signup",
        { username: username, email: signinemail, password: signinpassword },
        { withCredentials: true }
      );
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message);
        if (isMountedRef.current) {
          setLoading(false);
        }
        navigate("/verify", {
          state: {
            username: username,
            email: signinemail,
            password: signinpassword,
          },
        });
        return;
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Network Slow ! Try again";
      toast.error(message);
      if (err.response?.status === 409) {
        if (isMountedRef.current) {
          setLoading(false);
        }
        navigate("/login");
        return;
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post(
        "/auth/signin",
        { email: loginemail, password: loginpassword },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setAuthenticated(true));
        setLoginEmail("");
        setLoginPassword("");
        toast.success(`Welcome ${res.data.user.username}!`);
        if (isMountedRef.current) {
          setLoading(false);
        }
        navigate("/home", { replace: true });
        return;
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Network Slow ! Try again";
      toast.error(message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const checkAvailablity = async (usrnm) => {
    if (usrnm.length < 5) {
      setAvailable(false);
      return;
    }
    try {
      const res = await api.post("/auth/checkavailablity", { username: usrnm });
      if (res.status === 209 && res.data.success) {
        setAvailable(false);
      }
      if (res.status === 200 && res.data.success) {
        setAvailable(true);
      }
    } catch (err) {
      console.log(err);
      setAvailable(false);
    }
  };

  const handleGoogleSignUp = async (usr) => {
    let uname = usr;
    if (typeof usr === 'object' && usr !== null) {
      uname = username;
    }
    if (!uname || uname.length < 5) {
      toast.error("Please enter a valid username (min 5 characters)");
      return;
    }

    try {
      window.location.href = buildGoogleOAuthUrl({
        username: uname.toLowerCase(),
        usertype: "onboarding",
      });
    } catch (err) {
      toast.error(err.message || "Google sign-up is unavailable");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      window.location.href = buildGoogleOAuthUrl({ usertype: "onboarded" });
    } catch (err) {
      toast.error(err.message || "Google sign-in is unavailable");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.7 - 200,
            y: mousePosition.y * 0.7 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 flex items-center gap-2 text-white dark:text-gray-300 hover:text-purple-400 dark:hover:text-purple-400 transition-colors z-20"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </motion.button>

        <motion.div
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl"
        >
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left Side - Welcome Content */}
            <motion.div
              className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 p-4 md:p-8 mb-6 md:mb-0"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-4 sm:p-6 rounded-2xl shadow-2xl">
                  <HiSparkles className="text-4xl sm:text-5xl md:text-6xl text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              >
                Welcome to All in1 url
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm sm:text-base md:text-lg text-gray-300 dark:text-gray-400 max-w-md"
              >
                Transform your social media presence with personalized, memorable links that never expire.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4 md:mt-6"
              >
                {["Personalized Links", "Analytics", "Free Forever"].map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + idx * 0.1, type: "spring" }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm text-white border border-white/20"
                  >
                    {feature}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Auth Forms */}
            <motion.div className="w-full">
              <div className="relative">
                {/* Form Container */}
                <motion.div
                  className="relative bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8 md:p-10 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated Border Gradient */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl" />

                  {/* Sign In/Up Toggle */}
                  <div className="flex gap-2 mb-6 p-1 bg-white/5 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <motion.button
                      type="button"
                      onClick={() => setIsSignUpMode(false)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 relative ${
                        !isSignUpMode
                          ? "text-white"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {!isSignUpMode && (
                        <motion.div
                          layoutId="activeModeTab"
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">Sign In</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setIsSignUpMode(true)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 relative ${
                        isSignUpMode
                          ? "text-white"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSignUpMode && (
                        <motion.div
                          layoutId="activeModeTab"
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">Sign Up</span>
                    </motion.button>
                  </div>

                  {/* Authentication Forms */}
                  <AnimatePresence mode="wait">
                    {!isSignUpMode ? (
                      /* Sign In - Show both Password and Google options */
                      <motion.div
                        key="signin"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Header */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center mb-6"
                        >
                          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                          <p className="text-gray-300 dark:text-gray-400 text-sm mt-1">
                            Sign in with your preferred method
                          </p>
                        </motion.div>

                        {/* Google Sign In Button */}
                        <motion.button
                          type="button"
                          onClick={handleGoogleSignIn}
                          disabled={loading}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            <FcGoogle className="w-5 h-5" />
                            <span>Continue with Gmail</span>
                            <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            {loading && (
                              <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            )}
                          </span>
                        </motion.button>

                        {/* Divider */}
                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-400">or</span>
                          </div>
                        </div>

                        {/* Password Sign In Form */}
                        <motion.form
                          onSubmit={handleLogin}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-4"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative group"
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10">
                              <FaEnvelope className="w-5 h-5" />
                            </div>
                            <input
                              type="email"
                              placeholder="Email"
                              value={loginemail}
                              required
                              onChange={(e) => {
                                if (e.target.value.includes(" ")) {
                                  toast.error("Space not allowed");
                                  return;
                                }
                                setLoginEmail(e.target.value);
                              }}
                              className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative group"
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10">
                              <FaLock className="w-5 h-5" />
                            </div>
                            <input
                              type={isShow ? "text" : "password"}
                              placeholder="Password"
                              value={loginpassword}
                              required
                              minLength={6}
                              onChange={(e) => {
                                if (e.target.value.includes(" ")) {
                                  toast.error("Space not allowed");
                                  return;
                                }
                                setLoginPassword(e.target.value);
                              }}
                              className="w-full pl-12 pr-12 py-4 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShow(!isShow)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors z-10"
                            >
                              {isShow ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                            </button>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-between"
                          >
                            <label className="flex items-center gap-2 text-gray-300 dark:text-gray-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isShow}
                                onChange={() => setShow(!isShow)}
                                className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm">Show Password</span>
                            </label>
                            <Link
                              to="/reset_password"
                              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </motion.div>

                          <motion.button
                            type="submit"
                            disabled={loading}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {loading ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Signing In...
                                </>
                              ) : (
                                "Sign In"
                              )}
                            </span>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: "100%" }}
                              transition={{ duration: 0.6 }}
                            />
                          </motion.button>
                        </motion.form>
                      </motion.div>
                    ) : (
                      /* Sign Up - Username required, then Google */
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Header */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center mb-6"
                        >
                          <h2 className="text-2xl font-bold text-white">Create Account</h2>
                          <p className="text-gray-300 dark:text-gray-400 text-sm mt-1">
                            Username is required for both Google and password registration
                          </p>
                        </motion.div>

                        {/* Username Input */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="relative group"
                        >
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10">
                            <FaUser className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            placeholder="Username (min 5 characters)"
                            value={username}
                            required
                            minLength={5}
                            onChange={(e) => {
                              if (e.target.value.includes(" ")) {
                                toast.error("Space not allowed");
                                return;
                              }
                              checkAvailablity(e.target.value.toLowerCase());
                              setUsername(e.target.value.toLowerCase());
                            }}
                            className="w-full pl-12 pr-12 py-4 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                            {username.length >= 5 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                {isAvailable ? (
                                  <FaCheck className="w-5 h-5 text-green-400" />
                                ) : (
                                  <GiSkullCrossedBones className="w-5 h-5 text-red-400" />
                                )}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>

                        {username.length >= 5 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-xs ml-1 transition-all duration-300 ${isAvailable ? "text-green-400" : "text-red-400"
                              }`}
                          >
                            {isAvailable
                              ? "✓ Username is available"
                              : "✗ Username is not available"}
                          </motion.p>
                        )}

                        {/* Registration Options - Only show when username is valid */}
                        {username.length >= 5 && isAvailable && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                          >
                            {/* Google Sign Up Button */}
                            <motion.button
                              type="button"
                              onClick={() => handleGoogleSignUp(username)}
                              disabled={loading}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <span className="relative z-10 flex items-center justify-center gap-3">
                                <FcGoogle className="w-5 h-5" />
                                <span>Register with Google</span>
                                <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                {loading && (
                                  <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                )}
                              </span>
                            </motion.button>

                            {/* Divider */}
                            <div className="relative my-6">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">or use password</span>
                              </div>
                            </div>

                            {/* Password Sign Up Form */}
                            <motion.form
                              onSubmit={handleSignUp}
                              className="space-y-4"
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="relative group"
                              >
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10">
                                  <FaEnvelope className="w-5 h-5" />
                                </div>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={signinemail}
                                  required
                                  onChange={(e) => {
                                    if (e.target.value.includes(" ")) {
                                      toast.error("Space not allowed");
                                      return;
                                    }
                                    setSigninEmail(e.target.value);
                                  }}
                                  className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                />
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative group"
                              >
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10">
                                  <FaLock className="w-5 h-5" />
                                </div>
                                <input
                                  type={isShowSignup ? "text" : "password"}
                                  placeholder="Password (min 6 characters)"
                                  value={signinpassword}
                                  required
                                  minLength={6}
                                  onChange={(e) => {
                                    if (e.target.value.includes(" ")) {
                                      toast.error("Space not allowed");
                                      return;
                                    }
                                    setSigninPassword(e.target.value);
                                  }}
                                  className="w-full pl-12 pr-12 py-4 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowSignup(!isShowSignup)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors z-10"
                                >
                                  {isShowSignup ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                </button>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-2 text-gray-300 dark:text-gray-400"
                              >
                                <input
                                  type="checkbox"
                                  id="signupCheck"
                                  checked={isShowSignup}
                                  onChange={() => setShowSignup(!isShowSignup)}
                                  className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor="signupCheck" className="text-sm cursor-pointer">
                                  Show Password
                                </label>
                              </motion.div>

                              <motion.button
                                type="submit"
                                disabled={loading}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  {loading ? (
                                    <>
                                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                      </svg>
                                      Creating Account...
                                    </>
                                  ) : (
                                    "Create Account"
                                  )}
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  initial={{ x: "-100%" }}
                                  whileHover={{ x: "100%" }}
                                  transition={{ duration: 0.6 }}
                                />
                              </motion.button>
                            </motion.form>
                          </motion.div>
                        )}

                        {/* Show message when username is not valid yet */}
                        {(!username || username.length < 5) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-400 text-sm"
                          >
                            Enter a valid username first to continue registration
                          </motion.div>
                        )}

                        {/* Show message when username exists but is not available */}
                        {username && username.length >= 5 && !isAvailable && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-red-400 text-sm"
                          >
                            Please choose a different username - this one is already taken
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
