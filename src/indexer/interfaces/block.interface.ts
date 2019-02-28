import { Transaction } from './transaction.interface';

export interface Block {
  height: number;
  timestamp: number;
  transactionCount: number;
  transactions: Array<Transaction>;
}