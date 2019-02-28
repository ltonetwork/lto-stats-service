import { DB_DEFAULT_CONNECTION, MODEL_BLOCK } from '../constants';
import mongoose from 'mongoose';
import { BlockTime } from './models/blocktime.model';

export const blockProviders = [
  {
    provide: MODEL_BLOCK,
    useFactory: (connection: mongoose.Connection) => {
      return (new BlockTime()).getModelForClass(BlockTime, {
        existingConnection: connection,
        schemaOptions: {
          collection: 'blocktimes',
          read: 'primary',
          versionKey: false,
        },
      });
    },
    inject: [DB_DEFAULT_CONNECTION],
  },
];