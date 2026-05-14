/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export interface WalletStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}
