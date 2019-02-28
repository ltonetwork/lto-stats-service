import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LoggerService } from '../logger/logger.service';
import { MODEL_BLOCK } from '../constants';
import { BlockTime, BlockTimeGranularity, BlockTimeInstanceType, BlockTimeModelType } from './models/blocktime.model';

@Injectable()
export class BlockRepositoryService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject(MODEL_BLOCK)
    private readonly model: BlockTimeModelType,
  ) {}

  new(data: Partial<BlockTime>): BlockTimeInstanceType {
    return new this.model(data);
  }

  saveBlockTime(blocktime: BlockTimeInstanceType): Promise<BlockTimeInstanceType> {
    return blocktime.save();
  }

  find(granularity: BlockTimeGranularity): Promise<BlockTimeInstanceType> {
    return this.model.findOne({ granularity });
  }
}