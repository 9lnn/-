import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Tag, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { Transaction, TransactionType } from '../types';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';

import { translations, Language } from '../translations';

interface TransactionFormProps {
  lang: Language;
  type: TransactionType;
  initialData?: Transaction;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const TransactionForm = ({ lang, type, initialData, onSubmit, onBack }: TransactionFormProps) => {
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[lang];
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    setIsSuccess(true);
    setTimeout(() => {
      onSubmit({
        amount: parseFloat(amount),
        type,
        category,
        description,
        date,
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-neutral-bg flex items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 color="#0F9D58" size={64} />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold">{t.successTitle}</h2>
          <p className="text-gray-500 max-w-[240px] mx-auto">{t.successMsg}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
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
          {initialData ? t.editTransaction : (type === 'income' ? t.addIncome : t.addExpense)}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        {/* Amount Input */}
        <div className="bento-card p-6 space-y-4">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block text-center">{t.amount}</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-center text-[48px] font-bold outline-none placeholder:text-gray-100 placeholder:font-bold"
              required
              autoFocus
            />
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 text-gray-400 font-bold text-xs uppercase tracking-widest">SAR</span>
          </div>
        </div>

        {/* Category Picker */}
        <div className="space-y-4">
          <label className="text-[13px] font-bold px-2 text-premium-black uppercase tracking-tight">{t.chooseCategory}</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => {
              const IconComp = (Icons as any)[cat.icon] || Icons.MoreHorizontal;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-[28px] border-2 transition-all active:scale-95",
                    category === cat.id 
                      ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                      : "bg-white border-transparent text-gray-400 shadow-sm"
                  )}
                >
                  <IconComp size={22} strokeWidth={2.5} />
                  <span className="text-[11px] font-bold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Section */}
        <div className="bento-card p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400">
               <Calendar size={18} />
               <span className="text-[13px] font-bold uppercase tracking-tight">{t.date}</span>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-neutral-bg/50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium text-[15px]"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400">
               <FileText size={18} />
               <span className="text-[13px] font-bold uppercase tracking-tight">{t.description}</span>
            </div>
            <textarea
              placeholder={t.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-bg/50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium text-[14px] resize-none h-24"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-primary text-white rounded-[24px] font-bold text-[18px] shadow-xl shadow-primary/25 active:scale-[0.98] transition-transform disabled:opacity-50"
          disabled={!amount || !category}
        >
          {t.save}
        </button>
      </form>
    </div>
  );
};
