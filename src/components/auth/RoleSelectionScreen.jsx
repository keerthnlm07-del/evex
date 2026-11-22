import React from 'react';
import { User, Building2, Briefcase, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RoleSelectionScreen = ({ onRoleSelected }) => {
  const { selectRole } = useAuth();

  const roleOptions = [
    {
      id: 'customer',
      title: "I'm a Customer",
      subtitle: 'Plan and book events',
      icon: User
    },
    {
      id: 'manager',
      title: "I'm an Event Manager",
      subtitle: 'Manage events & hire team',
      icon: Building2
    },
    {
      id: 'seeker',
      title: "I'm a Job Seeker",
      subtitle: 'Find event jobs & gigs',
      icon: Briefcase
    }
  ];

  const handlePick = (roleId) => {
    selectRole(roleId);
    onRoleSelected?.(roleId);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Curved Deep Burgundy Top Header matching reference */}
      <div className="bg-[#4B0718] text-white pt-10 pb-8 px-6 rounded-b-[32px] shadow-sm text-center">
        <h2 className="text-2xl font-black tracking-tight text-white">Join EVEX</h2>
        <p className="text-xs text-amber-100/80 mt-1 font-medium">
          Choose how you want to use the app
        </p>
      </div>

      {/* Role Cards List matching reference */}
      <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
        {roleOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              onClick={() => handlePick(opt.id)}
              className="p-5 rounded-2xl bg-white border border-[#EDE0D7] hover:border-[#4B0718]/40 shadow-sm transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F3] border border-[#F4E8DF] flex items-center justify-center text-[#4B0718] group-hover:bg-[#4B0718] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#260C13]">{opt.title}</h3>
                  <p className="text-xs font-medium text-[#8B7377] mt-0.5">{opt.subtitle}</p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7377] group-hover:text-[#4B0718] transition">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 text-center text-[11px] text-[#8B7377]">
        You can always sign out to switch to another role later.
      </div>
    </div>
  );
};
