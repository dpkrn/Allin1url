import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FiMail, FiArrowRight, FiRefreshCw } from "react-icons/fi";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, email, password } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  const handleVerifyAcc = async (e) => {
    e.preventDefault();
    const newOtp = otp.reduce((acc, c) => acc + c, '');
    if (newOtp.length < 4) { toast.error("Please enter all 4 digits"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/verifyAcc", { otp: newOtp, username, email, password }, { withCredentials: true });
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message);
        navigate("/verified", { state: "verified", replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1].focus();
  };

  const resendOtp = async (e) => {
    e.preventDefault();
    setResending(true);
    try {
      const res = await api.post('/auth/signup', { email }, { withCredentials: true });
      if (res.status === 201 && res.data.success) toast.success(res.data.message || "OTP resent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-950/30 rounded-2xl flex items-center justify-center">
              <FiMail className="w-7 h-7 text-violet-600 dark:text-violet-400" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Check your email</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We sent a 4-digit code to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyAcc}>
            {/* OTP inputs */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-14 h-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Verify Account <FiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">Code is valid for 5 minutes</p>

          <div className="flex items-center justify-center gap-1 mt-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Didn't receive it?</span>
            <button
              onClick={resendOtp}
              disabled={resending}
              className="flex items-center gap-1 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-50"
            >
              {resending && <FiRefreshCw className="w-3 h-3 animate-spin" />}
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
