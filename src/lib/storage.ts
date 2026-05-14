import { Transaction, WalletStats } from '../types';

const STORAGE_KEY = 'mahfazati_data';
const PROFILE_KEY = 'mahfazati_profile';
const LANG_KEY = 'mahfazati_lang';

export const storage = {
  getLanguage: () => {
    return (localStorage.getItem(LANG_KEY) as 'ar' | 'en') || 'ar';
  },

  saveLanguage: (lang: 'ar' | 'en') => {
    localStorage.setItem(LANG_KEY, lang);
  },

  isFirstVisit: () => {
    return !localStorage.getItem('mahfazati_visited');
  },

  setVisited: () => {
    localStorage.setItem('mahfazati_visited', 'true');
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    const updatedTransactions = [transaction, ...transactions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
  },

  deleteTransaction: (id: string): void => {
    const transactions = storage.getTransactions();
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
  },

  updateTransaction: (id: string, updatedData: Partial<Transaction>): void => {
    const transactions = storage.getTransactions();
    const updatedTransactions = transactions.map((t) => 
      t.id === id ? { ...t, ...updatedData } : t
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
  },

  getStats: (): WalletStats => {
    const transactions = storage.getTransactions();
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      transactionCount: transactions.length,
    };
  },

  getProfile: () => {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return { name: 'مشاري النهدي' };
    try {
      return JSON.parse(data);
    } catch {
      return { name: 'مشاري النهدي' };
    }
  },

  saveProfile: (profile: { name: string }) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
};
