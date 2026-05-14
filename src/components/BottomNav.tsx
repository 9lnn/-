import { motion } from 'motion/react';
import { LayoutGrid, PlusCircle, MinusCircle, History, User } from 'lucide-react';
import { cn } from '../lib/utils';

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
        active ? "text-primary scale-110" : "text-gray-400"
      )}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
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
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-4 safe-bottom">
      <div className="mx-auto max-w-lg glass-card rounded-[32px] h-20 flex items-center justify-around premium-shadow px-4 border-t border-gray-100">
        <NavItem
          icon={LayoutGrid}
          label="الرئيسية"
          active={activeTab === 'dashboard'}
          onClick={() => onTabChange('dashboard')}
        />
        <NavItem
          icon={History}
          label="العمليات"
          active={activeTab === 'history'}
          onClick={() => onTabChange('history')}
        />
        
        <div className="-mt-12 relative z-20">
          <button 
            onClick={() => onTabChange('add-expense')}
            className="w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white active:scale-90 transition-transform border-4 border-white"
          >
            <PlusCircle size={28} strokeWidth={3} />
          </button>
        </div>

        <NavItem
          icon={PlusCircle}
          label="إضافة"
          active={activeTab === 'add-income'}
          onClick={() => onTabChange('add-income')}
        />
        <NavItem
          icon={User}
          label="الملف"
          active={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        />
      </div>
    </div>
  );
};
