import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = ({ onNavigateToRegister, onBackToRoles }) => {
  const { login, selectedRole } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!emailOrPhone.trim() || !password) {
      setError('Please enter your email/phone and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ emailOrPhone, password });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setInfoMessage('');
    const email = emailOrPhone.trim();
    if (!email || !email.includes('@')) {
      setError('Please enter your registered email address in the field above first.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMessage(`Password reset link sent to ${email}. Check your inbox.`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account exists with this email address.');
      } else {
        setError(err.message || 'Failed to send reset email.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In must be enabled in Firebase Console > Authentication > Sign-in method.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was cancelled.');
      } else {
        setError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    if (selectedRole === 'customer') return 'Customer Portal';
    if (selectedRole === 'manager') return 'Event Manager Portal';
    return 'Job Seeker Portal';
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Curved Deep Burgundy Top Header matching reference image */}
      <div className="bg-[#4B0718] text-white pt-8 pb-10 px-6 rounded-b-[32px] shadow-sm relative">
        <button
          onClick={onBackToRoles}
          className="absolute left-5 top-7 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/90 bg-white/10 px-2.5 py-0.5 rounded-full">
            {getRoleBadge()}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1">
            Welcome Back<br />to EVEX
          </h2>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 p-6 flex flex-col justify-between -mt-4">
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white border border-[#EDE0D7] shadow-sm space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              {infoMessage}
            </div>
          )}

          {/* Email or Phone */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1.5">Email or Phone</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8B7377]" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="name@example.com or mobile"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-3 pl-10 pr-3 text-xs text-[#260C13] placeholder-[#8B7377] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#260C13]">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-bold text-[#760F2A] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8B7377]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-3 pl-10 pr-10 text-xs text-[#260C13] placeholder-[#8B7377] focus:outline-none focus:border-[#4B0718]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#8B7377] hover:text-[#260C13]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button matching reference */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#4B0718] hover:bg-[#350713] active:scale-98 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Or continue with Google matching reference */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-[#8B7377] mb-2 font-medium">Or continue with</p>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-xl border border-[#EDE0D7] bg-[#FFF8F3] hover:bg-[#F4E8DF] flex items-center justify-center gap-2 text-xs font-bold text-[#260C13] transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Accounts Selector (For Dev / QA testing) */}
        <div className="pt-3 border-t border-[#EDE0D7]/80 my-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7377]">
              Demo Accounts (Dev Test)
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              1-Click Auth
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  await login({ emailOrPhone: 'customer.demo@evex.app', password: 'EvexDemo@2026!' });
                } catch (err) {
                  setError('Demo login error: ' + err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="py-1.5 px-2 rounded-lg bg-[#FFF8F3] hover:bg-[#F4E8DF] border border-[#EDE0D7] text-left transition text-[11px] font-semibold text-[#4B0718] disabled:opacity-50"
            >
              <span className="block font-bold">Customer</span>
              <span className="text-[9px] text-[#8B7377] block truncate">Keerthana</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  await login({ emailOrPhone: 'manager.demo@evex.app', password: 'EvexDemo@2026!' });
                } catch (err) {
                  setError('Demo login error: ' + err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="py-1.5 px-2 rounded-lg bg-[#FFF8F3] hover:bg-[#F4E8DF] border border-[#EDE0D7] text-left transition text-[11px] font-semibold text-[#4B0718] disabled:opacity-50"
            >
              <span className="block font-bold">Manager</span>
              <span className="text-[9px] text-[#8B7377] block truncate">EVEX Events</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  await login({ emailOrPhone: 'seeker.demo@evex.app', password: 'EvexDemo@2026!' });
                } catch (err) {
                  setError('Demo login error: ' + err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="py-1.5 px-2 rounded-lg bg-[#FFF8F3] hover:bg-[#F4E8DF] border border-[#EDE0D7] text-left transition text-[11px] font-semibold text-[#4B0718] disabled:opacity-50"
            >
              <span className="block font-bold">Job Seeker</span>
              <span className="text-[9px] text-[#8B7377] block truncate">Ananya</span>
            </button>
          </div>
        </div>

        {/* Bottom Sign Up Link */}
        <div className="text-center py-4 text-xs text-[#8B7377]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-[#4B0718] hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
