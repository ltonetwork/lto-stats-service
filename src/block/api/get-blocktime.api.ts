import { ApiModelProperty } from '@nestjs/swagger';
import { BlockTimeGranularity } from '../models/blocktime.model';

export class GetBlocktimeParams {
  @ApiModelProperty({
    example: 'day',
    required: false,
    enum: [
      'day',
      'all',
    ],
  })
  readonly granularity: BlockTimeGranularity;
}