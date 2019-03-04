import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Transaction } from './interfaces/transaction.interface';
import { TransactionService } from '../transaction/transaction.service';
import { BlockService } from '../block/block.service';
import { Block } from './interfaces/block.interface';
import { BlockTimeInstanceType } from '../block/models/blocktime.model';

@Injectable()
export class IndexerService {
  public lastBlock: number;
  public txCache: string[];

  constructor(
    private readonly logger: LoggerService,
    private readonly tx: TransactionService,
    private readonly blockService: BlockService,
  ) {
  }

  async index(block: Block, calculate: boolean): Promise<boolean> {
    if (this.lastBlock !== block.height) {
      this.txCache = [];
      await this.blockService.indexBlockTimes(block, calculate);
    }
    this.lastBlock = block.height;

    for (const transaction of block.transactions) {
      await this.indexTransaction(transaction, block.height);
    }
    return true;
  }

  /**
   * Index transaction, returns boolean based on whether or not transaction was successful
   * TransactionModel may be skipped if its already processed
   *
   * @param transaction
   * @param blockHeight
   */
  async indexTransaction(transaction: Transaction, blockHeight: number): Promise<boolean> {
    if (this.txCache.indexOf(transaction.id) > -1) {
      // transaction is already processed
      return false;
    }

    this.txCache.push(transaction.id);

    // Todo: Write indexing actions
    await this.tx.indexTransactionByTypeAndTime(transaction.type, transaction.timestamp);

    return true;
  }
}
