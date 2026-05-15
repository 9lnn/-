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
export type DebtType = 'owe' | 'to_me';

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  paidAmount: number;
  description?: string;
  date: string;
  status: DebtStatus;
  type: DebtType;
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
  totalDebtOwe: number;
  totalDebtToMe: number;
  transactionCount: number;
}

export interface DebtStats {
  owe: {
    total: number;
    paid: number;
    remaining: number;
  };
  toMe: {
    total: number;
    paid: number;
    remaining: number;
  };
}

export interface UnifiedItem {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: string;
  createdAt: number;
  unifiedType: 'transaction' | 'debt';
  debtType?: DebtType;
  debtStatus?: DebtStatus;
}
