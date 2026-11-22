import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  Users,
  Compass,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }) => {
  const { login, register, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState(initialMode); // 'signin' | 'signup'
  const [role, setRole] = useState('customer'); // 'customer' | 'manager' | 'seeker'

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      if (tab === 'signin') {
        await login({ emailOrPhone: email, password });
        if (onAuthSuccess) onAuthSuccess();
        onClose();
      } else {
        if (!name.trim()) throw new Error('Please enter your full name or company name.');
        await register({ name, email, phone, password, role });
        if (onAuthSuccess) onAuthSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(role);
      if (onAuthSuccess) onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#EAE5DE] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#736B66] hover:text-[#242424] shadow-xs transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Card with Floral Aesthetic matching reference mockup */}
        <div className="relative p-6 pt-7 bg-gradient-to-br from-[#FFF8F3] to-[#F4E8DF]/70 border-b border-[#EAE5DE]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#4B0718]" />
            <span className="font-['Cinzel',serif] text-xl font-bold tracking-wider text-[#4B0718]">EVEX</span>
          </div>
          <h2 className="text-xl font-bold text-[#242424]">Let's get you started</h2>
          <p className="text-xs text-[#736B66] mt-1 leading-relaxed">
            Join EVEX to plan events, grow your business, or find exciting gig opportunities.
          </p>

          {/* Sign In / Sign Up Tabs */}
          <div className="mt-5 p-1 bg-white/80 rounded-xl border border-[#EAE5DE] grid grid-cols-2 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(''); }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                tab === 'signin'
                  ? 'bg-[#4B0718] text-white shadow-xs'
                  : 'text-[#736B66] hover:text-[#242424]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(''); }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                tab === 'signup'
                  ? 'bg-[#4B0718] text-white shadow-xs'
                  : 'text-[#736B66] hover:text-[#242424]'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social Google Login Button matching mockup */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-[#EAE5DE] bg-white hover:bg-[#F8F7F5] text-xs font-bold text-[#242424] flex items-center justify-center gap-2.5 shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
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

          <div className="flex items-center gap-3 text-xs text-[#736B66]">
            <div className="flex-1 h-px bg-[#EAE5DE]" />
            <span>or with email</span>
            <div className="flex-1 h-px bg-[#EAE5DE]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <>
                {/* Role Selector on Sign Up */}
                <div>
                  <label className="block text-[11px] font-bold text-[#736B66] uppercase tracking-wider mb-1.5">
                    I want to join as:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        role === 'customer'
                          ? 'border-[#4B0718] bg-[#FFF8F3] text-[#4B0718] font-bold'
                          : 'border-[#EAE5DE] text-[#736B66] hover:bg-[#F8F7F5]'
                      }`}
                    >
                      <User className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[10px] block font-semibold leading-tight">Client</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('manager')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        role === 'manager'
                          ? 'border-[#4B0718] bg-[#FFF8F3] text-[#4B0718] font-bold'
                          : 'border-[#EAE5DE] text-[#736B66] hover:bg-[#F8F7F5]'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[10px] block font-semibold leading-tight">Manager</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('seeker')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        role === 'seeker'
                          ? 'border-[#4B0718] bg-[#FFF8F3] text-[#4B0718] font-bold'
                          : 'border-[#EAE5DE] text-[#736B66] hover:bg-[#F8F7F5]'
                      }`}
                    >
                      <Users className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[10px] block font-semibold leading-tight">Talent</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#242424] mb-1">
                    {role === 'manager' ? 'Company or Manager Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#736B66]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'manager' ? 'Aura Events Co.' : 'Keerthana Anand'}
                      className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#242424] placeholder-[#736B66] focus:outline-none focus:border-[#4B0718]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#242424] mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-[#736B66]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#242424] placeholder-[#736B66] focus:outline-none focus:border-[#4B0718]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#242424] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#736B66]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@evex.app"
                  className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#242424] placeholder-[#736B66] focus:outline-none focus:border-[#4B0718]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#242424] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#736B66]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 pl-9 pr-10 text-xs text-[#242424] placeholder-[#736B66] focus:outline-none focus:border-[#4B0718]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#736B66] hover:text-[#242424]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password matching reference mockup */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#4B0718] focus:ring-[#4B0718] border-[#EAE5DE]"
                />
                <span className="text-[#736B66]">Remember me</span>
              </label>

              {tab === 'signin' && (
                <button
                  type="button"
                  onClick={() => setInfoMessage('Please contact support@evex.app to reset your credentials.')}
                  className="text-xs font-semibold text-[#4B0718] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {infoMessage && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                {infoMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-md shadow-[#4B0718]/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          {/* Quick Demo Accounts Selector (For Dev / QA testing) */}
          <div className="pt-3 border-t border-[#EAE5DE]/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B66]">
                Development Demo Accounts
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
                    if (onAuthSuccess) onAuthSuccess();
                    onClose();
                  } catch (err) {
                    setError('Demo login error: ' + err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-1.5 px-2 rounded-lg bg-[#FFF8F3] hover:bg-[#F4E8DF] border border-[#EDE0D7] text-left transition text-[11px] font-semibold text-[#4B0718] disabled:opacity-50"
              >
                <span className="block font-bold">Customer</span>
                <span className="text-[9px] text-[#736B66] block truncate">Keerthana</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    await login({ emailOrPhone: 'manager.demo@evex.app', password: 'EvexDemo@2026!' });
                    if (onAuthSuccess) onAuthSuccess();
                    onClose();
                  } catch (err) {
                    setError('Demo login error: ' + err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-1.5 px-2 rounded-lg bg-[#FFF8F3] hover:bg-[#F4E8DF] border border-[#EDE0D7] text-left transition text-[11px] font-semibold text-[#4B0718] disabled:opacity-50"
              >
                <span className="block font-bold">Manager</span>
                <span className="text-[9px] text-[#736B66] block truncate">EVEX Events</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    await login({ emailOrPhone: 'seeker.demo@evex.app', password: 'EvexDemo@2026!' });
                    if (onAuthSuccess) onAuthSuccess();
                    onClose();
                  } catch (err) {
                    setError('Demo login error: ' + err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-1.5 px-2 rounded-lg bg-[#FFF8F3] hover:bg-[#F4E8DF] border border-[#EDE0D7] text-left transition text-[11px] font-semibold text-[#4B0718] disabled:opacity-50"
              >
                <span className="block font-bold">Job Seeker</span>
                <span className="text-[9px] text-[#736B66] block truncate">Ananya</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
