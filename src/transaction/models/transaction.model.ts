import {Typegoose, InstanceType, ModelType, prop} from 'typegoose';

export type TransactionInstanceType = InstanceType<Transaction>;
export type TransactionModelType = ModelType<Transaction>;

export enum TransactionGranularity {
  Sec = 'sec',
  Hour = 'hour',
  Day = 'day'
}

export class Transaction extends Typegoose {
  @prop()
  readonly type: number;

  @prop()
  readonly date: Date;

  @prop()
  readonly transactions: number;

  @prop()
  readonly granularity: TransactionGranularity;
}