import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, PlusCircle, History, User, AlertCircle, X, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang];

  const handleAction = (tab: string) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 safe-bottom pointer-events-none">
      {/* Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-[4px] pointer-events-auto z-40"
          />
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-lg glass-card rounded-[32px] h-20 flex items-center justify-around premium-shadow px-4 border border-gray-100/50 pointer-events-auto z-50">
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
        
        <div className="relative flex items-center justify-center w-16 h-16">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20, x: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, scale: 0.8, y: 20, x: '-50%' }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="absolute bottom-full mb-6 left-1/2 w-64 flex flex-col items-center gap-3 pb-2 z-50 origin-bottom"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction('add-income')}
                  className="w-full glass-card p-4 rounded-[24px] flex items-center justify-between premium-shadow border border-gray-100/50 transition-all bg-white/80 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-emerald-500 flex items-center justify-center shadow-sm">
                      <ArrowUpRight size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-premium-black">{t.addIncome}</span>
                  </div>
                  <span className="text-xl">💰</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction('add-expense')}
                  className="w-full glass-card p-4 rounded-[24px] flex items-center justify-between premium-shadow border border-gray-100/50 transition-all bg-white/80 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
                      <ArrowDownRight size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-premium-black">{t.addExpense}</span>
                  </div>
                  <span className="text-xl">💸</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction('add-debt')}
                  className="w-full glass-card p-4 rounded-[24px] flex items-center justify-between premium-shadow border border-gray-100/50 transition-all bg-white/80 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
                      <CreditCard size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-premium-black">{t.addDebt}</span>
                  </div>
                  <span className="text-xl">🧾</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            animate={{ rotate: isMenuOpen ? 45 : 0 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="w-[64px] h-[64px] bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white transition-all border-[5px] border-white relative z-50"
          >
            <PlusCircle size={32} strokeWidth={3} />
          </motion.button>
        </div>

        <NavItem
          icon={AlertCircle}
          label={t.debts}
          active={activeTab === 'debts'}
          onClick={() => onTabChange('debts')}
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
