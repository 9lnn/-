import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Search, Trash2, Pencil, CheckCircle, Clock, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
import { Debt } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { translations, Language } from '../translations';
import { storage } from '../lib/storage';

interface DebtPageProps {
  lang: Language;
  debts: Debt[];
  onDelete: (id: string) => void;
  onEdit: (debt: Debt) => void;
  onAdd: () => void;
  onRepay: (debtId: string) => void;
}

export const DebtPage = ({ lang, debts, onDelete, onEdit, onAdd, onRepay }: DebtPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'partially_paid' | 'paid'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const t = translations[lang];

  const filteredDebts = useMemo(() => {
    return debts
      .filter((debt) => {
        const matchesSearch = 
          debt.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (debt.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || debt.status === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [debts, searchTerm, filter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-tight text-premium-black uppercase">{t.debtHistory}</h1>
        <button 
          onClick={onAdd}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle size={24} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        {[
          { id: 'all', label: t.all },
          { id: 'unpaid', label: t.unpaid },
          { id: 'partially_paid', label: t.partiallyPaid },
          { id: 'paid', label: t.paidFull }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as any)}
            className={cn(
              "px-4 py-2 rounded-2xl text-[11px] font-bold whitespace-nowrap transition-all border",
              filter === item.id 
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/20" 
                : "bg-white text-gray-400 border-gray-100"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <span className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", lang === 'ar' ? "right-4" : "left-4")}>
           <Search size={18} strokeWidth={2.5} />
        </span>
        <input 
          placeholder={t.searchDebt}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "w-full bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 outline-none focus:ring-2 ring-primary/20 transition-all font-medium text-[14px]",
            lang === 'ar' ? "pr-12" : "pl-12"
          )}
        />
      </div>

      {/* Debts List */}
      <div className="space-y-4">
        {filteredDebts.length === 0 ? (
          <div className="py-20 text-center bento-card border-dashed">
             <p className="text-gray-400 text-xs font-medium">{t.noResults}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredDebts.map((debt) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={debt.id}
                className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-50 group relative overflow-hidden active:scale-[0.99] transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border border-gray-50",
                        debt.status === 'paid' ? "bg-primary/10 text-primary" : "bg-red-50 text-red-500"
                    )}>
                      {debt.status === 'paid' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-premium-black">{debt.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">{debt.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.remaining}</p>
                    <p className="text-sm font-bold text-red-500">{formatCurrency(debt.remainingAmount)}</p>
                  </div>
                </div>

                {debt.description && (
                  <p className="text-[11px] text-gray-500 mb-4 bg-gray-50/50 p-2 rounded-xl italic">
                    {debt.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[9px] font-bold text-gray-400">
                    <span>{t.paid}: {formatCurrency(debt.paidAmount)}</span>
                    <span>{t.totalDebts}: {formatCurrency(debt.totalAmount)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(debt.paidAmount / debt.totalAmount) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onRepay(debt.id)}
                    disabled={debt.status === 'paid'}
                    className="flex-1 py-2.5 bg-primary/5 text-primary rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors disabled:opacity-30"
                  >
                    <CreditCard size={14} />
                    {t.repay}
                  </button>
                  <button 
                    onClick={() => onEdit(debt)}
                    className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => setIsDeleting(debt.id)}
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Confirm Delete Overlay */}
                <AnimatePresence>
                  {isDeleting === debt.id && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute inset-0 bg-red-500 z-10 flex items-center justify-between px-6"
                    >
                      <span className="text-white font-bold text-sm">{t.deleteConfirm}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsDeleting(null)}
                          className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-colors"
                        >
                          <ChevronRight className="rtl:rotate-180" size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            onDelete(debt.id);
                            setIsDeleting(null);
                          }}
                          className="bg-white p-2 rounded-xl text-red-500 hover:bg-white/90 transition-colors"
                        >
                          <Trash2 size={16} />
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
