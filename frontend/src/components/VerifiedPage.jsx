import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const VerifiedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || "";

  if (state !== 'verified') return <Navigate to='/login' replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Account verified!</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Your account has been successfully verified. You can now sign in to continue.
          </p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Go to Login <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifiedPage;
