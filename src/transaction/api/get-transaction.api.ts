import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionGranularity } from '../models/transaction.model';

export class GetTransactionParams {
  @ApiModelProperty({
    example: '2019-01-01',
    required: false
  })
  readonly startdate: string;

  @ApiModelProperty({
    example: '2019-01-31',
    required: false
  })
  readonly enddate: string;

  @ApiModelProperty({
    example: 'day',
    required: false,
    enum: [
      'day',
      'hour',
      'sec'
    ]
  })
  readonly granularity: TransactionGranularity;
}