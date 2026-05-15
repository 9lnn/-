import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { WalletStats, Transaction, DebtStats } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { translations, Language } from '../translations';

interface DashboardProps {
  lang: Language;
  name: string;
  stats: WalletStats;
  debtStats: DebtStats;
  transactions: Transaction[];
  onTabChange: (tab: string) => void;
}

export const Dashboard = ({ lang, name, stats, debtStats, transactions, onTabChange }: DashboardProps) => {
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

      {/* Main Balance & Debt Card - Bento Hero */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-primary rounded-[32px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex divide-x divide-white/20 rtl:divide-x-reverse h-32">
          {/* Balance Section */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <p className="text-[11px] text-white/70 font-bold uppercase tracking-widest mb-1">{t.currentBalance}</p>
            <h2 className="text-xl font-bold tracking-tight">
              {formatCurrency(stats.balance).split(' ')[0]} <span className="text-xs font-normal opacity-70">SAR</span>
            </h2>
          </div>
          
          {/* Debt Section */}
          <div className="flex-1 p-6 flex flex-col justify-center bg-white/5">
            <p className="text-[11px] text-white/70 font-bold uppercase tracking-widest mb-1">{t.totalDebts}</p>
            <h2 className="text-xl font-bold tracking-tight text-red-200">
              {formatCurrency(stats.totalDebt).split(' ')[0]} <span className="text-xs font-normal opacity-70">SAR</span>
            </h2>
          </div>
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

      {/* Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expense Analysis Chart */}
        {expenseData.length > 0 && (
          <div className="bento-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-primary" size={16} />
              <h3 className="text-sm font-bold text-premium-black uppercase tracking-tight">{t.analysis}</h3>
            </div>
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

        {/* Debt Analysis Section */}
        <div className="bento-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-500" size={16} />
            <h3 className="text-sm font-bold text-premium-black uppercase tracking-tight">{t.debtAnalysis}</h3>
          </div>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">{t.paid}</span>
              <span className="text-xs font-bold text-primary">{Math.round((debtStats.paid / (debtStats.total || 1)) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(debtStats.paid / (debtStats.total || 1)) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-neutral-bg p-3 rounded-2xl">
                 <p className="text-[10px] text-gray-400 font-bold mb-1">{t.paid}</p>
                 <p className="text-xs font-bold text-primary">{formatCurrency(debtStats.paid)}</p>
              </div>
              <div className="bg-neutral-bg p-3 rounded-2xl">
                 <p className="text-[10px] text-gray-400 font-bold mb-1">{t.remaining}</p>
                 <p className="text-xs font-bold text-red-500">{formatCurrency(debtStats.remaining)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

