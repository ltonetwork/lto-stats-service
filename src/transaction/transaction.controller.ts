import { Controller, Post, Req, Res, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TransactionService } from './transaction.service';
import { LoggerService } from '../logger/logger.service';
import { GetTransactionParams } from './api/get-transaction.api';
import moment = require('moment');

@Controller('transactions')
@ApiUseTags('transaction')
export class TransactionController {
  constructor(
    private readonly logger: LoggerService,
    private readonly tx: TransactionService,
  ) {}

  @Get('/')
  @UsePipes(ValidationPipe)
  @ApiOperation({ title: 'Get all transactions' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 500 })
  async get(@Res() res: Response, @Query() params: GetTransactionParams): Promise<object> {
    const endDate = params.enddate ? moment(params.enddate) : moment();
    const startDate = params.startdate ? moment(params.startdate) : endDate.clone().subtract(1, 'week');
    const granularity = this.tx.getGranularity(startDate, endDate, params.granularity);

    const transactions = await this.tx.getTransactions(startDate, endDate, granularity);

    return res.status(200).json(transactions);
  }
}
