import { arrayProp, instanceMethod, InstanceType, ModelType, prop, Typegoose } from 'typegoose';
import { Writeable, Dynamic } from '../../types';

export type BlockTimeInstanceType = InstanceType<BlockTime>;
export type BlockTimeModelType = ModelType<BlockTime>;

export enum BlockTimeGranularity {
  Day = 'day',
  All = 'all',
}

export class BlockTimeSample extends Typegoose {
  @prop()
  readonly height: number;

  @prop()
  readonly timestamp: number;
}

export class BlockTime extends Typegoose {
  @prop()
  readonly fromDate: Date;

  @prop()
  readonly toDate: Date;

  @prop()
  readonly time: number;

  @prop()
  readonly blocks: number;

  @prop()
  readonly totalTime: number;

  @arrayProp({ items: BlockTimeSample, _id: false })
  readonly samples?: Array<{height: number, timestamp: number}>;

  @prop()
  readonly granularity: BlockTimeGranularity;

  @instanceMethod
  toJSON(this: BlockTimeInstanceType) {
    const data = Object.assign({}, (this as any)._doc) as Writeable<BlockTimeInstanceType> & Dynamic;

    delete data._id;
    delete data.samples;

    return data;
  }
}