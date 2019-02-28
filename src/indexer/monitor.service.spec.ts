import { Test, TestingModule } from '@nestjs/testing';
import { IndexerModuleConfig } from './indexer.module';
import { MonitorService } from './monitor.service';
import { IndexerService } from './indexer.service';
import { NodeService } from '../node/node.service';
import { MonitorRespositoryService } from './monitor-respository.service';
import { Block } from './interfaces/block.interface';

describe('MonitorService', () => {
  let module: TestingModule;
  let monitorService: MonitorService;
  let monitorStateService: MonitorRespositoryService;
  let indexerService: IndexerService;
  let nodeService: NodeService;

  function spy() {
    const monitor = {
      process: jest.spyOn(monitorService, 'process'),
      checkNewBlocks: jest.spyOn(monitorService, 'checkNewBlocks'),
      processBlock: jest.spyOn(monitorService, 'processBlock'),
      processTransaction: jest.spyOn(monitorService, 'processTransaction'),
    };
    const node = {
      getLastBlockHeight: jest.spyOn(nodeService, 'getLastBlockHeight')
        .mockImplementation(() => Promise.resolve(100)),
      getBlock: jest.spyOn(nodeService, 'getBlock')
        .mockImplementation(() => Promise.resolve({ height: 100, transactions: [] })),
      getBlocks: jest.spyOn(nodeService, 'getBlocks')
        .mockImplementation(() => Promise.resolve([{ height: 100, transactions: [] } as Block])),
    };
    const state = {
      getProcessingHeight: jest.spyOn(monitorStateService, 'getProcessingHeight')
        .mockImplementation(() => Promise.resolve(99)),
      saveProcessingHeight: jest.spyOn(monitorStateService, 'saveProcessingHeight')
        .mockImplementation(),
    };
    const indexer = {
      index: jest.spyOn(indexerService, 'index')
        .mockImplementation(() => Promise.resolve(true)),
      indexBlock: jest.spyOn(indexerService, 'indexBlock'),
    };

    return { monitor, node, state, indexer };
  }

  beforeEach(async () => {
    module = await Test.createTestingModule(IndexerModuleConfig).compile();
    await module.init();

    monitorService = module.get<MonitorService>(MonitorService);
    monitorStateService = module.get<MonitorRespositoryService>(MonitorRespositoryService);
    indexerService = module.get<IndexerService>(IndexerService);
    nodeService = module.get<NodeService>(NodeService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('start()', () => {
    test('should start the monitor', async () => {
      const spies = spy();
      spies.monitor.process.mockImplementation();

      await monitorService.start();

      expect(spies.monitor.process.mock.calls.length).toBe(1);
    });
  });

  describe('checkNewBlocks()', () => {
    test('should check the new blocks', async () => {
      const spies = spy();
      spies.monitor.processBlock.mockImplementation();

      await monitorService.checkNewBlocks();

      expect(spies.monitor.processBlock.mock.calls.length).toBe(1);
      expect(spies.monitor.processBlock.mock.calls[0][0]).toEqual({ height: 100, transactions: [] });

      expect(spies.node.getLastBlockHeight.mock.calls.length).toBe(1);
      expect(spies.node.getBlock.mock.calls.length).toBe(0);
      expect(spies.node.getBlocks.mock.calls.length).toBe(1);
      expect(spies.node.getBlocks.mock.calls[0][0]).toEqual(99);
      expect(spies.node.getBlocks.mock.calls[0][1]).toEqual(100);

      expect(spies.state.getProcessingHeight.mock.calls.length).toBe(1);
      expect(spies.state.saveProcessingHeight.mock.calls.length).toBe(1);
      expect(spies.state.saveProcessingHeight.mock.calls[0][0]).toBe(100);
    });
  });

  describe('processBlock()', () => {
    test('should process the block', async () => {
      const spies = spy();
      spies.monitor.processTransaction.mockImplementation();
      spies.indexer.indexBlock.mockImplementation();

      const block = {
        height: 100, transactions: [
          { id: 1 },
          { id: 2 },
        ],
      };
      await monitorService.processBlock(block as any);

      expect(spies.indexer.indexBlock.mock.calls.length).toBe(1);
      expect(spies.indexer.indexBlock.mock.calls[0][0]).toEqual(block);
      expect(spies.monitor.processTransaction.mock.calls.length).toBe(2);
      expect(spies.monitor.processTransaction.mock.calls[0][0]).toEqual(block.transactions[0]);
      expect(spies.monitor.processTransaction.mock.calls[1][0]).toEqual(block.transactions[1]);
    });
  });

  describe('processTransaction()', () => {
    test('should process the anchor transaction', async () => {
      const spies = spy();

      const transaction = {
        id: 'fake_transaction',
        type: 15,
        anchors: [
          '3zLWTHPNkmDsCRi2kZqFXFSBnTYykz13gHLezU4p6zmu',
        ],
      };
      await monitorService.processTransaction(transaction as any, 1, 0);

      expect(spies.indexer.index.mock.calls.length).toBe(1);
      expect(spies.indexer.index.mock.calls[0][0]).toEqual(transaction);

    });
  });
});
