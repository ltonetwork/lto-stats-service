import {Typegoose, InstanceType, ModelType, prop} from 'typegoose';

export type StateInstanceType = InstanceType<State>;
export type StateModelType = ModelType<State>;

export class State extends Typegoose {
  @prop()
  readonly ref: string;

  @prop()
  readonly processingHeight: number;
}