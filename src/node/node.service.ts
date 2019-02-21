import { Injectable } from '@nestjs/common';
import { NodeApiService } from './node-api.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { Transaction } from '../transaction/interfaces/transaction.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class NodeService {
  constructor(
    private readonly api: NodeApiService,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) { }

  async getNodeWallet(): Promise<string> {
    const response = await this.api.getNodeAddresses();

    if (response instanceof Error) {
      throw response;
    }

    if (!response.data.length) {
      throw new Error(`node: no addresses in node's wallet`);
    }

    return response.data[0];
  }

  async getUnconfirmedAnchor(hash: string): Promise<string | null> {
    const response = await this.api.getUnconfirmedTransactions();

    if (response instanceof Error) {
      throw response;
    }

    const unconfirmed = response.data.filter((transaction) => {
      if (transaction.type !== 12) {
        return false;
      }

      if (transaction.data.find((data) => data.value && data.value === `base64:${hash}`)) {
        return true;
      }

      return false;
    });

    if (unconfirmed.length === 0) {
      return null;
    }

    return unconfirmed.map(transaction => transaction.id)[0];
  }

  async getLastBlockHeight(): Promise<number> {
    const response = await this.api.getLastBlock();

    if (response instanceof Error) {
      throw response;
    }

    return response.data.height;
  }

  async getBlock(id: string | number): Promise<{ height, transactions }> {
    const response = await this.api.getBlock(id);

    if (response instanceof Error) {
      throw response;
    }

    return response.data;
  }

  async getBlocks(from: number, to: number): Promise<Array<{ height, transactions }>> {
    const ranges = this.getBlockRanges(from, to);
    const promises = ranges.map((range) => this.api.getBlocks(range.from, range.to));
    const responses = await Promise.all(promises);

    for (const response of responses) {
      if (response instanceof Error) {
        throw response;
      }
    }

    const data = responses.map((response: AxiosResponse) => response.data);
    return [].concat(...data);
  }

  getBlockRanges(from: number, to: number): Array<{ from, to }> {
    const ranges = [];

    if (from === to) {
      ranges.push({ from, to });
    }

    // public node doesn't allow getting more than 100 blocks at a time
    for (let start = from; start < to; start += 100) {
      const range = start + 99;
      const max = range > to ? to : range;
      ranges.push({ from: start, to: max });
    }

    return ranges;
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    const response = await this.api.getTransaction(id);

    if (response instanceof Error) {
      throw response;
    }

    return response.data;
  }

  async getTransactions(id: string[]): Promise<Transaction[] | null> {
    const promises = id.map((tx) => this.getTransaction(tx));
    return await Promise.all(promises);
  }


  async getNodeStatus(): Promise<{ blockchainHeight, stateHeight, updatedTimestamp, updatedDate }> {
    const response = await this.api.getNodeStatus();

    if (response instanceof Error) {
      throw response;
    }

    return response.data;
  }

  async isNodeHealthy(): Promise<boolean> {
    try {
      const response = await this.getNodeStatus();
      return response && response.blockchainHeight;
    } catch (e) {
      // swallow error
      return false;
    }
  }

  async getNodeInfo(): Promise<{status, address}> {
    const status = await this.getNodeStatus();
    const address = await this.getNodeWallet();

    return { status, address };
  }
}
