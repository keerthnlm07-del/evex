import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthFlow = ({ onBackToRoles }) => {
  const { selectedRole, login, register, users } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [extraField, setExtraField] = useState(''); // e.g., company or skills

  const getRoleDetails = () => {
    switch (selectedRole) {
      case 'customer':
        return {
          title: 'Customer Portal',
          subtitle: 'Sign in to plan & track your events',
          defaultDemo: users.find((u) => u.role === 'customer'),
          extraLabel: 'Event Types Preferred',
          extraPlaceholder: 'Weddings, Birthdays, Corporate'
        };
      case 'manager':
        return {
          title: 'Event Manager Portal',
          subtitle: 'Sign in to manage bookings & crew',
          defaultDemo: users.find((u) => u.role === 'manager'),
          extraLabel: 'Company / Studio Name',
          extraPlaceholder: 'e.g. Royal Aura Events'
        };
      case 'seeker':
        return {
          title: 'Job Seeker Portal',
          subtitle: 'Sign in to find gigs & track payouts',
          defaultDemo: users.find((u) => u.role === 'seeker'),
          extraLabel: 'Primary Skills',
          extraPlaceholder: 'e.g. Hospitality, Catering, Photography'
        };
      default:
        return {
          title: 'EVEX Portal',
          subtitle: 'Sign in to continue',
          defaultDemo: null,
          extraLabel: 'Additional Info',
          extraPlaceholder: ''
        };
    }
  };

  const roleDetails = getRoleDetails();

  const handleFillDemo = () => {
    if (roleDetails.defaultDemo) {
      setEmail(roleDetails.defaultDemo.email);
      setPassword(roleDetails.defaultDemo.password);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Please fill in both email and password.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        try {
          login(email, password);
        } catch (err) {
          setError(err.message || 'Login failed.');
        } finally {
          setLoading(false);
        }
      }, 400);
    } else {
      // Register
      if (!name.trim() || !email.trim() || !password) {
        setError('Please provide your name, email, and password.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        try {
          register({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone.trim() || '+91 98000 00000',
            city: city.trim() || 'Mumbai, Maharashtra',
            extra: extraField.trim()
          });
        } catch (err) {
          setError(err.message || 'Registration failed.');
        } finally {
          setLoading(false);
        }
      }, 400);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#0B0F19] via-[#0D1324] to-[#080C16]">
      {/* Back Button & Portal Title */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToRoles}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Role</span>
        </button>
        <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-800/40">
          {selectedRole}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-black text-white">{roleDetails.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{roleDetails.subtitle}</p>
      </div>

      {/* Login / Register Segmented Control */}
      <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex mb-4">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError('');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            mode === 'login'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError('');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            mode === 'register'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Demo Credentials Pill */}
      {mode === 'login' && roleDetails.defaultDemo && (
        <div className="mb-4 p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-purple-300">Quick Test Credentials:</p>
            <p className="text-[10px] text-slate-400">
              {roleDetails.defaultDemo.email} • password123
            </p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 transition active:scale-95 shadow-sm"
          >
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            Auto-fill
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {selectedRole === 'manager' ? 'Company / Lead Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'manager' ? 'e.g. Celestial Event Studio' : 'e.g. Rahul Kapoor'}
                    className="w-full bg-[#121829] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#121829] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  City / Region
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full bg-[#121829] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {roleDetails.extraLabel}
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    placeholder={roleDetails.extraPlaceholder}
                    className="w-full bg-[#121829] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@evex.app"
                required
                className="w-full bg-[#121829] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#121829] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? `Enter ${roleDetails.title}` : 'Complete Registration'}
          </button>

          <p className="text-[10px] text-center text-slate-500 mt-3">
            By proceeding, you agree to EVEX Terms & Gig Workforce Policies.
          </p>
        </div>
      </form>
    </div>
  );
};
