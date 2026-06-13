import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser } from "../redux/userSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiCheck, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft, FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { buildGoogleOAuthUrl } from "../utils/urlConfig";
import logo from "../assets/logo.png";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isAvailable, setAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const isMountedRef = useRef(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      toast.error(oauthError);
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/signup", { username, email: signupEmail, password: signupPassword }, { withCredentials: true });
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message);
        navigate("/verify", { state: { username, email: signupEmail, password: signupPassword } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error, try again");
      if (err.response?.status === 409) navigate("/login");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/signin", { email: loginEmail, password: loginPassword }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setAuthenticated(true));
        toast.success(`Welcome back, ${res.data.user.username}!`);
        navigate("/home", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const checkAvailability = async (name) => {
    if (name.length < 5) { setAvailable(false); return; }
    try {
      const res = await api.post("/auth/checkavailablity", { username: name });
      setAvailable(res.status === 200 && res.data.success);
    } catch {
      setAvailable(false);
    }
  };

  const handleGoogleSignIn = () => {
    try { window.location.href = buildGoogleOAuthUrl({ usertype: "onboarded" }); }
    catch (err) { toast.error(err.message || "Google sign-in unavailable"); }
  };

  const handleGoogleSignUp = () => {
    if (!username || username.length < 5) { toast.error("Enter a valid username first"); return; }
    try { window.location.href = buildGoogleOAuthUrl({ username: username.toLowerCase(), usertype: "onboarding" }); }
    catch (err) { toast.error(err.message || "Google sign-up unavailable"); }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-violet-600 text-white p-10 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-9 h-9 rounded-xl bg-white/20 p-1 object-contain" onError={(e) => { e.target.src = '/favicon-96x96.png'; }} />
          <span className="text-lg font-bold">All in1 url</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold leading-tight">One link for all your social profiles</h1>
          <p className="text-violet-200 text-sm leading-relaxed">
            Create personalized, memorable links for LinkedIn, GitHub, Instagram and more. Share one hub URL — they find everything.
          </p>
          <div className="space-y-3">
            {["Personalized short links", "Real-time click analytics", "Custom link hub page", "Free forever"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-3 h-3" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-violet-300 text-xs">© 2024 All in1 url. All rights reserved.</p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* Back to home (mobile) */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-8">
            <FiArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          {/* Logo (mobile) */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg object-contain" onError={(e) => { e.target.src = '/favicon-96x96.png'; }} />
            <span className="text-base font-bold text-slate-900 dark:text-white">All in1 url</span>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            {[{ label: "Sign In", mode: false }, { label: "Sign Up", mode: true }].map(({ label, mode }) => (
              <button
                key={label}
                onClick={() => setIsSignUpMode(mode)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isSignUpMode === mode
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!isSignUpMode ? (
              <motion.div key="signin" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your account</p>
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors disabled:opacity-50 shadow-sm mb-4"
                >
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-slate-50 dark:bg-slate-950 text-xs text-slate-400">or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" placeholder="Email address" value={loginEmail} required
                      onChange={(e) => { if (!e.target.value.includes(" ")) setLoginEmail(e.target.value); }}
                      className={inputClass} />
                  </div>

                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={loginPassword} required minLength={6}
                      onChange={(e) => { if (!e.target.value.includes(" ")) setLoginPassword(e.target.value); }}
                      className={inputClass.replace("pr-4", "pr-10")} />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <Link to="/reset_password" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Forgot password?</Link>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create an account</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start with your username</p>
                </div>

                {/* Username */}
                <div className="mb-4">
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Username (min. 5 characters)"
                      value={username}
                      required
                      minLength={5}
                      onChange={(e) => {
                        if (e.target.value.includes(" ")) { toast.error("No spaces allowed"); return; }
                        const val = e.target.value.toLowerCase();
                        setUsername(val);
                        checkAvailability(val);
                      }}
                      className={`${inputClass.replace("pr-4", "pr-10")} lowercase`}
                    />
                    {username.length >= 5 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isAvailable
                          ? <FiCheck className="w-4 h-4 text-emerald-500" />
                          : <FiX className="w-4 h-4 text-red-500" />}
                      </div>
                    )}
                  </div>
                  {username.length >= 5 && (
                    <p className={`mt-1.5 text-xs ${isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                      {isAvailable ? "✓ Username is available" : "✗ Username is taken"}
                    </p>
                  )}
                </div>

                {/* Show registration only when username is valid */}
                <AnimatePresence>
                  {username.length >= 5 && isAvailable && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      {/* Google */}
                      <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
                      >
                        <FcGoogle className="w-5 h-5" />
                        Register with Google
                      </button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 bg-slate-50 dark:bg-slate-950 text-xs text-slate-400">or use password</span>
                        </div>
                      </div>

                      <form onSubmit={handleSignUp} className="space-y-3">
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="email" placeholder="Email address" value={signupEmail} required
                            onChange={(e) => { if (!e.target.value.includes(" ")) setSignupEmail(e.target.value); }}
                            className={inputClass} />
                        </div>
                        <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type={showSignupPassword ? "text" : "password"} placeholder="Password (min. 6 characters)" value={signupPassword} required minLength={6}
                            onChange={(e) => { if (!e.target.value.includes(" ")) setSignupPassword(e.target.value); }}
                            className={inputClass.replace("pr-4", "pr-10")} />
                          <button type="button" onClick={() => setShowSignupPassword(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            {showSignupPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                          </button>
                        </div>
                        <button type="submit" disabled={loading}
                          className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                          {loading ? "Creating account..." : "Create Account"}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(!username || username.length < 5) && (
                  <p className="text-xs text-center text-slate-400 mt-2">Enter a username to continue</p>
                )}
                {username.length >= 5 && !isAvailable && (
                  <p className="text-xs text-center text-red-500 dark:text-red-400 mt-2">Please choose a different username</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
