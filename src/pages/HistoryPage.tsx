import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Trash2, ArrowUpRight, ArrowDownLeft, X, ArrowUpDown, Pencil } from 'lucide-react';
import { Transaction } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { cn, formatCurrency } from '../lib/utils';
import { translations, Language } from '../translations';

interface HistoryPageProps {
  lang: Language;
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export const HistoryPage = ({ lang, transactions, onDelete, onEdit }: HistoryPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const t = translations[lang];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((trans) => {
        const categoryLabel = (trans.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)
          .find(c => c.id === trans.category)?.label || '';
        const matchesSearch = categoryLabel.includes(searchTerm) || (trans.description || '').includes(searchTerm);
        const matchesFilter = filter === 'all' || trans.type === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filter]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-tight text-premium-black uppercase">{t.historyTitle}</h1>
        <div className="bg-white p-1 rounded-2xl shadow-sm flex items-center gap-1 border border-gray-100">
           <button 
             onClick={() => setFilter('all')}
             className={cn("px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider", filter === 'all' ? "bg-primary text-white" : "text-gray-400")}
           >{t.all}</button>
           <button 
             onClick={() => setFilter('income')}
             className={cn("px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider", filter === 'income' ? "bg-primary text-white" : "text-gray-400")}
           >{t.incomeLabel}</button>
           <button 
             onClick={() => setFilter('expense')}
             className={cn("px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider", filter === 'expense' ? "bg-primary text-white" : "text-gray-400")}
           >{t.expenseLabel}</button>
        </div>
      </div>

      <div className="relative">
        <span className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", lang === 'ar' ? "right-4" : "left-4")}>
           <Search size={18} strokeWidth={2.5} />
        </span>
        <input 
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "w-full bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 outline-none focus:ring-2 ring-primary/20 transition-all font-medium text-[14px]",
            lang === 'ar' ? "pr-12" : "pl-12"
          )}
        />
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="py-20 text-center bento-card border-dashed">
             <p className="text-gray-400 text-xs font-medium">{t.noResults}</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTransactions.map((trans) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={trans.id}
                className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-50 flex items-center justify-between group overflow-hidden relative"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border border-gray-50",
                    trans.type === 'income' ? "bg-primary/10 text-primary" : "bg-red-50 text-red-500"
                  )}>
                    {trans.type === 'income' ? '💰' : '🛒'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-[14px] text-premium-black">
                        {trans.type === 'income' 
                          ? (INCOME_CATEGORIES.find(c => c.id === trans.category)?.label || trans.category)
                          : (EXPENSE_CATEGORIES.find(c => c.id === trans.category)?.label || trans.category)}
                      </h4>
                      {trans.description && (
                        <span className="text-[9px] bg-neutral-bg px-2 py-0.5 rounded-full text-gray-400 font-bold truncate max-w-[70px]">
                          {trans.description}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-[10px] font-medium leading-none">{trans.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-left leading-none">
                    <p className={cn(
                      "font-bold text-[16px] tracking-tight",
                      trans.type === 'income' ? "text-primary" : "text-red-500"
                    )}>
                      {trans.type === 'income' ? '+' : '-'} {trans.amount}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEdit(trans)}
                      className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => setIsDeleting(trans.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Overlaid delete confirmation */}
                <AnimatePresence>
                  {isDeleting === trans.id && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute inset-0 bg-red-500 z-10 flex items-center justify-between px-6"
                    >
                      <span className="text-white font-bold">{t.deleteConfirm}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsDeleting(null)}
                          className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-colors"
                        >
                          <X size={20} />
                        </button>
                        <button 
                          onClick={() => {
                            onDelete(trans.id);
                            setIsDeleting(null);
                          }}
                          className="bg-white p-2 rounded-xl text-red-500 hover:bg-white/90 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

