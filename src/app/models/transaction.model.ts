export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: number;
  title: string;
  categoryId: number;
  description?: string;
  amountInCents: number;
  userId: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  type: TransactionType;
}

export interface CreateTransactionRequest {
  title: string;
  categoryId: number;
  description?: string;
  amountInCents: number;
  userId: number;
  date: string;
  type: TransactionType;
}

export interface UpdateTransactionRequest {
  title?: string;
  categoryId?: number;
  description?: string;
  amountInCents?: number;
  userId?: number;
  date?: string;
  type?: TransactionType;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}
