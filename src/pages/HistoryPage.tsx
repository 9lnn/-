import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Trash2, ArrowUpRight, ArrowDownLeft, X, ArrowUpDown, Pencil } from 'lucide-react';
import { Transaction, UnifiedItem } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { cn, formatCurrency } from '../lib/utils';
import { translations, Language } from '../translations';

interface HistoryPageProps {
  lang: Language;
  transactions: UnifiedItem[];
  onDelete: (id: string, unifiedType: string) => void;
  onEdit: (id: string, unifiedType: string) => void;
}

export const HistoryPage = ({ lang, transactions, onDelete, onEdit }: HistoryPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const t = translations[lang];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((trans) => {
        let categoryLabel = '';
        if (trans.unifiedType === 'debt') {
          categoryLabel = trans.description || '';
        } else {
          categoryLabel = (trans.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)
            .find(c => c.id === trans.category)?.label || '';
        }
        
        const matchesSearch = categoryLabel.includes(searchTerm) || (trans.description || '').includes(searchTerm);
        
        let matchesFilter = false;
        if (filter === 'all') matchesFilter = true;
        else if (filter === 'income') matchesFilter = trans.type === 'income' && trans.unifiedType === 'transaction';
        else if (filter === 'expense') matchesFilter = trans.type === 'expense' && trans.unifiedType === 'transaction';

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [transactions, searchTerm, filter]);

  const filterOptions = [
    { id: 'all', label: t.all, color: 'bg-primary' },
    { id: 'income', label: t.incomeLabel, color: 'bg-emerald-500' },
    { id: 'expense', label: t.expenseLabel, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-[24px] font-bold tracking-tight text-premium-black uppercase">{t.historyTitle}</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
          {filterOptions.map((opt) => (
            <button 
              key={opt.id}
              onClick={() => setFilter(opt.id as any)}
              className={cn(
                "px-4 py-2 rounded-2xl text-[11px] font-bold transition-all uppercase tracking-wider whitespace-nowrap flex items-center gap-2 border",
                filter === opt.id 
                  ? `${opt.color} text-white border-transparent shadow-sm` 
                  : "bg-white text-gray-400 border-gray-100"
              )}
            >
              {opt.label}
            </button>
          ))}
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
                    {trans.unifiedType === 'debt' ? '🧾' : (trans.type === 'income' ? '💰' : '💸')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-[14px] text-premium-black">
                        {trans.unifiedType === 'debt' 
                          ? trans.description
                          : (trans.type === 'income' 
                              ? (INCOME_CATEGORIES.find(c => c.id === trans.category)?.label || trans.category)
                              : (EXPENSE_CATEGORIES.find(c => c.id === trans.category)?.label || trans.category))}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-[10px] font-medium leading-none">
                      {trans.date} {trans.unifiedType === 'debt' && <span className="opacity-50">· {trans.debtType === 'owe' ? t.debtOwe : t.debtToMe}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-left leading-none">
                    <p className={cn(
                      "font-bold text-[16px] tracking-tight",
                      trans.type === 'income' ? "text-primary" : "text-red-500"
                    )}>
                      {trans.type === 'income' ? '+' : '-'} {formatCurrency(trans.amount).split(' ')[0]}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEdit(trans.id, trans.unifiedType)}
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
                            onDelete(trans.id, trans.unifiedType);
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

