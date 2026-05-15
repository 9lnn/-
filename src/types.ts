export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: string;
  createdAt: number;
}

export type DebtStatus = 'unpaid' | 'partially_paid' | 'paid';

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  paidAmount: number;
  description?: string;
  date: string;
  status: DebtStatus;
  createdAt: number;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  createdAt: number;
}

export interface WalletStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  totalDebt: number;
  transactionCount: number;
}

export interface DebtStats {
  total: number;
  paid: number;
  remaining: number;
}
