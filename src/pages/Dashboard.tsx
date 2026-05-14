import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft
} from 'lucide-react';
import { WalletStats, Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { translations, Language } from '../translations';

interface DashboardProps {
  lang: Language;
  name: string;
  stats: WalletStats;
  transactions: Transaction[];
  onTabChange: (tab: string) => void;
}

export const Dashboard = ({ lang, name, stats, transactions, onTabChange }: DashboardProps) => {
  const t = translations[lang];
  
  // Calculate category data for expenses
  const expenseData = transactions
    .filter(trans => trans.type === 'expense')
    .reduce((acc: any[], current) => {
      const categoryLabel = EXPENSE_CATEGORIES.find(c => c.id === current.category)?.label || t.all;
      const existing = acc.find(item => item.name === categoryLabel);
      if (existing) {
        existing.value += current.amount;
      } else {
        acc.push({ name: categoryLabel, value: current.amount });
      }
      return acc;
    }, []);

  const COLORS = ['#0F9D58', '#2EBD78', '#111111', '#E53935', '#F59E0B', '#3B82F6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-transparent pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium leading-none">{t.welcome}</p>
            <h1 className="text-sm font-bold text-premium-black mt-1">{name}</h1>
          </div>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      {/* Main Balance Card - Bento Hero */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-primary rounded-[32px] p-6 text-white shadow-2xl shadow-primary/30 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm text-white/80 font-medium">{t.currentBalance}</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {formatCurrency(stats.balance).split(' ')[0]} <span className="text-lg font-normal opacity-70">SAR</span>
          </h2>
        </div>
      </motion.div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bento-card p-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ArrowDownLeft className="text-primary" size={16} strokeWidth={3} />
          </div>
          <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">{t.totalIncome}</p>
          <p className="text-sm font-bold text-primary">+{formatCurrency(stats.totalIncome)}</p>
        </div>
        <div className="bento-card p-4">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mb-2">
            <ArrowUpRight className="text-red-500" size={16} strokeWidth={3} />
          </div>
          <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">{t.totalExpense}</p>
          <p className="text-sm font-bold text-red-500">-{formatCurrency(stats.totalExpense)}</p>
        </div>
      </div>

      {/* Expense Analysis Chart */}
      {expenseData.length > 0 && (
        <div className="bento-card p-5">
          <h3 className="text-sm font-bold text-premium-black mb-4 uppercase tracking-tight">{t.analysis}</h3>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {expenseData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-[10px] font-bold text-gray-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions List */}
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-bold text-premium-black uppercase tracking-tight">{t.recentTransactions}</h3>
          <button 
            onClick={() => onTabChange('history')}
            className="text-[11px] text-primary font-bold hover:underline"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="py-12 text-center bento-card border-dashed">
               <p className="text-gray-400 text-xs font-medium">{t.noTransactions}</p>
            </div>
          ) : (
            transactions.map((trans, idx) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={trans.id}
                className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-50 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shadow-sm text-lg">
                    {trans.type === 'income' ? '💰' : '🛒'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-premium-black">
                      {trans.type === 'income' 
                        ? (INCOME_CATEGORIES.find(c => c.id === trans.category)?.label || trans.category)
                        : (EXPENSE_CATEGORIES.find(c => c.id === trans.category)?.label || trans.category)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">{trans.date}</p>
                  </div>
                </div>
                <p className={cn(
                  "text-xs font-bold",
                  trans.type === 'income' ? "text-primary" : "text-red-500"
                )}>
                  {trans.type === 'income' ? '+' : '-'} {trans.amount}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

