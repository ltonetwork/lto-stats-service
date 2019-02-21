import { DB_DEFAULT_CONNECTION, MODEL_TRANSACTION } from '../constants';
import { Transaction } from './models/transaction.model';
import mongoose from 'mongoose';

export const transactionProviders = [
  {
    provide: MODEL_TRANSACTION,
    useFactory: (connection: mongoose.Connection) => {
      return (new Transaction()).getModelForClass(Transaction, {
        existingConnection: connection,
        schemaOptions: {
          collection: 'transactions',
          read: 'nearest',
          skipVersioning: true,
          versionKey: false,
        },
      });
    },
    inject: [DB_DEFAULT_CONNECTION],
  }
];
