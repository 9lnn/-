import { Transaction, WalletStats, Debt, DebtPayment, DebtStats } from '../types';

const STORAGE_KEY = 'mahfazati_data';
const PROFILE_KEY = 'mahfazati_profile';
const LANG_KEY = 'mahfazati_lang';
const DEBT_KEY = 'mahfazati_debts';
const PAYMENTS_KEY = 'mahfazati_payments';

export const storage = {
  getLanguage: () => {
    return (localStorage.getItem(LANG_KEY) as 'ar' | 'en') || 'ar';
  },

  saveLanguage: (lang: 'ar' | 'en') => {
    localStorage.setItem(LANG_KEY, lang);
  },

  isFirstVisit: () => {
    const hasVisited = localStorage.getItem('mahfazati_visited');
    const hasTransactions = storage.getTransactions().length > 0;
    const hasDebts = storage.getDebts().length > 0;
    return !hasVisited && !hasTransactions && !hasDebts;
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
    try {
      const transactions = storage.getTransactions();
      const updatedTransactions = [transaction, ...transactions];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
    } catch (e) {
      console.error('Error saving transaction to localStorage', e);
      alert('خطأ في الحفظ! قد تكون مساحة التخزين ممتلئة.');
    }
  },

  deleteTransaction: (id: string): void => {
    try {
      const transactions = storage.getTransactions();
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
    } catch (e) {
      console.error('Error deleting transaction from localStorage', e);
    }
  },

  updateTransaction: (id: string, updatedData: Partial<Transaction>): void => {
    try {
      const transactions = storage.getTransactions();
      const updatedTransactions = transactions.map((t) => 
        t.id === id ? { ...t, ...updatedData } : t
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
    } catch (e) {
      console.error('Error updating transaction in localStorage', e);
    }
  },

  getDebts: (): Debt[] => {
    const data = localStorage.getItem(DEBT_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveDebt: (debt: Debt): void => {
    try {
      const debts = storage.getDebts();
      const updatedDebts = [debt, ...debts];
      localStorage.setItem(DEBT_KEY, JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error saving debt to localStorage', e);
    }
  },

  deleteDebt: (id: string): void => {
    try {
      const debts = storage.getDebts();
      const updatedDebts = debts.filter((d) => d.id !== id);
      localStorage.setItem(DEBT_KEY, JSON.stringify(updatedDebts));
      
      // Also delete associated payments
      const payments = storage.getPayments();
      const updatedPayments = payments.filter(p => p.debtId !== id);
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(updatedPayments));
    } catch (e) {
      console.error('Error deleting debt from localStorage', e);
    }
  },

  updateDebt: (id: string, updatedData: Partial<Debt>): void => {
    try {
      const debts = storage.getDebts();
      const updatedDebts = debts.map((d) => 
        d.id === id ? { ...d, ...updatedData } : d
      );
      localStorage.setItem(DEBT_KEY, JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error updating debt in localStorage', e);
    }
  },

  getPayments: (): DebtPayment[] => {
    const data = localStorage.getItem(PAYMENTS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  savePayment: (payment: DebtPayment): void => {
    try {
      const payments = storage.getPayments();
      const updatedPayments = [payment, ...payments];
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(updatedPayments));
      
      // Update the debt automatically
      const debt = storage.getDebts().find(d => d.id === payment.debtId);
      if (debt) {
        const newPaid = debt.paidAmount + payment.amount;
        const newRemaining = Math.max(0, debt.totalAmount - newPaid);
        const newStatus = newRemaining === 0 ? 'paid' : (newPaid > 0 ? 'partially_paid' : 'unpaid');
        
        storage.updateDebt(debt.id, {
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: newStatus
        });
      }
    } catch (e) {
      console.error('Error saving payment to localStorage', e);
    }
  },

  getStats: (): WalletStats => {
    const transactions = storage.getTransactions();
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    const debts = storage.getDebts();
    const totalDebtRemaining = debts.reduce((acc, current) => acc + current.remainingAmount, 0);

    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      totalDebt: totalDebtRemaining,
      transactionCount: transactions.length,
    };
  },

  getDebtStats: (): DebtStats => {
    const debts = storage.getDebts();
    return debts.reduce((acc, current) => ({
      total: acc.total + current.totalAmount,
      paid: acc.paid + current.paidAmount,
      remaining: acc.remaining + current.remainingAmount,
    }), { total: 0, paid: 0, remaining: 0 });
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
