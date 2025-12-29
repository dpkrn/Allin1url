import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaArrowLeft, FaCheck, FaArrowRight } from "react-icons/fa";
import { GiSkullCrossedBones } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import api from "../utils/api";
import { serverUrl } from "../utils/urlConfig";
// import { signUp, signIn } from "../utils/authUtils";

const AuthPageV1 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAvailable, setAvailable] = useState(false);
    const [username, setUsername] = useState("");
    const [activeTab, setActiveTab] = useState("signup"); // Default to signup
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const isMountedRef = useRef(true);


    // Track component mount status
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);




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
            // console.log(err);
            setAvailable(false);
        }
    };


    const handleSignUp = async (usr) => {
        let uname = usr;
        if (typeof usr === 'object' && usr !== null) {
            uname = username;
        }
        if (!uname || uname.length < 5) {
            toast.error("Please enter a valid username (min 5 characters)");
            return;
        }

        const params = new URLSearchParams({
            client_id: import.meta.env?.VITE_GOOGLE_CLIENT_ID,
            redirect_uri: `${serverUrl()}/auth/google`,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "select_account",
            state: btoa(JSON.stringify({ username: uname, usertype: "onboarding" }))
        });
        window.location.href =
            "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
    };

    const handleSignIn = async (usr) => {
        let uname = usr;
        if (typeof usr === 'object' && usr !== null) {
            uname = username;
        }
        if (!uname) {
            toast.error("Please enter a valid username");
            return;
        }
        const params = new URLSearchParams({
            client_id: import.meta.env?.VITE_GOOGLE_CLIENT_ID,
            redirect_uri: `${serverUrl()}/auth/google`,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "select_account",
            state: btoa(JSON.stringify({ username: uname, usertype: "onboarded" }))
        });
        window.location.href =
            "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
    };

    // Initialize Google Sign-In when signin tab is active

    return (
        <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs - CSS Animation */}
                <div
                    className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl transition-all duration-700 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x * 0.5 - 200}px, ${mousePosition.y * 0.5 - 200
                            }px)`,
                    }}
                />
                <div
                    className="absolute w-96 h-96 bg-pink-500/30 rounded-full blur-3xl transition-all duration-700 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x * 0.3 - 200}px, ${mousePosition.y * 0.3 - 200
                            }px)`,
                    }}
                />
                <div
                    className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl transition-all duration-700 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x * 0.7 - 200}px, ${mousePosition.y * 0.7 - 200
                            }px)`,
                    }}
                />

                {/* Animated Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 flex items-center gap-2 text-white dark:text-gray-300 hover:text-purple-400 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105 active:scale-95 z-20 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back to Home</span>
                </button>

                <div className="w-full max-w-5xl animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                        {/* Left Side - Welcome Content */}
                        <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 p-4 md:p-8 mb-6 md:mb-0 animate-slide-in-left">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50 animate-pulse" />
                                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-4 sm:p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300">
                                    <HiSparkles className="text-4xl sm:text-5xl md:text-6xl text-white" />
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in-delay">
                                Welcome to LinkBridger
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-gray-300 dark:text-gray-400 max-w-md animate-fade-in-delay-2">
                                Choose memorable username to make your own domain. Create
                                personalized, memorable links that never expire.
                            </p>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4 md:mt-6 animate-fade-in-delay-3">
                                {["Personalized Links", "Analytics", "Free Forever"].map(
                                    (feature, idx) => (
                                        <div
                                            key={feature}
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                                            style={{ animationDelay: `${0.9 + idx * 0.1}s` }}
                                        >
                                            {feature}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Right Side - Auth Form */}
                        <div className="w-full animate-slide-in-right">
                            <div className="relative">
                                {/* Form Container */}
                                <div className="relative bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8 md:p-10 overflow-hidden hover:scale-[1.01] transition-transform duration-300 group">
                                    {/* Animated Border Gradient */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl" />

                                    {/* Tabs */}
                                    <div className="flex gap-2 mb-8 p-1 bg-white/5 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveTab("signup");
                                                setUsername("");
                                                setAvailable(false);
                                            }}
                                            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 relative ${
                                                activeTab === "signup"
                                                    ? "text-white"
                                                    : "text-gray-400 dark:text-gray-500"
                                            }`}
                                        >
                                            {activeTab === "signup" && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg transition-all duration-300" />
                                            )}
                                            <span className="relative z-10">Sign Up</span>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveTab("signin");
                                                setUsername("");
                                                setAvailable(false);
                                            }}
                                            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 relative ${
                                                activeTab === "signin"
                                                    ? "text-white"
                                                    : "text-gray-400 dark:text-gray-500"
                                            }`}
                                        >
                                            {activeTab === "signin" && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg transition-all duration-300" />
                                            )}
                                            <span className="relative z-10">Sign In</span>
                                        </button>
                                    </div>

                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {activeTab === "signup" ? "Get Started" : "Welcome Back"}
                                        </h2>
                                        <p className="text-gray-300 dark:text-gray-400 text-sm">
                                            {activeTab === "signup"
                                                ? "Choose memorable username to make your own domain"
                                                : "Sign in with your Google account"}
                                        </p>
                                    </div>

                                    {/* Sign Up Tab Content */}
                                    {activeTab === "signup" && (
                                        <>
                                            {/* Username Input */}
                                            <div className="mb-6">
                                                <div className="relative group">
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
                                                        className="w-full pl-12 pr-12 py-4 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                                                        {username && username.length >= 5 && (
                                                            <div className="animate-scale-in">
                                                                {isAvailable ? (
                                                                    <FaCheck className="w-5 h-5 text-green-400" />
                                                                ) : (
                                                                    <GiSkullCrossedBones className="w-5 h-5 text-red-400" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {username && username.length >= 5 && (
                                                    <p
                                                        className={`mt-2 text-xs ml-1 transition-all duration-300 ${isAvailable ? "text-green-400" : "text-red-400"
                                                            }`}
                                                    >
                                                        {isAvailable
                                                            ? "✓ Username is available"
                                                            : "✗ Username is not available"}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Continue Button */}
                                            <button
                                                type="button"
                                                onClick={handleSignUp}
                                                disabled={
                                                    loading ||
                                                    !username ||
                                                    username.length < 5 ||
                                                    (username.length >= 5 && !isAvailable)
                                                }
                                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <span className="relative z-10 flex items-center justify-center gap-3">
                                                    <span>Continue with Username</span>
                                                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                    {loading && (
                                                        <svg
                                                            className="animate-spin h-5 w-5 ml-2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                                fill="none"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                                        </svg>
                                                    )}
                                                </span>
                                            </button>
                                        </>
                                    )}

                                    {/* Sign In Tab Content */}
                                    {activeTab === "signin" && (
                                        <>
                                            {/* Google Sign-In Button Container (will be rendered by Google) */}
                                            <button
                                                type="button"
                                                onClick={handleSignIn}
                                                disabled={
                                                    loading 
                                                }
                                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <span className="relative z-10 flex items-center justify-center gap-3">
                                                    <span>Continue with Gmail</span>
                                                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                    {loading && (
                                                        <svg
                                                            className="animate-spin h-5 w-5 ml-2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                                fill="none"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                                        </svg>
                                                    )}
                                                </span>
                                            </button>
                                        </>
                                    )}

                                    {/* Footer Text */}
                                    <div className="mt-6 text-center">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            By continuing, you agree to our{" "}
                                            <Link
                                                to="/docs"
                                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                Terms of Service
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.8s both;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AuthPageV1;
