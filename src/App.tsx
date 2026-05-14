/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { TransactionForm } from './pages/TransactionForm';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { Transaction, WalletStats } from './types';
import { storage } from './lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState(storage.getProfile().name);
  const [lang, setLang] = useState<'ar' | 'en'>(storage.getLanguage());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [stats, setStats] = useState<WalletStats>({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
  });

  const handleLanguageChange = (newLang: 'ar' | 'en') => {
    storage.saveLanguage(newLang);
    setLang(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    if (storage.isFirstVisit()) {
      // Add demo data for a better first impression only on first visit
      const demo: Transaction[] = [
        {
          id: 'demo1',
          amount: 5000,
          type: 'income',
          category: 'salary',
          description: 'راتب شهر مايو',
          date: new Date().toISOString().split('T')[0],
          createdAt: Date.now() - 10000,
        },
        {
          id: 'demo2',
          amount: 150,
          type: 'expense',
          category: 'coffee',
          description: 'قهوة الصباح',
          date: new Date().toISOString().split('T')[0],
          createdAt: Date.now() - 5000,
        }
      ];
      demo.forEach(t => storage.saveTransaction(t));
      storage.setVisited();
    }
    refreshData();
  }, []);

  const refreshData = () => {
    setTransactions(storage.getTransactions());
    setStats(storage.getStats());
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

  const handleDeleteTransaction = (id: string) => {
    storage.deleteTransaction(id);
    refreshData();
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('edit-transaction');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard lang={lang} name={userName} stats={stats} transactions={transactions.slice(0, 5)} onTabChange={setActiveTab} />;
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
        return <HistoryPage lang={lang} transactions={transactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />;
      case 'profile':
        return <ProfilePage lang={lang} onLanguageChange={handleLanguageChange} onBack={() => setActiveTab('dashboard')} onProfileUpdate={setUserName} />;
      default:
        return <Dashboard lang={lang} name={userName} stats={stats} transactions={transactions.slice(0, 5)} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg pb-24 selection:bg-primary/20">
      <div className="max-w-lg mx-auto px-4 pt-8">
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

