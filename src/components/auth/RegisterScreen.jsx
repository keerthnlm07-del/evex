import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterScreen = ({ onNavigateToLogin, onBackToRoles }) => {
  const { register, selectedRole } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phone, password });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    if (selectedRole === 'customer') return 'Customer Account';
    if (selectedRole === 'manager') return 'Event Manager Account';
    return 'Job Seeker Account';
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
          <h2 className="text-2xl font-black tracking-tight text-white mt-1">Create Account</h2>
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

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8B7377]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kirthana Sharma"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-3 pl-10 pr-3 text-xs text-[#260C13] placeholder-[#8B7377] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8B7377]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-3 pl-10 pr-3 text-xs text-[#260C13] placeholder-[#8B7377] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8B7377]" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-3 pl-10 pr-3 text-xs text-[#260C13] placeholder-[#8B7377] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1.5">Password</label>
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

          {/* Sign Up Button matching reference */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#4B0718] hover:bg-[#350713] active:scale-98 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Bottom Login Link */}
        <div className="text-center py-4 text-xs text-[#8B7377]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-[#4B0718] hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
