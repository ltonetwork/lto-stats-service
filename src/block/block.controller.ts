import { Controller, Get, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Response } from 'express';

import { LoggerService } from '../logger/logger.service';
import { BlockService } from './block.service';
import { GetBlocktimeParams } from './api/get-blocktime.api';
import { BlockTimeGranularity } from './models/blocktime.model';

@Controller('blocks')
@ApiUseTags('block')
export class BlockController {
  constructor(
    private readonly logger: LoggerService,
    private readonly blockService: BlockService,
  ) {}

  @Get('/blocktime')
  @UsePipes(ValidationPipe)
  @ApiOperation({ title: 'Get all transactions' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 500 })
  async blocktime(@Res() res: Response, @Query() params: GetBlocktimeParams): Promise<object> {

    const granularity = params.granularity ? params.granularity : BlockTimeGranularity.Day;
    const blockTime = await this.blockService.getBlockTime(granularity);

    return res.status(200).json(blockTime);
  }
}