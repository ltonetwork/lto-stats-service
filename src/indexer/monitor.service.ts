import { Injectable } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { NodeService } from '../node/node.service';
import { MonitorRespositoryService } from './monitor-respository.service';
import { Block } from './interfaces/block.interface';
import delay from 'delay';

@Injectable()
export class MonitorService {
  public processing: boolean;
  private shutdown: boolean;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly node: NodeService,
    private readonly indexer: IndexerService,
    private readonly monitorState: MonitorRespositoryService,
  ) {}

  onModuleInit() {
    this.gracefullShutdown = this.gracefullShutdown.bind(this);
    process.on('SIGTERM', this.gracefullShutdown);
    process.on('SIGINT', this.gracefullShutdown);
  }

  async start() {
    try {
      if (this.config.getMonitorRestartSync()) {
        await this.monitorState.clearProcessHeight();
      }
      await this.process();
    } catch (e) {
      this.processing = false;
    }
  }

  async process() {
    if (!this.processing) {
      try {
        await this.checkNewBlocks();
      } catch (e) {
        this.processing = false;
        this.logger.error('Failed to check for new blocks');
      }
    }

    if (this.shutdown) {
      this.logger.info('Shutdown gracefully');
      process.exit(1);
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
        `monitor: processing blocks ${range.from} to ${range.to}`,
      );
      const blocks = await this.node.getBlocks(range.from, range.to);
      for (const block of blocks) {
        await this.processBlock(block);
      }

      await this.monitorState.saveProcessingHeight(range.to);
      if (this.shutdown) {
        this.logger.info('Shutdown gracefully');
        process.exit(1);
      }
    }

    this.processing = false;
  }

  async processBlock(block: Block) {
    this.logger.debug(`monitor: processing block ${block.height}`);

    await this.indexer.index(block, await this.isMonitorSynced());
  }

  async isMonitorSynced() {
    const resp = await this.node.getNodeStatus();
    if (resp && resp.blockchainHeight) {
      const processingHeight = await this.monitorState.getProcessingHeight();
      return (resp.blockchainHeight - 1) <= processingHeight;
    }

    return false;
  }

  async gracefullShutdown() {
    this.logger.info('Shutting down');
    this.shutdown = true;
  }
}
