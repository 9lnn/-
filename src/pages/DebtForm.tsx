import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Save, User as UserIcon, Calendar, FileText, CheckCircle2, CreditCard } from 'lucide-react';
import { Debt, DebtStatus } from '../types';
import { cn } from '../lib/utils';
import { translations, Language } from '../translations';

interface DebtFormProps {
  lang: Language;
  mode: 'add' | 'edit' | 'repay';
  initialDebt?: Debt;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const DebtForm = ({ lang, mode, initialDebt, onSubmit, onBack }: DebtFormProps) => {
  const [name, setName] = useState(initialDebt?.name || '');
  const [totalAmount, setTotalAmount] = useState(initialDebt?.totalAmount.toString() || '');
  const [repayAmount, setRepayAmount] = useState('');
  const [description, setDescription] = useState(initialDebt?.description || '');
  const [date, setDate] = useState(initialDebt?.date || new Date().toISOString().split('T')[0]);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    if (mode === 'edit' && initialDebt) {
      setName(initialDebt.name);
      setTotalAmount(initialDebt.totalAmount.toString());
      setDescription(initialDebt.description || '');
      setDate(initialDebt.date);
    }
  }, [mode, initialDebt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'repay') {
      onSubmit({
        debtId: initialDebt?.id,
        amount: parseFloat(repayAmount),
        date: new Date().toISOString().split('T')[0]
      });
    } else {
      onSubmit({
        id: initialDebt?.id,
        name,
        totalAmount: parseFloat(totalAmount),
        description,
        date,
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="space-y-6"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 color="#0F9D58" size={64} />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold">{mode === 'repay' ? t.repaySuccess : t.successTitle}</h2>
          <p className="text-gray-500 max-w-[240px] mx-auto">{t.successMsg}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center premium-shadow group"
        >
          {lang === 'ar' ? (
            <ChevronRight size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
          ) : (
            <ChevronLeft size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
          )}
        </button>
        <h1 className="text-[24px] font-bold">
          {mode === 'repay' ? t.repayTitle : (mode === 'edit' ? t.editDebt : t.addDebt)}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode !== 'repay' && (
          <div className="bento-card p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-400 mb-1">
              <UserIcon size={18} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{t.debtName}</span>
            </div>
            <input
              type="text"
              className="w-full text-lg font-bold text-premium-black bg-neutral-bg/50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
        )}

        <div className="bento-card p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-400 mb-1">
            {mode === 'repay' ? <CreditCard size={18} /> : <CreditCard size={18} />}
            <span className="text-[11px] font-bold uppercase tracking-widest">{mode === 'repay' ? t.repayAmount : t.debtAmount}</span>
          </div>
          <div className="relative">
            <input
              type="number"
              className="w-full text-4xl font-bold bg-transparent text-center outline-none"
              value={mode === 'repay' ? repayAmount : totalAmount}
              onChange={(e) => mode === 'repay' ? setRepayAmount(e.target.value) : setTotalAmount(e.target.value)}
              required
            />
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 text-gray-400 font-bold text-xs uppercase tracking-widest">SAR</span>
          </div>
          {mode === 'repay' && initialDebt && (
            <p className="text-center text-[10px] text-gray-400 font-medium pt-2">
              {t.remaining}: {initialDebt.remainingAmount} ر.س
            </p>
          )}
        </div>

        {mode !== 'repay' && (
          <>
            <div className="bento-card p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                   <Calendar size={18} />
                   <span className="text-[13px] font-bold uppercase tracking-tight">{t.debtDate}</span>
                </div>
                <input
                  type="date"
                  className="w-full bg-neutral-bg/50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium text-[14px]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                   <FileText size={18} />
                   <span className="text-[13px] font-bold uppercase tracking-tight">{t.debtDescription}</span>
                </div>
                <textarea
                  placeholder={t.debtDescription}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-bg/50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium text-[14px] resize-none h-24"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-5 bg-primary text-white rounded-[24px] font-bold text-[18px] shadow-xl shadow-primary/25 active:scale-[0.98] transition-transform"
        >
          {mode === 'repay' ? t.repay : t.save}
        </button>
      </form>
    </div>
  );
};
