import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Briefcase,
  Mail,
  Phone,
  LogOut,
  Sparkles,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const JobSeekerProfile = ({ onBack }) => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(
    currentUser?.skills?.join(', ') || 'Catering, Setup, Service'
  );
  const [experience, setExperience] = useState(currentUser?.experience || '2 Years');

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      experience
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< My Profile` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">My Profile</h2>
      </div>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        {/* Profile Avatar Card matching reference */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#4B0718] shadow-sm mb-3">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
              }
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-black text-lg text-[#260C13]">
            {currentUser?.name || 'Deepak Kumar'}
          </h3>

          {/* Green Verified Pill matching reference */}
          <div className="mt-1">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ✔ Verified
            </span>
          </div>

          <div className="w-full mt-4 pt-4 border-t border-[#EDE0D7] text-left space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#8B7377] uppercase">Skills:</span>
              <p className="font-semibold text-[#260C13] mt-0.5">
                {currentUser?.skills?.join(', ') || 'Catering, Setup, Service'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8B7377] uppercase">Experience:</span>
              <p className="font-semibold text-[#260C13] mt-0.5">
                {currentUser?.experience || '2 Years'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8B7377] uppercase">Contact:</span>
              <p className="font-semibold text-[#260C13] mt-0.5">
                {currentUser?.email} · {currentUser?.phone || '+91 91234 56789'}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="p-4 rounded-3xl bg-white border border-[#EDE0D7] space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#260C13] mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl p-2.5 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#260C13] mb-1">Experience</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl p-2.5 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#4B0718] text-xs font-bold text-white shadow-xs"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-3 rounded-2xl bg-white border border-[#EDE0D7] hover:border-[#4B0718]/40 text-xs font-bold text-[#260C13] flex items-center justify-center gap-2 transition"
          >
            <Edit3 className="w-4 h-4 text-[#4B0718]" />
            <span>Edit Profile & Skills</span>
          </button>
        )}

        {/* Strict Role Sign Out Button matching prompt requirement */}
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
          >
            <LogOut className="w-4 h-4 text-rose-700" />
            <span>Sign Out of EVEX</span>
          </button>
        </div>
      </div>
    </div>
  );
};
