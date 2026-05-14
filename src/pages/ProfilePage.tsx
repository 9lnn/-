import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, LogOut, ChevronLeft, Save, Globe, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { storage } from '../lib/storage';
import { cn } from '../lib/utils';

import { translations, Language } from '../translations';

interface ProfilePageProps {
  onBack: () => void;
  onProfileUpdate: (name: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const ProfilePage = ({ onBack, onProfileUpdate, lang, onLanguageChange }: ProfilePageProps) => {
  const [profile, setProfile] = useState(storage.getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);

  const t = translations[lang];

  const handleSave = () => {
    const newProfile = { name };
    storage.saveProfile(newProfile);
    setProfile(newProfile);
    onProfileUpdate(name);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group active:scale-95 transition-transform"
        >
          {lang === 'ar' ? (
            <ChevronRight size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
          ) : (
            <ChevronLeft size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
          )}
        </button>
        <h1 className="text-[24px] font-bold text-premium-black uppercase tracking-tight">{t.profileTitle}</h1>
      </div>

      {/* Profile Header */}
      <div className="bento-card p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary/20 mb-4 border-4 border-white">
          {name.charAt(0)}
        </div>
        
        {isEditing ? (
          <div className="w-full max-w-xs space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-bg/50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all font-bold text-center text-lg"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              <Save size={18} />
              {t.saveProfile}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-premium-black">{name}</h2>
            <p className="text-gray-400 text-sm font-medium">{t.goldenMember} • {t.walletNum}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary text-[13px] font-bold mt-2 border-b border-primary/30 pb-0.5 hover:border-primary transition-all"
            >
              {t.editName}
            </button>
          </div>
        )}
      </div>

      {/* General Information Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 px-2 uppercase tracking-widest">{t.settings}</h3>
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col divide-y divide-gray-50">
          <ProfileMenuItem 
            icon={Globe} 
            label={t.language} 
            value={lang === 'ar' ? 'العربية' : 'English'} 
            onClick={() => onLanguageChange(lang === 'ar' ? 'en' : 'ar')}
          />
          <ProfileMenuItem icon={Shield} label={t.security} value={t.activeShort} />
          <ProfileMenuItem icon={CreditCard} label={t.currency} value={t.saudiRiyal} />
        </div>
      </div>

      <div className="bento-card p-6 flex flex-col items-center justify-center text-center opacity-70">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[4px] mb-2 leading-none">{t.version}</p>
        <p className="text-lg font-bold text-premium-black tracking-tighter">Mahfazati v1.0.0</p>
        <p className="text-[11px] text-gray-400 mt-2 font-medium">{t.developer} | +٩٦٦٥٥٧١٤٧٤٩٢</p>
      </div>
    </div>
  );
};

const ProfileMenuItem = ({ icon: Icon, label, value, onClick }: { icon: any, label: string, value: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <span className="text-[15px] font-bold text-premium-black">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-gray-400 font-medium">{value}</span>
      <ChevronLeft size={16} className="text-gray-300" />
    </div>
  </div>
);
