import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiKey, FiArrowRight, FiArrowLeft } from "react-icons/fi";

const PasswordReset = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/password_reset", { email }, { withCredentials: true });
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message || "OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/validate_otp", { email, otp, password }, { withCredentials: true });
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message || "Password changed successfully");
        navigate('/login', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-950/30 rounded-2xl flex items-center justify-center">
              {step === 1 ? <FiMail className="w-7 h-7 text-violet-600 dark:text-violet-400" /> : <FiKey className="w-7 h-7 text-violet-600 dark:text-violet-400" />}
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-violet-600' : s < step ? 'w-4 bg-violet-300' : 'w-4 bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>

          {step === 1 ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Forgot your password?</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enter your email to receive a reset code</p>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Send OTP <FiArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Reset your password</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter the code sent to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span> and your new password
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Enter OTP code" value={otp} onChange={(e) => setOtp(e.target.value)} required className={inputClass} />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Change Password <FiArrowRight className="w-4 h-4" /></>}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  <FiArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/login')} className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
