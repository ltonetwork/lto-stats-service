import { Injectable } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { NodeService } from '../node/node.service';
import { MonitorRespositoryService } from './monitor-respository.service';
import { Transaction } from './interfaces/transaction.interface';
import { Block } from './interfaces/block.interface';
import delay from 'delay';

@Injectable()
export class MonitorService {
  public processing: boolean;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly node: NodeService,
    private readonly indexer: IndexerService,
    private readonly monitorState: MonitorRespositoryService,
  ) {}

  async start() {
    try {
      if (this.config.getMonitorRestartSync()) {
        await this.monitorState.clearProcessHeight();
      }
      await this.process();
    } catch (e) {
      this.processing = false;
      throw e;
    }
  }

  async process() {
    if (!this.processing) {
      await this.checkNewBlocks();
    }

    await delay(this.config.getMonitorInterval());
    return this.process();
  }

  async checkNewBlocks() {
    this.processing = true;

    const blockHeight = await this.node.getLastBlockHeight();
    const processingHeight = await this.monitorState.getProcessingHeight();
    const ranges = this.node.getBlockRanges(processingHeight, blockHeight);

    for (const range of ranges) {
      this.logger.info(
        `anchor: processing blocks ${range.from} to ${range.to}`,
      );
      const blocks = await this.node.getBlocks(range.from, range.to);

      for (const block of blocks) {
        await this.processBlock(block);
      }

      await this.monitorState.saveProcessingHeight(range.to);
    }

    this.processing = false;
  }

  async processBlock(block: Block) {
    this.logger.debug(`anchor: processing block ${block.height}`);

    await this.indexer.indexBlock(block, await this.isMonitorSynced());

    let position = 0;
    for (const transaction of block.transactions) {
      await this.processTransaction(transaction, block.height, position);
      position++;
    }
  }

  async processTransaction(
    transaction: Transaction,
    blockHeight: number,
    position: number,
  ) {
    const success = await this.indexer.index(transaction, blockHeight);
  }

  async isMonitorSynced() {
    const resp = await this.node.getNodeStatus();
    if (resp && resp.blockchainHeight) {
      const processingHeight = await this.monitorState.getProcessingHeight();
      return (resp.blockchainHeight - 1) <= processingHeight;
    }

    return false;
  }
}
