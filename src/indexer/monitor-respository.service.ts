import {Inject, Injectable} from '@nestjs/common';
import {State, StateModelType} from './models/state.model';
import {MODEL_STATE} from '../constants';

@Injectable()
export class MonitorRespositoryService {
  readonly ID = 'state';

  constructor(
    @Inject(MODEL_STATE)
    private readonly stateModel: StateModelType,
  ) {}

  async getProcessingHeight(): Promise<number> {
    const state = await this.stateModel.findOne({ ref: this.ID });
    return state && state.processingHeight ? state.processingHeight : 0;
  }

  saveProcessingHeight(height: number): Promise<StateModelType> {
    return this.stateModel.findOneAndUpdate({ ref: this.ID }, {ref: this.ID, processingHeight: height}, {new: true, upsert: true});
  }

  clearProcessHeight(): Promise<StateModelType> {
    return this.saveProcessingHeight(0);
  }
}