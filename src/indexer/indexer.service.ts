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

  indexBlock(block: Block): Promise<BlockTimeInstanceType[]> {
    return this.blockService.indexBlockTimes(block);
  }

  /**
   * Index transaction, returns boolean based on whether or not transaction was successful
   * TransactionModel may be skipped if its already processed
   *
   * @param transaction
   * @param blockHeight
   */
  async index(transaction: Transaction, blockHeight: number): Promise<boolean> {
    if (this.lastBlock !== blockHeight) {
      this.txCache = [];
    }

    this.lastBlock = blockHeight;

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
