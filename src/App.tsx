import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { TransactionForm } from './pages/TransactionForm';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { DebtPage } from './pages/DebtPage';
import { DebtForm } from './pages/DebtForm';
import { Transaction, WalletStats, Debt, DebtStats, UnifiedItem } from './types';
import { storage } from './lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState(storage.getProfile().name);
  const [lang, setLang] = useState<'ar' | 'en'>(storage.getLanguage());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [stats, setStats] = useState<WalletStats>({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalDebtOwe: 0,
    totalDebtToMe: 0,
    transactionCount: 0,
  });
  const [debtStats, setDebtStats] = useState<DebtStats>({
    owe: { total: 0, paid: 0, remaining: 0 },
    toMe: { total: 0, paid: 0, remaining: 0 }
  });

  const getRecentUnified = (): UnifiedItem[] => {
    const combined: UnifiedItem[] = [
      ...transactions.map(t => ({ ...t, unifiedType: 'transaction' as const })),
      ...debts.map(d => ({ 
        id: d.id, 
        amount: d.totalAmount, 
        type: (d.type === 'owe' ? 'expense' : 'income') as any, 
        category: 'debt', 
        description: d.name, 
        date: d.date, 
        createdAt: d.createdAt,
        unifiedType: 'debt' as const,
        debtType: d.type,
        debtStatus: d.status
      }))
    ];

    // Deduplicate by ID and sort
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    return unique.sort((a, b) => b.createdAt - a.createdAt);
  };

  const handleLanguageChange = (newLang: 'ar' | 'en') => {
    storage.saveLanguage(newLang);
    setLang(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Initial sync
    refreshData();

    if (storage.isFirstVisit()) {
      // Add demo data for a better first impression only on first visit
      const demo: Transaction[] = [
        {
          id: 'demo1',
          amount: 5000,
          type: 'income',
          category: 'salary',
          description: 'رصيد افتتاحي',
          date: new Date().toISOString().split('T')[0],
          createdAt: Date.now() - 10000,
        }
      ];
      demo.forEach(t => storage.saveTransaction(t));
      storage.setVisited();
      refreshData();
    }

    // Sync across tabs/instances
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('mahfazati_')) {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshData = () => {
    setTransactions(storage.getTransactions());
    setDebts(storage.getDebts());
    setStats(storage.getStats());
    setDebtStats(storage.getDebtStats());
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTransaction) {
      storage.updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      const newTransaction: Transaction = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
      };
      storage.saveTransaction(newTransaction);
    }
    refreshData();
    setActiveTab('dashboard');
  };

  const handleDebtSubmit = (data: any) => {
    if (activeTab === 'repay-debt') {
      storage.savePayment({
        id: Math.random().toString(36).substr(2, 9),
        debtId: data.debtId,
        amount: data.amount,
        date: data.date,
        createdAt: Date.now()
      });
    } else if (editingDebt) {
      const updatedDebt = {
        ...editingDebt,
        ...data,
        remainingAmount: data.totalAmount - editingDebt.paidAmount,
      };
      if (updatedDebt.remainingAmount <= 0) {
        updatedDebt.status = 'paid';
        updatedDebt.remainingAmount = 0;
      } else if (updatedDebt.paidAmount > 0) {
        updatedDebt.status = 'partially_paid';
      } else {
        updatedDebt.status = 'unpaid';
      }
      storage.updateDebt(editingDebt.id, updatedDebt);
      setEditingDebt(null);
    } else {
      const newDebt: Debt = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        paidAmount: 0,
        remainingAmount: data.totalAmount,
        status: 'unpaid',
        createdAt: Date.now(),
      };
      storage.saveDebt(newDebt);
    }
    refreshData();
    setActiveTab('debts');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('edit-transaction');
  };

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt);
    setActiveTab('edit-debt');
  };

  const handleDeleteDebt = (id: string) => {
    storage.deleteDebt(id);
    refreshData();
  };

  const handleRepayDebt = (id: string) => {
    const debt = debts.find(d => d.id === id);
    if (debt) {
      setEditingDebt(debt);
      setActiveTab('repay-debt');
    }
  };

  const handleDeleteUnified = (id: string, unifiedType: string) => {
    if (unifiedType === 'debt') {
      storage.deleteDebt(id);
    } else {
      storage.deleteTransaction(id);
    }
    refreshData();
  };

  const handleEditUnified = (id: string, unifiedType: string) => {
    if (unifiedType === 'debt') {
      const debt = debts.find(d => d.id === id);
      if (debt) handleEditDebt(debt);
    } else {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) handleEditTransaction(transaction);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard lang={lang} name={userName} stats={stats} debtStats={debtStats} transactions={getRecentUnified().slice(0, 5)} onTabChange={setActiveTab} />;
      case 'add-income':
        return <TransactionForm lang={lang} type="income" onSubmit={handleAddTransaction} onBack={() => setActiveTab('dashboard')} />;
      case 'add-expense':
        return <TransactionForm lang={lang} type="expense" onSubmit={handleAddTransaction} onBack={() => setActiveTab('dashboard')} />;
      case 'edit-transaction':
        return editingTransaction ? (
          <TransactionForm 
            lang={lang}
            type={editingTransaction.type} 
            initialData={editingTransaction} 
            onSubmit={handleAddTransaction} 
            onBack={() => {
              setEditingTransaction(null);
              setActiveTab('history');
            }} 
          />
        ) : null;
      case 'history':
        return <HistoryPage lang={lang} transactions={getRecentUnified()} onDelete={handleDeleteUnified} onEdit={handleEditUnified} />;
      case 'debts':
        return <DebtPage lang={lang} debts={debts} onDelete={handleDeleteDebt} onEdit={handleEditDebt} onAdd={() => setActiveTab('add-debt')} onRepay={handleRepayDebt} />;
      case 'add-debt':
        return <DebtForm lang={lang} mode="add" onSubmit={handleDebtSubmit} onBack={() => setActiveTab('debts')} />;
      case 'edit-debt':
        return editingDebt ? <DebtForm lang={lang} mode="edit" initialDebt={editingDebt} onSubmit={handleDebtSubmit} onBack={() => { setEditingDebt(null); setActiveTab('debts'); }} /> : null;
      case 'repay-debt':
        return editingDebt ? <DebtForm lang={lang} mode="repay" initialDebt={editingDebt} onSubmit={handleDebtSubmit} onBack={() => { setEditingDebt(null); setActiveTab('debts'); }} /> : null;
      case 'profile':
        return <ProfilePage lang={lang} onLanguageChange={handleLanguageChange} onBack={() => setActiveTab('dashboard')} onProfileUpdate={setUserName} />;
      default:
        return <Dashboard lang={lang} name={userName} stats={stats} debtStats={debtStats} transactions={transactions.slice(0, 5)} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg selection:bg-primary/20">
      <div className="max-w-lg mx-auto px-4 safe-top pt-6 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav lang={lang} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

