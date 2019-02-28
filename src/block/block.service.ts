import { Injectable } from '@nestjs/common';
import { BlockRepositoryService } from './block-repository.service';
import { Block } from '../indexer/interfaces/block.interface';
import { BlockTimeGranularity, BlockTimeInstanceType } from './models/blocktime.model';
import moment from 'moment';

@Injectable()
export class BlockService {
  constructor(
    readonly blockRespository: BlockRepositoryService,
  ) {}

  indexBlockTimes(block: Block): Promise<BlockTimeInstanceType[]> {
    return Promise.all([
      this.indexBlockTimeDay(block),
      this.indexBlockTimeAll(block),
    ]);
  }

  getBlockTime(granurality: BlockTimeGranularity): Promise<BlockTimeInstanceType> {
    return this.blockRespository.find(granurality);
  }

  private async indexBlockTimeDay(block: Block): Promise<BlockTimeInstanceType> {
    const blockDate = moment(block.timestamp);
    const granularity = BlockTimeGranularity.Day;

    // Only process blocks from the last day
    if (moment(block.timestamp).isBefore(moment().subtract(1, 'day'))) {
      return null;
    }

    let blockTimeDay = await this.blockRespository.find(granularity);
    if (!blockTimeDay) {
      blockTimeDay = this.blockRespository.new({
        fromDate: blockDate.toDate(),
        toDate: blockDate.toDate(),
        granularity,
        totalTime: 0,
        blocks: 0,
        time: 0,
        samples: [
          {
            height: block.height,
            timestamp: block.timestamp,
          },
        ],
      });
    } else {
      blockTimeDay.samples.push({
        height: block.height,
        timestamp: block.timestamp,
      });

      const samples = blockTimeDay.samples.filter((sample) => {
        return moment(sample.timestamp).isAfter(moment().subtract(1, 'day'));
      });

      samples.sort((a, b) => a.timestamp - b.timestamp);

      let previous = null;
      const totalTime = samples.reduce((sum, sample) => {
        if (!previous) {
          previous = sample;
          return 0;
        }

        const diff = moment(sample.timestamp).diff(moment(previous.timestamp));
        previous = sample;
        return sum + diff;
      }, 0);

      blockTimeDay.blocks = samples.length - 1;
      blockTimeDay.samples = samples;
      blockTimeDay.totalTime = totalTime;
      blockTimeDay.time = blockTimeDay.blocks ? blockTimeDay.totalTime / blockTimeDay.blocks : blockTimeDay.blocks;
    }

    return this.blockRespository.saveBlockTime(blockTimeDay);
  }

  private async indexBlockTimeAll(block: Block): Promise<BlockTimeInstanceType> {
    const blockDate = moment(block.timestamp);
    const granularity = BlockTimeGranularity.All;

    let blockTimeAll = await this.blockRespository.find(granularity);
    if (!blockTimeAll) {
      blockTimeAll = this.blockRespository.new({
        fromDate: blockDate.toDate(),
        toDate: blockDate.toDate(),
        granularity,
        totalTime: 0,
        blocks: 0,
        time: 0,
      });
    } else {
      blockTimeAll.blocks++;
      blockTimeAll.totalTime += blockDate.diff(moment(blockTimeAll.toDate).valueOf());
      blockTimeAll.toDate = blockDate.toDate();
      blockTimeAll.time = blockTimeAll.totalTime / blockTimeAll.blocks;
    }

    return this.blockRespository.saveBlockTime(blockTimeAll);
  }

  indexBlockTransactionCount() {}
}