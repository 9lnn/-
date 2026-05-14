import { motion } from 'motion/react';
import { LayoutGrid, PlusCircle, History, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { Language, translations } from '../translations';

interface NavItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all relative",
        active ? "text-primary scale-105" : "text-gray-400"
      )}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-bold">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-glow"
          className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};

interface BottomNavProps {
  lang: Language;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const BottomNav = ({ lang, activeTab, onTabChange }: BottomNavProps) => {
  const t = translations[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 safe-bottom pointer-events-none">
      <div className="mx-auto max-w-lg glass-card rounded-[32px] h-20 flex items-center justify-around premium-shadow px-4 border border-gray-100/50 pointer-events-auto">
        <NavItem
          icon={LayoutGrid}
          label={t.home}
          active={activeTab === 'dashboard'}
          onClick={() => onTabChange('dashboard')}
        />
        <NavItem
          icon={History}
          label={t.history}
          active={activeTab === 'history'}
          onClick={() => onTabChange('history')}
        />
        
        <div className="-mt-12 relative z-20">
          <button 
            onClick={() => onTabChange('add-expense')}
            className="w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white active:scale-90 transition-transform border-[6px] border-neutral-bg"
          >
            <PlusCircle size={28} strokeWidth={3} />
          </button>
        </div>

        <NavItem
          icon={PlusCircle}
          label={t.add}
          active={activeTab === 'add-income'}
          onClick={() => onTabChange('add-income')}
        />
        <NavItem
          icon={User}
          label={t.profile}
          active={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        />
      </div>
    </div>
  );
};
