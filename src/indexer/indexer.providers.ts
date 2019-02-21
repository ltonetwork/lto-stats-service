import { DB_DEFAULT_CONNECTION, MODEL_STATE } from '../constants';
import { State } from './models/state.model';
import mongoose from 'mongoose';

export const indexerProviders = [
  {
    provide: MODEL_STATE,
    useFactory: (connection: mongoose.Connection) => {
      return (new State()).getModelForClass(State, {
        existingConnection: connection,
        schemaOptions: {
          collection: 'state',
          read: 'nearest',
          skipVersioning: true,
          versionKey: false,
        },
      });
    },
    inject: [DB_DEFAULT_CONNECTION],
  },
];